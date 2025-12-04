function SearchImages(message: string, history: Message[]) -> ImageResult[] {  
  client Gemini  
    
  prompt #"  
    Based on the user's message, search for relevant images.  
      
    {{ ctx.output_format }}  
      
    {% for m in history %}  
    {{ _.role(m.role) }}  
    {{ m.content }}  
    {% endfor %}  
      
    {{ _.role("user") }} {{ message }}  
  "#  
}  
  
function SearchVideos(message: string, history: Message[]) -> VideoResult[] {  
  client Gemini  
    
  prompt #"  
    Based on the user's message, search for relevant videos.  
      
    {{ ctx.output_format }}  
      
    {% for m in history %}  
    {{ _.role(m.role) }}  
    {{ m.content }}  
    {% endfor %}  
      
    {{ _.role("user") }} {{ message }}  
  "#  
}