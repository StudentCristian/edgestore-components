'use client';  
  
import { useState } from 'react';  
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';  
import { Card } from '@/components/ui/card';  
  
interface ImageResult {  
  img_src: string;  
  url: string;  
  title: string;  
}  
  
export default function SearchImages() {  
  const [query, setQuery] = useState('');  
  const [results, setResults] = useState<ImageResult[]>([]);  
  const [isLoading, setIsLoading] = useState(false);  
  
  const handleSearch = async () => {  
    if (!query.trim()) return;  
      
    setIsLoading(true);  
    try {  
      const response = await fetch('/api/search/images', {  
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
    <div className="p-6">  
      <div className="flex gap-2 mb-6">  
        <Input  
          value={query}  
          onChange={(e) => setQuery(e.target.value)}  
          placeholder="Search for images..."  
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}  
        />  
        <Button onClick={handleSearch} disabled={isLoading}>  
          Search  
        </Button>  
      </div>  
        
      <div className="grid grid-cols-3 gap-4">  
        {results.map((image, index) => (  
          <Card key={index} className="p-2">  
            <img   
              src={image.img_src}   
              alt={image.title}  
              className="w-full h-40 object-cover rounded"  
            />  
            <h3 className="text-sm mt-2 font-medium">{image.title}</h3>  
          </Card>  
        ))}  
      </div>  
    </div>  
  );  
}