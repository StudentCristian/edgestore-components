import { NextRequest, NextResponse } from 'next/server';
import { b } from '@/baml_client';
import TypeBuilder from '@/baml_client/type_builder';

interface StructuredData {
  data: Record<string, unknown>;
  prompt: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const { structuredData } = await request.json() as { structuredData: StructuredData };
    
    // Process AI prompts if any exist
    if (Object.keys(structuredData.prompt).length > 0) {
      // Create TypeBuilder instance for dynamic schema
      const tb = new TypeBuilder();
      
      // Build context data string from "data" type fields
      const contextData = Object.entries(structuredData.data)
        .map(([field, value]) => `${field}: ${value}`)
        .join('\n');
      
      // Build field data string from "prompt" type fields
      const fieldsData = Object.entries(structuredData.prompt)
        .map(([field, prompt]) => `${field}: ${prompt}`)
        .join('\n\n');
      
      // Dynamically add properties to DynamicFields based on prompts
      Object.entries(structuredData.prompt).forEach(([field, prompt]) => {
        tb.DynamicFields.addProperty(field, tb.string()).description(prompt);
      });
      
      // Call BAML function with context data, field data, and TypeBuilder
      const aiResponse = await b.ProcessForm(contextData, fieldsData, { tb });
      
      return NextResponse.json({ success: true, data: aiResponse });
    }
    
    return NextResponse.json({ success: true, data: {} });
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