import { executeWebSearch } from '@/lib/search/baml-tools';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, engines } = await req.json();

    // Validación del query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Búsqueda manual directa a SearXNG (sin IA/BAML)
    const images = await executeWebSearch({
      query: query.trim(),
      engines: engines || ['bing images', 'google images']
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error in manual image search:', error);
    return NextResponse.json(
      { error: 'Failed to search images' },
      { status: 500 }
    );
  }
}
