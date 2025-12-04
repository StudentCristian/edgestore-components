import { NextRequest, NextResponse } from 'next/server';  
import "@/lib/docx/setup-jsdom";  
import { patchDocument, PatchType, MarkdownPatchProcessor } from "docx";  
import { FieldData } from "@/lib/docx/types";
  
// Image resolver function  
async function resolveImageFromUrl(url: string): Promise<{ image: Buffer; width: number; height: number; type: "jpg" | "png" | "gif" | "bmp" }> {  
    try {  
        const response = await fetch(url);  
        if (!response.ok) {  
            throw new Error(`HTTP error! status: ${response.status}`);  
        }  
            
        const buffer = await response.arrayBuffer();  
            
        // Determinar tipo basado en la URL o headers  
        const contentType = response.headers.get('content-type');  
        let type: "jpg" | "png" | "gif" | "bmp" = "png";  
            
        if (contentType?.includes('jpeg') || url.includes('.jpg') || url.includes('.jpeg')) {  
            type = "jpg";  
        } else if (contentType?.includes('png') || url.includes('.png')) {  
            type = "png";  
        } else if (contentType?.includes('gif') || url.includes('.gif')) {  
            type = "gif";  
        } else if (contentType?.includes('bmp') || url.includes('.bmp')) {  
            type = "bmp";  
        }  
            
        return {  
            image: Buffer.from(buffer),  
            width: 400,  
            height: 300,  
            type  
        };  
    } catch (error) {  
        console.warn(`Failed to resolve image: ${url}`, error);  
        throw error;  
    }  
}  
  
export async function POST(req: NextRequest) {  
    try {  
        const formData = await req.formData();  
        const templateFile = formData.get('template') as File;  
        const fieldsStr = formData.get('fields') as string;  
          
        if (!templateFile || !fieldsStr) {  
            return NextResponse.json({   
                error: 'Missing required data',   
                message: 'Template and fields are required'   
            }, { status: 400 });  
        }  
  
        const templateBuffer = Buffer.from(await templateFile.arrayBuffer());  
        const fields: Record<string, FieldData> = JSON.parse(fieldsStr);  
  
        if (!fields) {  
            return NextResponse.json({   
                error: 'Missing fields',   
                message: 'Fields are required for conversion'   
            }, { status: 400 });  
        }  
  
        // Construir markdownPatches dinámicamente  
        const markdownPatches: Record<string, any> = {};  
            
        for (const [placeholderId, field] of Object.entries(fields)) {  
            const content = field.isPrompt && field.generatedValue     
                ? field.generatedValue     
                : field.originalValue;  
                    
            if (content && content.trim().length > 0) {  
                markdownPatches[placeholderId] = {  
                    type: PatchType.DOCUMENT,  
                    markdownContent: content.trim(),  
                    imageResolver: resolveImageFromUrl  
                };  
            }  
        }  
  
        // Verificar que hay patches para procesar  
        if (Object.keys(markdownPatches).length === 0) {  
            return NextResponse.json({   
                error: 'No content to patch',   
                message: 'All fields are empty'   
            }, { status: 400 });  
        }  
  
        console.log(`Processing ${Object.keys(markdownPatches).length} patches using batch processing`);  
  
        // Usar processMarkdownPatches  
        const processor = new MarkdownPatchProcessor();  
        const docPatches = await processor.processMarkdownPatches(markdownPatches);  
  
        console.log(`Applying ${Object.keys(docPatches).length} patches to document`);  
            
        const result = await patchDocument({  
            outputType: "nodebuffer",  
            data: templateBuffer,  
            patches: docPatches  
        });  
  
        console.log("Document generated successfully");  
  
    const stream = new ReadableStream({  
        start(controller) {  
            controller.enqueue(result);  
            controller.close();  
        }  
    });  
    
    return new NextResponse(stream, {  
        headers: {  
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  
            'Content-Disposition': 'attachment; filename=converted.docx'  
        }  
    });
            
    } catch (error) {  
        console.error("Conversion error:", error);  
        return NextResponse.json({     
            error: 'Conversion failed',     
            details: error instanceof Error ? error.message : 'Unknown error'     
        }, { status: 500 });  
    }  
}