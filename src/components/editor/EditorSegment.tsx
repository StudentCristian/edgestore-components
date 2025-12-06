"use client"  
import type React from "react"  
import { useRef, useEffect } from "react"  
import { cn } from "@/lib/utils"  
import { Badge } from "@/components/ui/badge"  
  
interface EditorSegmentProps {  
  placeholder: string  
  markdown: string  
  onContentChange: (markdown: string) => void  
  isFirst?: boolean  
  isLast?: boolean  
}  
  
export function EditorSegment({ placeholder, markdown, onContentChange, isFirst, isLast }: EditorSegmentProps) {  
  const textareaRef = useRef<HTMLTextAreaElement>(null)  
  
  useEffect(() => {  
    if (textareaRef.current) {  
      textareaRef.current.style.height = "auto"  
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`  
    }  
  }, [markdown])  
  
  return (  
    <div className={cn("relative", !isFirst && "border-t border-border/50")}>  
      {!isFirst && (  
        <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />  
      )}  
  
      <div className="absolute top-2 right-2">  
        <Badge variant="outline" className="text-xs">  
          {placeholder}  
        </Badge>  
      </div>  
  
      <textarea  
        ref={textareaRef}  
        value={markdown}  
        onChange={(e) => onContentChange(e.target.value)}  
        className={cn(  
          "w-full px-4 py-3 pr-20 bg-transparent resize-none outline-none",  
          "font-mono text-sm leading-relaxed text-foreground",  
          "min-h-[60px]",  
          isFirst && "pt-8",  
          isLast && "pb-4",  
        )}  
        placeholder={`Contenido para ${placeholder}...`}  
        spellCheck={false}  
      />  
    </div>  
  )  
}