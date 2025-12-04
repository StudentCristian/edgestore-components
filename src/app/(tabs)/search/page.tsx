import SearchImages from '@/components/search/SearchImages';  
import SearchVideos from '@/components/search/SearchVideos';  
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';  
  
export default function SearchPage() {  
  return (  
    <div className="container mx-auto p-6">  
      <h1 className="text-2xl font-bold mb-6">Search Images & Videos</h1>  
        
      <Tabs defaultValue="images">  
        <TabsList>  
          <TabsTrigger value="images">Images</TabsTrigger>  
          <TabsTrigger value="videos">Videos</TabsTrigger>  
        </TabsList>  
          
        <TabsContent value="images">  
          <SearchImages />  
        </TabsContent>  
          
        <TabsContent value="videos">  
          <SearchVideos />  
        </TabsContent>  
      </Tabs>  
    </div>  
  );  
}