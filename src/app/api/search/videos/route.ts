import { b } from '@/baml_client';  
import { executeWebSearch } from '@/lib/search/baml-tools';  
import { NextRequest, NextResponse } from 'next/server';  
  
export async function POST(req: NextRequest) {  
  try {  
    const { query, chatHistory } = await req.json();  
      
    // Extrae el query y engines con BAML  
    const searchTool = await b.ExecuteWebSearch(query);  
      
    // Ejecuta la búsqueda con SearxNG para videos  
    const videos = await executeWebSearch({  
      query: searchTool.query,  
      engines: ['youtube']  
    });  
      
    return NextResponse.json({ videos });  
  } catch (error) {  
    console.error('Error searching videos:', error);  
    return NextResponse.json(  
      { error: 'Failed to search videos' },  
      { status: 500 }  
    );  
  }  
}