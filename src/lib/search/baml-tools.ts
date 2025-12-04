import { searchSearxng } from './searxng';  
  
export async function executeWebSearch(tool: { query: string; engines: string[] }) {  
  const res = await searchSearxng(tool.query, { engines: tool.engines });  
    
  return res.results.map(r => ({  
    title: r.title,  
    url: r.url,  
    img_src: r.img_src || r.thumbnail,  
    iframe_src: r.iframe_src  
  }));  
}