"use client"  
  
interface PreviewPanelProps {  
  html: string  
}  
  
export function PreviewPanel({ html }: PreviewPanelProps) {  
  return (  
    <div className="h-full overflow-auto">  
      <div  
        className="prose prose-sm max-w-none p-6"  
        dangerouslySetInnerHTML={{ __html: html }}  
      />  
    </div>  
  )  
}