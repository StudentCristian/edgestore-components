'use client';  
  
import { useState } from 'react';  
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';  
import { Card, CardContent } from '@/components/ui/card';  
import { Skeleton } from '@/components/ui/skeleton';  
import Lightbox from 'yet-another-react-lightbox';  
import { Search, Plus, ExternalLink } from 'lucide-react';  
import { cn } from '@/lib/utils';  
  
interface ImageResult {  
  img_src: string;  
  url: string;  
  title: string;  
}  
  
interface SearchImagesProps {  
  useAI?: boolean;  
}  
  
export default function SearchImages({ useAI = true }: SearchImagesProps) {  
  const [query, setQuery] = useState('');  
  const [results, setResults] = useState<ImageResult[]>([]);  
  const [isLoading, setIsLoading] = useState(false);  
  const [lightboxIndex, setLightboxIndex] = useState(-1);  
  const [showAll, setShowAll] = useState(false);  
  
  const handleSearch = async () => {  
    if (!query.trim()) return;  
  
    setIsLoading(true);  
    try {  
      const endpoint = useAI ? '/api/search/images' : '/api/search/images/manual';  
      const response = await fetch(endpoint, {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({ query, chatHistory: [] }),  
      });  
        
      const data = await response.json();  
      setResults(data.images || []);  
      setShowAll(false);  
    } catch (error) {  
      console.error('Search error:', error);  
    } finally {  
      setIsLoading(false);  
    }  
  };  
  
  const displayImages = showAll ? results : results.slice(0, 3);  
  const hasMoreImages = results.length > 3;  
  
  // Preparar slides para el lightbox  
  const slides = results.map((image) => ({  
    src: image.img_src,  
    alt: image.title,  
    title: image.title,  
  }));  
  
  return (  
    <div className="space-y-6">  
      {/* Input de búsqueda */}  
      <div className="flex gap-2">  
        <Input  
          value={query}  
          onChange={(e) => setQuery(e.target.value)}  
          placeholder="Search for images..."  
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}  
          className="flex-1"  
        />  
        <Button onClick={handleSearch} disabled={isLoading}>  
          <Search className="h-4 w-4 mr-2" />  
          Search  
        </Button>  
      </div>  
  
      {/* Grid de imágenes */}  
      {isLoading ? (  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">  
          {[...Array(6)].map((_, i) => (  
            <Card key={i} className="overflow-hidden">  
              <Skeleton className="h-48 w-full" />  
              <CardContent className="p-3">  
                <Skeleton className="h-4 w-full" />  
              </CardContent>  
            </Card>  
          ))}  
        </div>  
      ) : results.length > 0 ? (  
        <div className="space-y-4">  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">  
            {displayImages.map((image, index) => (  
              <Card   
                key={index}   
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"  
                onClick={() => setLightboxIndex(index)}  
              >  
                <div className="relative aspect-square overflow-hidden bg-muted">  
                  <img  
                    src={image.img_src}  
                    alt={image.title}  
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"  
                  />  
                </div>  
                <CardContent className="p-3">  
                  <h3 className="text-sm font-medium line-clamp-2 mb-2">  
                    {image.title}  
                  </h3>  
                  <a  
                    href={image.url}  
                    target="_blank"  
                    rel="noopener noreferrer"  
                    className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"  
                    onClick={(e) => e.stopPropagation()}  
                  >  
                    <ExternalLink className="h-3 w-3" />  
                    Source  
                  </a>  
                </CardContent>  
              </Card>  
            ))}  
          </div>  
  
          {/* Botón "Ver más" */}  
          {hasMoreImages && !showAll && (  
            <div className="flex justify-center">  
              <Button  
                variant="outline"  
                onClick={() => setShowAll(true)}  
                className="gap-2"  
              >  
                <Plus className="h-4 w-4" />  
                View {results.length - 3} more images  
              </Button>  
            </div>  
          )}  
        </div>  
      ) : query ? (  
        <div className="text-center py-12 text-muted-foreground">  
          No images found for "{query}"  
        </div>  
      ) : null}  
  
      {/* Lightbox */}  
      {lightboxIndex >= 0 && (  
        <Lightbox  
          slides={slides}  
          open={lightboxIndex >= 0}  
          index={lightboxIndex}  
          close={() => setLightboxIndex(-1)}  
        />  
      )}  
    </div>  
  );  
}