'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ImageIcon, VideoIcon, Loader2, RefreshCw } from 'lucide-react';
import ImageGrid, { ImageResult } from './ImageGrid';
import VideoGrid, { VideoResult } from './VideoGrid';
import { cn } from '@/lib/utils';

export interface SearchResults {
  query: string;
  images: ImageResult[];
  videos: VideoResult[];
}

interface SearchResultsPanelProps {
  /** Query inicial para búsqueda automática */
  initialQuery?: string;
  /** Callback cuando se completa una búsqueda */
  onSearchComplete?: (results: SearchResults) => void;
  /** Modo seleccionable para elegir media para BAML */
  selectable?: boolean;
  /** Imágenes seleccionadas (para modo seleccionable) */
  selectedImages?: Set<string>;
  /** Videos seleccionados (para modo seleccionable) */
  selectedVideos?: Set<string>;
  /** Callback al seleccionar imagen */
  onImageSelect?: (image: ImageResult) => void;
  /** Callback al seleccionar video */
  onVideoSelect?: (video: VideoResult) => void;
  /** Máximo de imágenes seleccionables */
  maxImageSelection?: number;
  /** Máximo de videos seleccionables */
  maxVideoSelection?: number;
  /** Ejecutar búsqueda automática al montar */
  autoSearch?: boolean;
  /** Mostrar el input de búsqueda */
  showSearchInput?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

export default function SearchResultsPanel({
  initialQuery = '',
  onSearchComplete,
  selectable = false,
  selectedImages = new Set(),
  selectedVideos = new Set(),
  onImageSelect,
  onVideoSelect,
  maxImageSelection = 5,
  maxVideoSelection = 5,
  autoSearch = false,
  showSearchInput = true,
  className,
}: SearchResultsPanelProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [error, setError] = useState<string | null>(null);

  const executeSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search/all/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          imageLimit: 20,
          videoLimit: 20,
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      const searchResults: SearchResults = {
        query: searchQuery,
        images: data.images || [],
        videos: data.videos || [],
      };

      setResults(searchResults);
      onSearchComplete?.(searchResults);

      // Auto-switch to tab with results
      if (searchResults.images.length > 0) {
        setActiveTab('images');
      } else if (searchResults.videos.length > 0) {
        setActiveTab('videos');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [onSearchComplete]);

  const handleSearch = () => {
    executeSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Auto-search on mount if enabled
  useEffect(() => {
    if (autoSearch && initialQuery) {
      executeSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar al montar

  const imageCount = results?.images.length || 0;
  const videoCount = results?.videos.length || 0;

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Media Search
          </CardTitle>
          {selectable && (
            <Badge variant="outline" className="text-xs">
              {selectedImages.size + selectedVideos.size}/{maxImageSelection + maxVideoSelection} selected
            </Badge>
          )}
        </div>

        {showSearchInput && (
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search images & videos..."
              className="flex-1 h-9"
              disabled={isLoading}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              size="sm"
              className="h-9"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={handleSearch}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        ) : !results && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <Search className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">Search for images and videos</p>
            {selectable && (
              <p className="text-xs mt-1">Select media to include in generation</p>
            )}
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'images' | 'videos')}
            className="flex flex-col h-full"
          >
            <TabsList className="grid grid-cols-2 mx-4 mb-2">
              <TabsTrigger value="images" className="gap-1.5 text-xs">
                <ImageIcon className="h-3.5 w-3.5" />
                Images
                {imageCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {imageCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-1.5 text-xs">
                <VideoIcon className="h-3.5 w-3.5" />
                Videos
                {videoCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {videoCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <TabsContent value="images" className="mt-0 h-full">
                <ImageGrid
                  images={results?.images || []}
                  isLoading={isLoading}
                  initialVisible={20}
                  skeletonCount={8}
                  emptyMessage={results ? `No images found for "${results.query}"` : undefined}
                  showSource={!selectable}
                  selectable={selectable}
                  selectedImages={selectedImages}
                  onSelect={onImageSelect}
                  maxSelection={maxImageSelection}
                />
              </TabsContent>

              <TabsContent value="videos" className="mt-0 h-full">
                <VideoGrid
                  videos={results?.videos || []}
                  isLoading={isLoading}
                  initialVisible={20}
                  skeletonCount={4}
                  emptyMessage={results ? `No videos found for "${results.query}"` : undefined}
                  showSource={!selectable}
                  selectable={selectable}
                  selectedVideos={selectedVideos}
                  onSelect={onVideoSelect}
                  maxSelection={maxVideoSelection}
                />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
