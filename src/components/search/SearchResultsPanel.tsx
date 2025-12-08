'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, ImageIcon, VideoIcon, Loader2, RefreshCw, MousePointer2, Eye, X } from 'lucide-react';
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
  /** Trigger para búsqueda automática (cambiar el número dispara nueva búsqueda) */
  autoSearch?: boolean | number;
  /** Mostrar el input de búsqueda */
  showSearchInput?: boolean;
  /** Clase CSS adicional */
  className?: string;
  /** Media seleccionada para mostrar markdown preview */
  selectedMediaForPreview?: {
    images: Array<{ img_src: string; title: string }>;
    videos: Array<{ img_src: string; url: string; title: string; iframe_src: string }>;
  };
  /** Callback para limpiar selección de media (opcional) */
  onClearSelection?: (() => void);
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
  selectedMediaForPreview,
  onClearSelection,
}: SearchResultsPanelProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [error, setError] = useState<string | null>(null);
  // Estado interno para alternar entre modo selección y modo visualización
  const [isSelectMode, setIsSelectMode] = useState(selectable);
  // Referencia para rastrear el último valor de autoSearch
  const lastAutoSearchRef = useRef<boolean | number>(autoSearch);

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
      setError('Error en la búsqueda. Intenta de nuevo.');
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

  // Sincronizar query con initialQuery cuando cambia
  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  // Limpiar resultados cuando autoSearch se resetea a 0 (indica un nuevo flujo)
  useEffect(() => {
    if (typeof autoSearch === 'number' && autoSearch === 0) {
      setResults(null);
      setError(null);
      lastAutoSearchRef.current = 0;
    }
  }, [autoSearch]);

  // Ejecutar búsqueda automáticamente cuando initialQuery tiene valor y autoSearch es mayor a 0
  useEffect(() => {
    const queryToSearch = initialQuery?.trim() || query?.trim();
    
    // Si es un número > 0, ejecutar búsqueda cuando el número cambie
    if (typeof autoSearch === 'number' && autoSearch > 0) {
      if (autoSearch !== lastAutoSearchRef.current && queryToSearch) {
        console.log('[SearchResultsPanel] Auto-search triggered:', { autoSearch, lastAutoSearch: lastAutoSearchRef.current, queryToSearch });
        lastAutoSearchRef.current = autoSearch;
        executeSearch(queryToSearch);
      }
    } 
    // Si es boolean true, ejecutar solo cuando cambie a true
    else if (autoSearch === true && lastAutoSearchRef.current !== true && queryToSearch) {
      console.log('[SearchResultsPanel] Auto-search (boolean) triggered:', { queryToSearch });
      lastAutoSearchRef.current = autoSearch;
      executeSearch(queryToSearch);
    } else if (autoSearch !== lastAutoSearchRef.current) {
      lastAutoSearchRef.current = autoSearch;
    }
  }, [autoSearch, initialQuery, query, executeSearch]);

  const imageCount = results?.images.length || 0;
  const videoCount = results?.videos.length || 0;

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar Multimedia
          </CardTitle>
          {selectable && (
            <Badge variant="outline" className="text-xs">
              {selectedImages.size + selectedVideos.size}/{maxImageSelection + maxVideoSelection} seleccionados
            </Badge>
          )}
        </div>

        {showSearchInput && (
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar imágenes y videos..."
                className="h-9 pr-8"
                disabled={isLoading}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
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
            {/* Botón limpiar selección, solo si hay prop y hay selección */}
            {onClearSelection && (selectedImages.size > 0 || selectedVideos.size > 0) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 ml-1"
                onClick={onClearSelection}
                title="Limpiar selección de multimedia"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar selección
              </Button>
            )}
          </div>
        )}

        {/* Switch para alternar entre modo selección y modo visualización */}
        {selectable && (
          <div className="flex items-center justify-between px-1 py-1.5 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              {isSelectMode ? (
                <MousePointer2 className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <Label htmlFor="select-mode" className="text-xs font-medium cursor-pointer">
                {isSelectMode ? 'Modo selección' : 'Modo visualización'}
              </Label>
            </div>
            <Switch
              id="select-mode"
              checked={isSelectMode}
              onCheckedChange={setIsSelectMode}
              className="scale-90"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={handleSearch}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Reintentar
            </Button>
          </div>
        ) : !results && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <Search className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">Busca imágenes y videos</p>
            {selectable && (
              <p className="text-xs mt-1">Selecciona multimedia para incluir en tu documento</p>
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
                Imágenes
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
                  emptyMessage={results ? `No se encontraron imágenes para "${results.query}"` : undefined}
                  showSource={!isSelectMode}
                  selectable={isSelectMode}
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
                  emptyMessage={results ? `No se encontraron videos para "${results.query}"` : undefined}
                  showSource={!isSelectMode}
                  selectable={isSelectMode}
                  selectedVideos={selectedVideos}
                  onSelect={onVideoSelect}
                  maxSelection={maxVideoSelection}
                />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </CardContent>

      {/* Markdown Preview - mostrar cuando hay media seleccionada */}
      {selectedMediaForPreview && 
       (selectedMediaForPreview.images.length > 0 || selectedMediaForPreview.videos.length > 0) && (
        <div className="border-t px-4 py-3 flex-shrink-0">
          <Label className="text-xs font-medium text-muted-foreground mb-2 block">
            Vista previa (solo lectura)
          </Label>
          <Textarea
            readOnly
            value={[
              ...selectedMediaForPreview.images.map(img => `![${img.title}](${img.img_src})`),
              ...selectedMediaForPreview.videos.map(v => `[![${v.title}](${v.img_src})](${v.url})`)
            ].join('\n')}
            className="font-mono text-xs h-24 resize-none bg-muted/50"
            placeholder="Las imágenes y videos seleccionados aparecerán aquí en formato markdown..."
          />
        </div>
      )}
    </Card>
  );
}
