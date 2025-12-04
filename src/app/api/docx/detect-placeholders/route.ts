import { NextRequest, NextResponse } from 'next/server';  
import "@/lib/docx/setup-jsdom";  
import JSZip from 'jszip';  
  
// Función para encontrar placeholders en el texto (formato {{placeholder}})  
const findPatchKeys = (text: string): string[] => {  
    if (!text) return [];  
    const regex = /\{\{([^}]+)\}\}/g;  
    const matches: string[] = [];  
    let match;  
    while ((match = regex.exec(text)) !== null) {  
        matches.push(match[1].trim());  
    }  
    return matches;  
};  
  
// Detector de placeholders mejorado - extrae todo el texto del XML  
const patchDetector = async (data: Buffer): Promise<{  
    readonly placeholders: readonly string[];  
    readonly listPatches: readonly string[];  
}> => {  
    const zipContent = await JSZip.loadAsync(data);  
    const patches = new Set<string>();  
    const listPatches = new Set<string>();  
  
    // Recopilar todo el texto de todos los archivos XML relevantes  
    let allText = "";  
  
    for (const [key, value] of Object.entries(zipContent.files)) {  
        // Solo procesar archivos XML en la carpeta word/  
        if (!key.startsWith("word/") || !key.endsWith(".xml")) {  
            continue;  
        }  
        // Ignorar archivos de relaciones  
        if (key.endsWith(".xml.rels")) {  
            continue;  
        }  
  
        try {  
            const xmlContent = await value.async("text");  
              
            // Método 1: Extraer texto entre tags XML usando regex  
            const textMatches = xmlContent.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);  
            if (textMatches) {  
                textMatches.forEach(match => {  
                    const textContent = match.replace(/<[^>]+>/g, '');  
                    allText += textContent;  
                });  
            }  
              
            // Método 2: Buscar directamente en el XML crudo  
            const rawPlaceholders = findPatchKeys(xmlContent);  
            rawPlaceholders.forEach(p => patches.add(p));  
              
        } catch (err) {  
            console.error(`Error processing ${key}:`, err);  
        }  
    }  
  
    // Buscar placeholders en el texto concatenado  
    const textPlaceholders = findPatchKeys(allText);  
    textPlaceholders.forEach(p => patches.add(p));  
  
    // Clasificar patches de lista  
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
          
        // Validar que es un archivo DOCX  
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