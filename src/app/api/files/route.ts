import { type NextRequest } from 'next/server';
import { backendClient } from '@/lib/edgestore-server';

export async function GET(request: NextRequest) {
  try {
    // Obtener los archivos del bucket específico
    const result = await backendClient.myPublicFiles.listFiles({
      pagination: {
        pageSize: 50, // Ajusta según tus necesidades
        currentPage: 1,
      },
    });

    // Transformar el resultado para que coincida con tu tipo StoredFile
    const files = result.data.map((file) => ({
      url: file.url,
      filename: file.name || file.url.split('/').pop() || 'Archivo sin nombre',
      uploadedAt: file.uploadedAt,
    }));

    return Response.json({ files });
  } catch (error) {
    console.error('Error al listar archivos:', error);
    return Response.json(
      { error: 'Error al obtener la lista de archivos' },
      { status: 500 }
    );
  }
}