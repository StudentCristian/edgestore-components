'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Lightbox, { GenericSlide } from 'yet-another-react-lightbox';
import { Plus, Play, ExternalLink, VideoIcon, Check } from 'lucide-react';
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

export interface VideoResult {
  img_src: string;
  url: string;
  title: string;
  iframe_src: string;
}

interface VideoGridProps {
  videos: VideoResult[];
  isLoading?: boolean;
  initialVisible?: number;
  skeletonCount?: number;
  emptyMessage?: string;
  showSource?: boolean;
  selectable?: boolean;
  selectedVideos?: Set<string>;
  onSelect?: (video: VideoResult) => void;
  maxSelection?: number;
  className?: string;
}

export default function VideoGrid({
  videos,
  isLoading = false,
  initialVisible = 3,
  skeletonCount = 4,
  emptyMessage = 'No videos found',
  showSource = true,
  selectable = false,
  selectedVideos = new Set(),
  onSelect,
  maxSelection = 5,
  className,
}: VideoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  const displayVideos = showAll ? videos : videos.slice(0, initialVisible);
  const hasMoreVideos = videos.length > initialVisible;

  // Pausar videos al cambiar de slide
  const pauseAllVideos = () => {
    videoRefs.current.forEach(iframe => {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    });
  };

  // Preparar slides para el lightbox con tipo video-slide
  const slides = videos.map((video) => ({
    type: 'video-slide' as const,
    src: video.img_src,
    iframe_src: video.iframe_src,
  }));

  useEffect(() => {
    return () => {
      pauseAllVideos();
    };
  }, []);

  // Obtener un ID único para el video (preferir iframe_src, fallback a url)
  const getVideoId = (video: VideoResult) => video.iframe_src || video.url;

  const handleVideoClick = (video: VideoResult, index: number) => {
    const videoId = getVideoId(video);
    
    if (selectable && onSelect) {
      // Si ya está seleccionado, deseleccionar
      if (selectedVideos.has(videoId)) {
        onSelect(video);
      }
      // Si no está seleccionado y no hemos llegado al máximo, seleccionar
      else if (selectedVideos.size < maxSelection) {
        onSelect(video);
      }
    } else {
      // Si no es seleccionable, abrir lightbox
      pauseAllVideos();
      setLightboxIndex(index);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', className)}>
        {[...Array(skeletonCount)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-2">
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <VideoIcon className="h-12 w-12 mb-2 opacity-50" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', className)}>
        {displayVideos.map((video, index) => {
          const videoId = getVideoId(video);
          const isSelected = selectedVideos.has(videoId);
          const canSelect = selectable && (isSelected || selectedVideos.size < maxSelection);

          return (
            <Card
              key={`${videoId}-${index}`}
              className={cn(
                'overflow-hidden cursor-pointer transition-all duration-200',
                isSelected && 'ring-2 ring-primary',
                selectable && !canSelect && !isSelected && 'opacity-50 cursor-not-allowed',
                'hover:shadow-lg'
              )}
              onClick={() => handleVideoClick(video, index)}
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={video.img_src}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                  <div className="rounded-full bg-white/90 p-3 hover:bg-white transition-colors">
                    <Play className="h-6 w-6 text-black fill-black ml-1" />
                  </div>
                </div>
                {/* Selection indicator */}
                {selectable && isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md z-10">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="text-sm font-medium line-clamp-2 mb-2">
                  {video.title}
                </h3>
                {showSource && (
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
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Botón "Ver más" */}
      {hasMoreVideos && !showAll && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(true)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            View {videos.length - initialVisible} more
          </Button>
        </div>
      )}

      {/* Lightbox para videos (solo si no es seleccionable) */}
      {!selectable && lightboxIndex >= 0 && (
        <Lightbox
          open={lightboxIndex >= 0}
          close={() => {
            pauseAllVideos();
            setLightboxIndex(-1);
          }}
          slides={slides}
          index={lightboxIndex}
          on={{
            view: ({ index: viewIndex }) => {
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
              if (slide.type !== 'video-slide' || !slide.iframe_src) {
                return null;
              }
              const slideIndex = slides.findIndex((s) => s === slide);
              return (
                <div className="flex items-center justify-center w-full h-full bg-black">
                  <iframe
                    src={`${slide.iframe_src}${slide.iframe_src.includes('?') ? '&' : '?'}enablejsapi=1`}
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[slideIndex] = el;
                      }
                    }}
                    className="aspect-video max-h-[95vh] w-[95vw] rounded-2xl md:w-[80vw]"
                    allowFullScreen
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              );
            }
          }}
        />
      )}
    </div>
  );
}
