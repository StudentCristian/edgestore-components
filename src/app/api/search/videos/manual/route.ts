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
    const videos = await executeWebSearch({
      query: query.trim(),
      engines: engines || ['youtube']
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error in manual video search:', error);
    return NextResponse.json(
      { error: 'Failed to search videos' },
      { status: 500 }
    );
  }
}
