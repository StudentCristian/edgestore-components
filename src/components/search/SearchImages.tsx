'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ImageGrid, { ImageResult } from './ImageGrid';

interface SearchImagesProps {
  useAI?: boolean;
}

export default function SearchImages({ useAI = true }: SearchImagesProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setSearchedQuery(query);
    try {
      const endpoint = useAI ? '/api/search/images' : '/api/search/images/manual';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, chatHistory: [] }),
      });

      const data = await response.json();
      setResults(data.images || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Grid de imágenes usando componente reutilizable */}
      <ImageGrid
        images={results}
        isLoading={isLoading}
        initialVisible={3}
        skeletonCount={6}
        emptyMessage={searchedQuery ? `No images found for "${searchedQuery}"` : undefined}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      />
    </div>
  );
}