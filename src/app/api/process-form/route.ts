// src/app/api/process-form/route.ts  
import { NextRequest, NextResponse } from 'next/server';  
import { b } from '@/baml_client';  
import TypeBuilder from '@/baml_client/type_builder';  
import fs from 'fs';  
  
// 🆕 NUEVA: Función auxiliar para normalizar período  
function normalizePeriodo(periodo: string): string {  
  const periodoLower = periodo.toLowerCase().trim();  
  const periodoMap: { [key: string]: string } = {  
    'primer': '1',  
    'primero': '1',  
    'segundo': '2',  
    'tercer': '3',  
    'tercero': '3',  
    'cuarto': '4'  
  };  
    
  return periodoMap[periodoLower] || periodo;  
}  
  
// 🆕 ACTUALIZADA: Función auxiliar para identificar tipos de campo  
function getFieldType(fieldName: string): string {  
  const curricularFields = [  
    'estandar', 'evidencia', 'indicador_desempeno'  
  ];  
    
  const pedagogicalFields = [  
    'exploracion', 'estructuracion', 'actividades'  
  ];  
    
  const fieldLower = fieldName.toLowerCase();  
    
  if (curricularFields.some(field => fieldLower.includes(field))) {  
    return 'Campo curricular';  
  } else if (pedagogicalFields.some(field => fieldLower.includes(field))) {  
    return 'Fase pedagógica';  
  } else {  
    return 'Campo extenso';  
  }  
}  
  
// 🆕 NUEVA: Función auxiliar para logging y debugging (opcional)  
function logProcessingInfo(dataFields: any, promptFields: any, useRAG: boolean) {  
  console.log('=== PROCESAMIENTO DE FORMULARIO ===');  
  console.log('Campos de datos:', Object.keys(dataFields));  
  console.log('Campos de prompt:', Object.keys(promptFields));  
  console.log('RAG activado:', useRAG);  
    
  if (dataFields.grado || dataFields.periodo || dataFields.tema) {  
    console.log('Parámetros curriculares detectados:');  
    console.log(`- Grado: ${dataFields.grado || 'No especificado'}`);  
    console.log(`- Período: ${dataFields.periodo || 'No especificado'}`);  
    console.log(`- Tema: ${dataFields.tema || 'No especificado'}`);  
  }  
}  
  
export async function POST(request: NextRequest) {  
  try {  
    const { structuredData, mediaContext, useRAG = true } = await request.json();  
      
    // Separar campos de tipo "data" y "prompt"  
    const dataFields = structuredData.data || {};  
    const promptFields = structuredData.prompt || {};  
      
    if (Object.keys(promptFields).length === 0) {  
      return NextResponse.json({ success: true, data: {} });  
    }  
      
    // 🔄 SIMPLIFICADO: Extraer curriculum directamente (sin verificación de CAMPO_VACIO)  
    let organizedCurriculum = '';  
      
    if (useRAG && dataFields.grado && dataFields.periodo && dataFields.tema) {  
      try {  
        console.log('🔄 Iniciando extracción RAG...');  
          
        // Leer archivo de curriculum  
        const curriculumContent = fs.readFileSync('baml_src/context.md', 'utf-8');  
        console.log(`📚 Curriculum cargado: ${curriculumContent.length} caracteres`);  
          
        // Normalizar período  
        const normalizedPeriodo = normalizePeriodo(dataFields.periodo);  
        console.log('🔍 Búsqueda curricular:');  
        console.log(`   - Grado: ${dataFields.grado}`);  
        console.log(`   - Período: ${dataFields.periodo} → ${normalizedPeriodo}`);  
        console.log(`   - Tema: ${dataFields.tema}`);  
          
        // Extraer datos curriculares (ahora genera contenido para campos vacíos)  
        organizedCurriculum = await b.ExtractCurriculumData(  
          curriculumContent,  
          dataFields.grado,  
          normalizedPeriodo,  
          dataFields.tema  
        );  
          
        console.log('✅ Extracción curricular completada');  
        console.log(`📝 Curriculum organizado: ${organizedCurriculum.length} caracteres`);  
          
      } catch (error) {  
        console.error('❌ Error en extracción RAG:', error);  
        organizedCurriculum = 'Error al extraer datos curriculares';  
      }  
    }  
      
    // ✅ Construir context_data con campos de tipo "data"  
    let contextData = Object.keys(dataFields).length > 0  
      ? Object.entries(dataFields)  
          .map(([field, value]) => `${field}: ${value}`)  
          .join('\n')  
      : 'Sin información de contexto adicional';  
      
    // 🆕 AGREGAR: Información curricular extraída  
    if (organizedCurriculum && organizedCurriculum.trim()) {  
      contextData += '\n\n=== DATOS CURRICULARES EXTRAÍDOS ===\n';  
      contextData += organizedCurriculum;  
      contextData += '\n\nIMPORTANTE: Usa los valores exactos de "DATOS CURRICULARES EXTRAÍDOS" para los campos curriculares.';  
    }  
      
    // 🔄 CAMBIO: Preparar media_context por separado (ya no se incluye en contextData)  
    let mediaContextForBaml = '';  
    if (mediaContext && typeof mediaContext === 'string' && mediaContext.trim()) {  
      mediaContextForBaml = mediaContext;  
    }  
      
    // ✅ Construir fields_data con los VALORES REALES del formulario  
    const fieldsData = Object.entries(promptFields)  
      .map(([field, userInstruction]) => {  
        if (typeof userInstruction === 'string' && userInstruction.trim()) {  
          // Instrucción personalizada del usuario  
          return `${field}: ${userInstruction}`;  
        } else {  
          // ✅ Generar instrucción automática basada en el contexto  
          const fieldType = getFieldType(field);  
          return `${field}: genera contenido apropiado para ${field} basado en el contexto proporcionado`;  
        }  
      })  
      .join('\n\n');  
      
    // 🆕 LOGGING: Información de procesamiento  
    logProcessingInfo(dataFields, promptFields, useRAG);  
      
    console.log(`📊 Contexto final: ${contextData.length} caracteres`);  
    console.log(`📝 Fields data: ${fieldsData.length} caracteres`);  
    console.log(`🎬 Media context: ${mediaContextForBaml.length} caracteres`);  
      
    // Crear TypeBuilder dinámicamente  
    const tb = new TypeBuilder();  
    Object.entries(promptFields).forEach(([field, prompt]) => {  
      tb.DynamicFields.addProperty(field, tb.string()).description(prompt as string);  
    });  
      
    // ✅ Llamar a BAML con media_context como parámetro separado  
    const aiResponse = await b.ProcessForm(  
      contextData,   
      fieldsData,   
      mediaContextForBaml,  // 🆕 Parámetro separado  
      { tb }  
    );  
      
    console.log('✅ Procesamiento completado');  
    console.log('📤 Campos generados:', Object.keys(aiResponse));  
      
    return NextResponse.json({ success: true, data: aiResponse });  
      
  } catch (error) {  
    console.error('❌ BAML AI generation failed:', error);  
      
    // Log detallado del error  
    if (error instanceof Error) {  
      console.error('Error message:', error.message);  
      console.error('Error stack:', error.stack);  
    }  
      
    return NextResponse.json(  
      {   
        success: false,   
        error: error instanceof Error ? error.message : 'AI content generation failed',  
        details: process.env.NODE_ENV === 'development' ? error : undefined  
      },  
      { status: 500 }  
    );  
  }  
}