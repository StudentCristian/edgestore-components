import { executeWebSearch } from '@/lib/search/baml-tools';
import { NextRequest, NextResponse } from 'next/server';

interface SearchAllRequest {
  query: string;
  imageLimit?: number;  // Default: 20 para UI
  videoLimit?: number;  // Default: 20 para UI
}

export async function POST(req: NextRequest) {
  try {
    const { query, imageLimit = 20, videoLimit = 20 }: SearchAllRequest = await req.json();

    // Validación del query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    // Ejecutar búsquedas en paralelo para mejor performance
    const [imagesResult, videosResult] = await Promise.all([
      executeWebSearch({
        query: trimmedQuery,
        engines: ['bing images', 'google images']
      }),
      executeWebSearch({
        query: trimmedQuery,
        engines: ['youtube']
      })
    ]);

    // Aplicar límites
    const images = imagesResult.slice(0, imageLimit).map(img => ({
      url: img.url,
      title: img.title,
      img_src: img.img_src,
      source: img.url
    }));

    const videos = videosResult.slice(0, videoLimit).map(video => ({
      url: video.url,
      title: video.title,
      img_src: video.img_src,       // thumbnail del video
      iframe_src: video.iframe_src  // URL de embed
    }));

    return NextResponse.json({
      query: trimmedQuery,
      images,
      videos,
      meta: {
        totalImages: images.length,
        totalVideos: videos.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in unified search:', error);
    return NextResponse.json(
      { error: 'Failed to search images and videos' },
      { status: 500 }
    );
  }
}