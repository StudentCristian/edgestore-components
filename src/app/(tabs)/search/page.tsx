'use client';

import { useState } from 'react';
import SearchImages from '@/components/search/SearchImages';
import SearchVideos from '@/components/search/SearchVideos';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SearchPage() {
  const [useAI, setUseAI] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Search Images & Videos</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="ai-mode" className="text-sm">
            {useAI ? 'IA' : 'Manual'}
          </Label>
          <Switch
            id="ai-mode"
            checked={useAI}
            onCheckedChange={setUseAI}
          />
        </div>
      </div>

      <Tabs defaultValue="images">
        <TabsList>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <SearchImages useAI={useAI} />
        </TabsContent>

        <TabsContent value="videos">
          <SearchVideos useAI={useAI} />
        </TabsContent>
      </Tabs>
    </div>
  );
}