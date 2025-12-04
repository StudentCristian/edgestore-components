import { NextRequest, NextResponse } from 'next/server';
import { b } from '@/baml_client';
import TypeBuilder from '@/baml_client/type_builder';

export async function POST(request: NextRequest) {
  try {
    const { structuredData } = await request.json();
    
    // Separar campos de tipo "data" y "prompt"
    const dataFields = structuredData.data || {};
    const promptFields = structuredData.prompt || {};
    
    if (Object.keys(promptFields).length === 0) {
      return NextResponse.json({ success: true, data: {} });
    }
    
    // ✅ Construir context_data con campos de tipo "data"
    const contextData = Object.keys(dataFields).length > 0
      ? Object.entries(dataFields)
          .map(([field, value]) => `${field}: ${value}`)
          .join('\n')
      : 'Sin información de contexto adicional';
    
    // ✅ Construir fields_data con los VALORES REALES del formulario
    const fieldsData = Object.entries(promptFields)
      .map(([field, userInstruction]) => {
        if (typeof userInstruction === 'string' && userInstruction.trim()) {
          // Instrucción personalizada del usuario
          return `${field}: ${userInstruction}`;
        } else {
          // ✅ Generar instrucción automática basada en el contexto
          return `${field}: genera contenido apropiado para ${field} basado en el contexto proporcionado`;
        }
      })
      .join('\n\n');
    
    // Crear TypeBuilder dinámicamente
    const tb = new TypeBuilder();
    Object.entries(promptFields).forEach(([field, prompt]) => {
      tb.DynamicFields.addProperty(field, tb.string()).description(prompt as string);
    });
    
    // ✅ Llamar a BAML con los dos parámetros separados
    const aiResponse = await b.ProcessForm(contextData, fieldsData, { tb });
    
    return NextResponse.json({ success: true, data: aiResponse });
    
  } catch (error) {
    console.error('BAML AI generation failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'AI content generation failed' 
      },
      { status: 500 }
    );
  }
}