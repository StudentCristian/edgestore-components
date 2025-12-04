import { b } from '@/baml_client';  
import { executeWebSearch } from '@/lib/search/baml-tools';  
import { NextRequest, NextResponse } from 'next/server';  
  
export async function POST(req: NextRequest) {  
  try {  
    const { query, chatHistory } = await req.json();  
      
    // Extrae el query y engines con BAML  
    const searchTool = await b.ExecuteWebSearch(query);  
      
    // CORRECCIÓN: Pasa un solo objeto con ambas propiedades  
    const images = await executeWebSearch({  
      query: searchTool.query,  
      engines: ['bing images', 'google images']  
    });  
      
    return NextResponse.json({ images });  
  } catch (error) {  
    console.error('Error searching images:', error);  
    return NextResponse.json(  
      { error: 'Failed to search images' },  
      { status: 500 }  
    );  
  }  
}