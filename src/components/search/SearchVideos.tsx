'use client';  
  
import { useState, useEffect, useRef } from 'react';  
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';  
import { Card, CardContent } from '@/components/ui/card';  
import { Skeleton } from '@/components/ui/skeleton';  
import Lightbox, { GenericSlide } from 'yet-another-react-lightbox';  
import { Search, Plus, Play, ExternalLink } from 'lucide-react';  
import { cn } from '@/lib/utils';  
  
// Declaración de tipo personalizado para video slides  
declare module 'yet-another-react-lightbox' {  
  export interface VideoSlide extends GenericSlide {  
    type: 'video-slide';  
    src: string;  
    iframe_src: string;  
  }  
  
  interface SlideTypes {  
    'video-slide': VideoSlide;  
  }  
}  
  
interface VideoResult {  
  img_src: string;  
  url: string;  
  title: string;  
  iframe_src: string;  
}  
  
interface SearchVideosProps {  
  useAI?: boolean;  
}  
  
export default function SearchVideos({ useAI = true }: SearchVideosProps) {  
  const [query, setQuery] = useState('');  
  const [results, setResults] = useState<VideoResult[]>([]);  
  const [isLoading, setIsLoading] = useState(false);  
  const [lightboxIndex, setLightboxIndex] = useState(-1);  
  const [showAll, setShowAll] = useState(false);  
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([]);  
  
  const handleSearch = async () => {  
    if (!query.trim()) return;  
  
    setIsLoading(true);  
    try {  
      const endpoint = useAI ? '/api/search/videos' : '/api/search/videos/manual';  
      const response = await fetch(endpoint, {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({ query, chatHistory: [] }),  
      });  
        
      const data = await response.json();  
      setResults(data.videos || []);  
      setShowAll(false);  
    } catch (error) {  
      console.error('Search error:', error);  
    } finally {  
      setIsLoading(false);  
    }  
  };  
  
  const displayVideos = showAll ? results : results.slice(0, 3);  
  const hasMoreVideos = results.length > 3;  
  
  // Pausar videos al cambiar de slide  
  const pauseAllVideos = () => {  
    videoRefs.current.forEach(iframe => {  
      if (iframe && iframe.contentWindow) {  
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');  
      }  
    });  
  };  
  
  // Preparar slides para el lightbox con tipo video-slide  
  const slides = results.map((video) => ({  
    type: 'video-slide' as const,  
    src: video.img_src,  
    iframe_src: video.iframe_src,  
  }));  
  
  useEffect(() => {  
    return () => {  
      pauseAllVideos();  
    };  
  }, []);  
  
  return (  
    <div className="space-y-6">  
      {/* Input de búsqueda */}  
      <div className="flex gap-2">  
        <Input  
          value={query}  
          onChange={(e) => setQuery(e.target.value)}  
          placeholder="Search for videos..."  
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}  
          className="flex-1"  
        />  
        <Button onClick={handleSearch} disabled={isLoading}>  
          <Search className="h-4 w-4 mr-2" />  
          Search  
        </Button>  
      </div>  
  
      {/* Grid de videos */}  
      {isLoading ? (  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">  
          {[...Array(4)].map((_, i) => (  
            <Card key={i} className="overflow-hidden">  
              <Skeleton className="aspect-video w-full" />  
              <CardContent className="p-3">  
                <Skeleton className="h-4 w-full" />  
              </CardContent>  
            </Card>  
          ))}  
        </div>  
      ) : results.length > 0 ? (  
        <div className="space-y-4">  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">  
            {displayVideos.map((video, index) => (  
              <Card   
                key={index}   
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"  
                onClick={() => {  
                  pauseAllVideos();  
                  setLightboxIndex(index);  
                }}  
              >  
                <div className="relative aspect-video overflow-hidden bg-muted">  
                  <img  
                    src={video.img_src}  
                    alt={video.title}  
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"  
                  />  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">  
                    <div className="rounded-full bg-white/90 p-3 hover:bg-white transition-colors">  
                      <Play className="h-6 w-6 text-black fill-black ml-1" />  
                    </div>  
                  </div>  
                </div>  
                <CardContent className="p-3">  
                  <h3 className="text-sm font-medium line-clamp-2 mb-2">  
                    {video.title}  
                  </h3>  
                  <a  
                    href={video.url}  
                    target="_blank"  
                    rel="noopener noreferrer"  
                    className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"  
                    onClick={(e) => e.stopPropagation()}  
                  >  
                    <ExternalLink className="h-3 w-3" />  
                    Watch on YouTube  
                  </a>  
                </CardContent>  
              </Card>  
            ))}  
          </div>  
  
          {/* Botón "Ver más" */}  
          {hasMoreVideos && !showAll && (  
            <div className="flex justify-center">  
              <Button  
                variant="outline"  
                onClick={() => setShowAll(true)}  
                className="gap-2"  
              >  
                <Plus className="h-4 w-4" />  
                View {results.length - 3} more videos  
              </Button>  
            </div>  
          )}  
        </div>  
      ) : query ? (  
        <div className="text-center py-12 text-muted-foreground">  
          No videos found for "{query}"  
        </div>  
      ) : null}  
  
      {/* Lightbox para videos con renderizador personalizado */}  
      {lightboxIndex >= 0 && (  
        <Lightbox  
          open={lightboxIndex >= 0}  
          close={() => {  
            pauseAllVideos();  
            setLightboxIndex(-1);  
          }}  
          slides={slides}  
          index={lightboxIndex}  
          on={{  
            view: ({ index }) => {  
              const previousIframe = videoRefs.current[lightboxIndex];  
              if (previousIframe?.contentWindow) {  
                previousIframe.contentWindow.postMessage(  
                  '{"event":"command","func":"pauseVideo","args":""}',  
                  '*'  
                );  
              }  
            }  
          }}  
          render={{  
            slide: ({ slide }) => {  
              const index = slides.findIndex((s) => s === slide);  
              return slide.type === 'video-slide' ? (  
                <div className="flex items-center justify-center w-full h-full bg-black">  
                  <iframe  
                    src={`${slide.iframe_src}${slide.iframe_src.includes('?') ? '&' : '?'}enablejsapi=1`}  
                    ref={(el) => {  
                      if (el) {  
                        videoRefs.current[index] = el;  
                      }  
                    }}  
                    className="aspect-video max-h-[95vh] w-[95vw] rounded-2xl md:w-[80vw]"  
                    allowFullScreen  
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"  
                  />  
                </div>  
              ) : null;  
            }  
          }}  
        />  
      )}  
    </div>  
  );  
}