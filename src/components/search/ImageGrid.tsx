'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Lightbox from 'yet-another-react-lightbox';
import { Plus, ExternalLink, ImageIcon, Check, Copy, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

export interface ImageResult {
  img_src: string;
  url: string;
  title: string;
}

interface ImageGridProps {
  images: ImageResult[];
  isLoading?: boolean;
  initialVisible?: number;
  skeletonCount?: number;
  emptyMessage?: string;
  showSource?: boolean;
  selectable?: boolean;
  selectedImages?: Set<string>;
  onSelect?: (image: ImageResult) => void;
  maxSelection?: number;
  className?: string;
}

export default function ImageGrid({
  images,
  isLoading = false,
  initialVisible = 3,
  skeletonCount = 6,
  emptyMessage = 'No se encontraron imágenes',
  showSource = true,
  selectable = false,
  selectedImages = new Set(),
  onSelect,
  maxSelection = 5,
  className,
}: ImageGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const displayImages = showAll ? images : images.slice(0, initialVisible);

  // Copiar imagen como Markdown
  const copyAsMarkdown = async (image: ImageResult, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const markdown = `![${image.title}](${image.img_src})`;
    
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedIndex(index);
      toast({
        title: "Copiado",
        description: `Imagen "${image.title.slice(0, 30)}..." copiada al portapapeles`,
      });
    } catch (error) {
      console.error('Clipboard error:', error);
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar. Asegúrate de usar HTTPS.",
        variant: "destructive",
      });
    }
    
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  const hasMoreImages = images.length > initialVisible;

  // Preparar slides para el lightbox
  const slides = images.map((image) => ({
    src: image.img_src,
    alt: image.title,
    title: image.title,
  }));

  const handleImageClick = (image: ImageResult, index: number) => {
    if (selectable && onSelect) {
      // Si ya está seleccionada, deseleccionar
      if (selectedImages.has(image.img_src)) {
        onSelect(image);
      } 
      // Si no está seleccionada y no hemos llegado al máximo, seleccionar
      else if (selectedImages.size < maxSelection) {
        onSelect(image);
      }
    } else {
      // Si no es seleccionable, abrir lightbox
      setLightboxIndex(index);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 gap-4', className)}>
        {[...Array(skeletonCount)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <CardContent className="p-3">
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={cn('grid grid-cols-2 gap-4', className)}>
        {displayImages.map((image, index) => {
          const isSelected = selectedImages.has(image.img_src);
          const canSelect = selectable && (isSelected || selectedImages.size < maxSelection);
          
          return (
            <Card
              key={`${image.img_src}-${index}`}
              className={cn(
                'overflow-hidden cursor-pointer transition-all duration-200',
                isSelected && 'ring-2 ring-primary',
                selectable && !canSelect && !isSelected && 'opacity-50 cursor-not-allowed',
                !selectable && 'hover:shadow-lg'
              )}
              onClick={() => handleImageClick(image, index)}
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={image.img_src}
                  alt={image.title}
                  className={cn(
                    'w-full h-full object-cover transition-transform duration-200',
                    !selectable && 'hover:scale-105'
                  )}
                  loading="lazy"
                />
                {/* Selection indicator */}
                {selectable && isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="text-xs font-medium line-clamp-1 mb-1.5">{image.title}</h3>
                <div className="flex items-center justify-between">
                  {showSource && (
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                      Fuente
                    </a>
                  )}
                  <span
                    onClick={(e) => copyAsMarkdown(image, index, e)}
                    className={cn(
                      "text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer",
                      copiedIndex === index && "!text-green-600"
                    )}
                    title="Copiar como Markdown"
                    role="button"
                  >
                    {copiedIndex === index ? (
                      <><CheckCheck className="h-2.5 w-2.5" /> Copiado</>
                    ) : (
                      <><Copy className="h-2.5 w-2.5" /> Copiar</>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Botón "Ver más" */}
      {hasMoreImages && !showAll && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(true)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Ver {images.length - initialVisible} más
          </Button>
        </div>
      )}

      {/* Lightbox (solo si no es seleccionable) */}
      {!selectable && lightboxIndex >= 0 && (
        <Lightbox
          slides={slides}
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          on={{
            view: ({ index }) => setLightboxIndex(index),
          }}
        />
      )}
    </div>
  );
}
