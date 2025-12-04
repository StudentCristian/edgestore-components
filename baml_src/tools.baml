class WebSearchResult {  
  title string  
  url string  
  img_src string?  
  iframe_src string?  
}  
  
class WebSearchTool {  
  query string @description("Search query to execute")  
  engines string[] @description("Search engines: ['youtube', 'bing images', 'google images']")  
}  
  
function ExecuteWebSearch(message: string) -> WebSearchTool {  
  client Gemini  
    
  prompt #"  
    Extract the search query and which engines to use from the user's message.  
      
    For images, use: ['bing images', 'google images']  
    For videos, use: ['youtube']  
      
    {{ ctx.output_format }}  
      
    User message: {{ message }}  
  "#  
}