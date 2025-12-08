import { NextRequest, NextResponse } from 'next/server';  
import "@/lib/docx/setup-jsdom";  
import { patchDocument, PatchType, MarkdownPatchProcessor } from "docx";  
import { FieldData } from "@/lib/docx/types";

// Image resolver function con manejo robusto de errores
// Retorna null si la imagen no se puede cargar (será omitida del documento)
async function resolveImageFromUrl(
    url: string, 
    failedImages: string[]
): Promise<{ image: Buffer; width: number; height: number; type: "jpg" | "png" | "gif" | "bmp" } | null> {  
    // Timeout de 10 segundos para evitar bloqueos largos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {  
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                // Algunos servidores bloquean requests sin User-Agent
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/*,*/*'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {  
            console.warn(`[ImageResolver] HTTP ${response.status}: ${url}`);
            failedImages.push(url);
            return null;
        }  
        
        // Verificar que es realmente una imagen
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('image')) {
            console.warn(`[ImageResolver] Not an image (${contentType}): ${url}`);
            failedImages.push(url);
            return null;
        }
            
        const buffer = await response.arrayBuffer();
        
        // Verificar tamaño mínimo (una imagen válida debe tener al menos algunos bytes)
        if (buffer.byteLength < 100) {
            console.warn(`[ImageResolver] Image too small (${buffer.byteLength} bytes): ${url}`);
            failedImages.push(url);
            return null;
        }
            
        // Determinar tipo basado en content-type o URL  
        let type: "jpg" | "png" | "gif" | "bmp" = "png";  
            
        if (contentType.includes('jpeg') || contentType.includes('jpg') || url.includes('.jpg') || url.includes('.jpeg')) {  
            type = "jpg";  
        } else if (contentType.includes('png') || url.includes('.png')) {  
            type = "png";  
        } else if (contentType.includes('gif') || url.includes('.gif')) {  
            type = "gif";  
        } else if (contentType.includes('bmp') || url.includes('.bmp')) {  
            type = "bmp";  
        }  
        
        console.log(`[ImageResolver] OK: ${url.substring(0, 60)}...`);
            
        return {  
            image: Buffer.from(buffer),  
            width: 400,  
            height: 300,  
            type  
        };  
    } catch (error) {
        clearTimeout(timeoutId);
        
        // Logging según tipo de error
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn(`[ImageResolver] Timeout (>10s): ${url}`);
        } else {
            console.warn(`[ImageResolver] Failed: ${url} - ${errorMsg}`);
        }
        
        failedImages.push(url);
        return null; // Retornar null en lugar de throw - imagen será omitida
    }  
}  
  
export async function POST(req: NextRequest) {  
    // Array para rastrear imágenes que fallaron
    const failedImages: string[] = [];
    
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
        
        // Crear imageResolver que pasa el array de failedImages
        const imageResolver = (url: string) => resolveImageFromUrl(url, failedImages);
            
        for (const [placeholderId, field] of Object.entries(fields)) {  
            const content = field.isPrompt && field.generatedValue     
                ? field.generatedValue     
                : field.originalValue;  
                    
            if (content && content.trim().length > 0) {  
                markdownPatches[placeholderId] = {  
                    type: PatchType.DOCUMENT,  
                    markdownContent: content.trim(),  
                    imageResolver  
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
        
        // Log de imágenes fallidas si las hay
        if (failedImages.length > 0) {
            console.warn(`[Convert] ${failedImages.length} images failed to load and were omitted`);
        }

    const stream = new ReadableStream({  
        start(controller) {  
            controller.enqueue(result);  
            controller.close();  
        }  
    });
    
    // Incluir header con cantidad de imágenes fallidas para que el frontend pueda mostrar warning
    const headers: Record<string, string> = {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename=converted.docx'
    };
    
    if (failedImages.length > 0) {
        headers['X-Failed-Images-Count'] = String(failedImages.length);
    }
    
    return new NextResponse(stream, { headers });
            
    } catch (error) {  
        console.error("Conversion error:", error);  
        return NextResponse.json({     
            error: 'Conversion failed',     
            details: error instanceof Error ? error.message : 'Unknown error'     
        }, { status: 500 });  
    }  
}