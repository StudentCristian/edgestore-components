'use client';

import { useState, useCallback } from 'react';
import { SearchResultsPanel, ImageResult, VideoResult, SearchResults } from '@/components/search';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function TestPanel() {
  const [selectable, setSelectable] = useState(true);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  // Solo guardar el markdown para BAML (más eficiente)
  const [selectedImagesMarkdown, setSelectedImagesMarkdown] = useState<string[]>([]);
  const [selectedVideosMarkdown, setSelectedVideosMarkdown] = useState<string[]>([]);

  // Limpiar selecciones cuando se hace una nueva búsqueda
  const handleSearchComplete = useCallback((results: SearchResults) => {
    setSelectedImages(new Set());
    setSelectedVideos(new Set());
    setSelectedImagesMarkdown([]);
    setSelectedVideosMarkdown([]);
  }, []);

  const handleImageSelect = useCallback((image: ImageResult) => {
    const markdown = `![${image.title}](${image.img_src})`;
    
    setSelectedImages((prev) => {
      const isSelected = prev.has(image.img_src);
      const next = new Set(prev);
      
      if (isSelected) {
        next.delete(image.img_src);
        setSelectedImagesMarkdown((prevMd) => prevMd.filter(md => md !== markdown));
      } else {
        next.add(image.img_src);
        setSelectedImagesMarkdown((prevMd) => [...prevMd, markdown]);
      }
      
      return next;
    });
  }, []);

  const handleVideoSelect = useCallback((video: VideoResult) => {
    const videoId = video.iframe_src || video.url;
    const markdown = `[![${video.title}](${video.img_src})](${video.url})`;
    
    setSelectedVideos((prev) => {
      const isSelected = prev.has(videoId);
      const next = new Set(prev);
      
      if (isSelected) {
        next.delete(videoId);
        setSelectedVideosMarkdown((prevMd) => prevMd.filter(md => md !== markdown));
      } else {
        next.add(videoId);
        setSelectedVideosMarkdown((prevMd) => [...prevMd, markdown]);
      }
      
      return next;
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Prueba de Panel de Búsqueda</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="selectable"
              checked={selectable}
              onCheckedChange={setSelectable}
            />
            <Label htmlFor="selectable">Modo Selección</Label>
          </div>
        </div>
      </div>

      {selectable && (
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">
            Imágenes: {selectedImages.size}/5
          </Badge>
          <Badge variant="outline">
            Videos: {selectedVideos.size}/5
          </Badge>
          <Badge>
            Total: {selectedImages.size + selectedVideos.size}/10
          </Badge>
        </div>
      )}

      <div className="h-[600px]">
        <SearchResultsPanel
          selectable={selectable}
          selectedImages={selectedImages}
          selectedVideos={selectedVideos}
          onImageSelect={handleImageSelect}
          onVideoSelect={handleVideoSelect}
          onSearchComplete={handleSearchComplete}
          maxImageSelection={5}
          maxVideoSelection={5}
        />
      </div>

      {selectable && (selectedImages.size > 0 || selectedVideos.size > 0) && (
        <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
          <h3 className="font-medium">Multimedia Seleccionada</h3>
          
          {/* Contexto Markdown para BAML - simple y eficiente */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Contexto BAML (solo Markdown):</h4>
            <pre className="text-xs overflow-auto max-h-32 p-2 bg-background rounded border">
              {JSON.stringify(
                {
                  images: selectedImagesMarkdown,
                  videos: selectedVideosMarkdown,
                },
                null,
                2
              )}
            </pre>
          </div>

          {/* Preview Markdown generado */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Vista previa Markdown:</h4>
            <div className="text-xs p-2 bg-background rounded border space-y-1 font-mono">
              {selectedImagesMarkdown.map((md, i) => (
                <div key={`img-${i}`} className="text-green-600 dark:text-green-400">{md}</div>
              ))}
              {selectedVideosMarkdown.map((md, i) => (
                <div key={`vid-${i}`} className="text-blue-600 dark:text-blue-400">{md}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}