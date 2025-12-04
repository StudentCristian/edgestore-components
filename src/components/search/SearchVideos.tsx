'use client';  
  
import { useState } from 'react';  
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';  
import { Card } from '@/components/ui/card';  
  
interface VideoResult {  
  img_src: string;  
  url: string;  
  title: string;  
  iframe_src: string;  
}  
  
export default function SearchVideos() {  
  const [query, setQuery] = useState('');  
  const [results, setResults] = useState<VideoResult[]>([]);  
  const [isLoading, setIsLoading] = useState(false);  
  
  const handleSearch = async () => {  
    if (!query.trim()) return;  
      
    setIsLoading(true);  
    try {  
      const response = await fetch('/api/search/videos', {  
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
    <div className="p-6">  
      <div className="flex gap-2 mb-6">  
        <Input  
          value={query}  
          onChange={(e) => setQuery(e.target.value)}  
          placeholder="Search for videos..."  
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}  
        />  
        <Button onClick={handleSearch} disabled={isLoading}>  
          Search  
        </Button>  
      </div>  
        
      <div className="grid grid-cols-2 gap-4">  
        {results.map((video, index) => (  
          <Card key={index} className="p-4">  
            <img   
              src={video.img_src}   
              alt={video.title}  
              className="w-full h-32 object-cover rounded mb-2"  
            />  
            <h3 className="text-sm font-medium mb-2">{video.title}</h3>  
            <a   
              href={video.url}   
              target="_blank"   
              rel="noopener noreferrer"  
              className="text-blue-500 hover:underline text-xs"  
            >  
              Watch Video  
            </a>  
          </Card>  
        ))}  
      </div>  
    </div>  
  );  
}