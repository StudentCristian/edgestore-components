'use client';

import { useState } from 'react';
import { SearchResultsPanel, ImageResult, VideoResult } from '@/components/search';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function TestPanel() {
  const [selectable, setSelectable] = useState(true);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());

  const handleImageSelect = (image: ImageResult) => {
    setSelectedImages((prev) => {
      const next = new Set(prev);
      if (next.has(image.img_src)) {
        next.delete(image.img_src);
      } else {
        next.add(image.img_src);
      }
      return next;
    });
  };

  const handleVideoSelect = (video: VideoResult) => {
    const videoId = video.iframe_src || video.url;
    setSelectedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) {
        next.delete(videoId);
      } else {
        next.add(videoId);
      }
      return next;
    });
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
          maxImageSelection={5}
          maxVideoSelection={5}
        />
      </div>

      {selectable && (selectedImages.size > 0 || selectedVideos.size > 0) && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Selected Media (for BAML context)</h3>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(
              {
                images: Array.from(selectedImages),
                videos: Array.from(selectedVideos),
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}