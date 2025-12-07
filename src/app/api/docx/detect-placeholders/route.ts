import { NextRequest, NextResponse } from 'next/server';  
import "@/lib/docx/setup-jsdom";  
import JSZip from 'jszip';  
import { xml2js, Element } from 'xml-js';  
  
// Tipos para el traverser  
type ElementWrapper = {  
    readonly element: Element;  
    readonly index: number;  
    readonly parent: ElementWrapper | undefined;  
};  
  
type IRenderedParagraphNode = {  
    readonly text: string;  
    readonly pathToParagraph: readonly number[];  
    readonly runs: readonly {  
        readonly start: number;  
        readonly end: number;  
        readonly parts: readonly {  
            readonly start: number;  
            readonly end: number;  
            readonly text: string;  
        }[];  
    }[];  
};  
  
// Utilidad para convertir XML a JSON  
const toJson = (xml: string): Element => {  
    return xml2js(xml, {  
        compact: false,  
        captureSpacesBetweenElements: true,  
        attributeValueFn: (value: string) => value,  
    }) as Element; 
};  
  
// Wrapper para elementos  
const elementsToWrapper = (wrapper: ElementWrapper): readonly ElementWrapper[] =>  
    wrapper.element.elements?.map((e, i) => ({  
        element: e,  
        index: i,  
        parent: wrapper,  
    })) ?? [];  
  
// Traverser - recorre el XML buscando párrafos  
const traverse = (node: Element): readonly IRenderedParagraphNode[] => {  
    let renderedParagraphs: readonly IRenderedParagraphNode[] = [];  
  
    const queue: ElementWrapper[] = [  
        ...elementsToWrapper({  
            element: node,  
            index: 0,  
            parent: undefined,  
        }),  
    ];  
  
    let currentNode: ElementWrapper | undefined;  
    while (queue.length > 0) {  
        currentNode = queue.shift()!;  
  
        if (currentNode.element.name === "w:p") {  
            renderedParagraphs = [...renderedParagraphs, renderParagraphNode(currentNode)];  
        }  
        queue.push(...elementsToWrapper(currentNode));  
    }  
  
    return renderedParagraphs;  
};  
  
// Run Renderer - reconstruye texto de párrafos fragmentados  
const renderParagraphNode = (wrapper: ElementWrapper): IRenderedParagraphNode => {  
    const pathToParagraph: number[] = [];  
    let current: ElementWrapper | undefined = wrapper;  
      
    while (current) {  
        pathToParagraph.unshift(current.index);  
        current = current.parent;  
    }  
  
    const runs = wrapper.element.elements  
        ?.filter((e): e is Element => e.type === 'element' && e.name === 'w:r')  
        .map((runElement) => {  
            const textParts = runElement.elements  
                ?.filter((e): e is Element => e.type === 'element' && e.name === 'w:t')  
                .map((textElement) => ({  
                    text: textElement.elements?.map(e => e.type === 'text' ? e.text : '').join('') ?? '',  
                    start: 0,  
                    end: 0,  
                })) ?? [];  
  
            let currentPos = 0;  
            const processedParts = textParts.map(part => {  
                const start = currentPos;  
                currentPos += part.text.length;  
                return {  
                    ...part,  
                    start,  
                    end: currentPos,  
                };  
            });  
  
            const totalText = processedParts.map(p => p.text).join('');  
              
            return {  
                start: 0,  
                end: totalText.length,  
                parts: processedParts,  
            };  
        }) ?? [];  
  
    const fullText = runs.map(run => run.parts.map(part => part.text).join('')).join('');  
  
    return {  
        text: fullText,  
        pathToParagraph,  
        runs,  
    };  
};  
  
// Detector compatible con ES2015  
const findPatchKeys = (text: string): readonly string[] => {  
    const regex = /\{\{([^}]+)\}\}/g;  
    const matches: string[] = [];  
    let match;  
    while ((match = regex.exec(text)) !== null) {  
        matches.push(match[1].trim());  
    }  
    return matches;  
};  
  
// Detector principal  
const patchDetector = async (data: Buffer): Promise<{  
    readonly placeholders: readonly string[];  
    readonly listPatches: readonly string[];  
}> => {  
    const zipContent = await JSZip.loadAsync(data);  
    const patches = new Set<string>();  
    const listPatches = new Set<string>();  
  
    for (const [key, value] of Object.entries(zipContent.files)) {  
        if (!key.endsWith(".xml") && !key.endsWith(".rels")) {  
            continue;  
        }  
        if (key.startsWith("word/") && !key.endsWith(".xml.rels")) {  
            try {  
                const xmlContent = await value.async("text");  
                const json = toJson(xmlContent);  
                  
                // Usar el traverser para encontrar párrafos y detectar placeholders  
                traverse(json).forEach((p) => {  
                    findPatchKeys(p.text).forEach((patch) => patches.add(patch));  
                });  
            } catch (err) {  
                console.error(`Error processing ${key}:`, err);  
            }  
        }  
    }  
  
    patches.forEach(patch => {  
        if (patch.includes("_list") || patch.includes("_numbered") || patch.includes("_bullet") || patch.includes("-list")) {  
            listPatches.add(patch);  
        }  
    });  
  
    console.log("Detected placeholders:", Array.from(patches));  
      
    return {  
        placeholders: Array.from(patches),  
        listPatches: Array.from(listPatches)  
    };  
};  
  
export async function POST(req: NextRequest) {  
    try {  
        const formData = await req.formData();  
        const file = formData.get('template') as File;  
          
        if (!file) {  
            return NextResponse.json({   
                error: 'No template file provided',  
                message: 'Please upload a DOCX file'  
            }, { status: 400 });  
        }  
  
        const templateBuffer = Buffer.from(await file.arrayBuffer());  
          
        if (!file.name.toLowerCase().endsWith('.docx')) {  
            return NextResponse.json({   
                error: 'Invalid file type',  
                message: 'Only DOCX files are supported'  
            }, { status: 400 });  
        }  
  
        const result = await patchDetector(templateBuffer);  
  
        return NextResponse.json({  
            placeholders: result.placeholders,  
            listPatches: result.listPatches,  
            fileName: file.name,  
            fileSize: file.size  
        });  
  
    } catch (error) {  
        console.error("Placeholder detection error:", error);  
        return NextResponse.json({   
            error: 'Detection failed',   
            details: error instanceof Error ? error.message : 'Unknown error'  
        }, { status: 500 });  
    }  
}