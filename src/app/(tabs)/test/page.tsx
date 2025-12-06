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

  const handleImageSelect = (image: ImageResult) => {
    const markdown = `![${image.title}](${image.img_src})`;
    const isSelected = selectedImages.has(image.img_src);
    
    if (isSelected) {
      // Deseleccionar
      setSelectedImages((prev) => {
        const next = new Set(prev);
        next.delete(image.img_src);
        return next;
      });
      setSelectedImagesMarkdown((prev) => prev.filter(md => md !== markdown));
    } else {
      // Seleccionar
      setSelectedImages((prev) => new Set(prev).add(image.img_src));
      setSelectedImagesMarkdown((prev) => [...prev, markdown]);
    }
  };

  const handleVideoSelect = (video: VideoResult) => {
    const videoId = video.iframe_src || video.url;
    const markdown = `[![${video.title}](${video.img_src})](${video.url})`;
    const isSelected = selectedVideos.has(videoId);
    
    if (isSelected) {
      // Deseleccionar
      setSelectedVideos((prev) => {
        const next = new Set(prev);
        next.delete(videoId);
        return next;
      });
      setSelectedVideosMarkdown((prev) => prev.filter(md => md !== markdown));
    } else {
      // Seleccionar
      setSelectedVideos((prev) => new Set(prev).add(videoId));
      setSelectedVideosMarkdown((prev) => [...prev, markdown]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Test SearchResultsPanel</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="selectable"
              checked={selectable}
              onCheckedChange={setSelectable}
            />
            <Label htmlFor="selectable">Selectable Mode</Label>
          </div>
        </div>
      </div>

      {selectable && (
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">
            Images: {selectedImages.size}/5
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
          <h3 className="font-medium">Selected Media (for BAML context)</h3>
          
          {/* Contexto Markdown para BAML - simple y eficiente */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">BAML Context (Markdown only):</h4>
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
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Markdown Preview:</h4>
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