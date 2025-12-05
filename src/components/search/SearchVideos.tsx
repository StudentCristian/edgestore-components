'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import VideoGrid, { VideoResult } from './VideoGrid';

interface SearchVideosProps {
  useAI?: boolean;
}

export default function SearchVideos({ useAI = true }: SearchVideosProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VideoResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setSearchedQuery(query);
    try {
      const endpoint = useAI ? '/api/search/videos' : '/api/search/videos/manual';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, chatHistory: [] }),
      });

      const data = await response.json();
      setResults(data.videos || []);
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
          placeholder="Search for videos..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Grid de videos usando componente reutilizable */}
      <VideoGrid
        videos={results}
        isLoading={isLoading}
        initialVisible={3}
        skeletonCount={4}
        emptyMessage={searchedQuery ? `No videos found for "${searchedQuery}"` : undefined}
      />
    </div>
  );
}