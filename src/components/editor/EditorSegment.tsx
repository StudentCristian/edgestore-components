"use client"  
import type React from "react"  
import { useRef, useEffect, useCallback, useLayoutEffect } from "react"  
import { cn } from "@/lib/utils"  
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
  
interface EditorSegmentProps {  
  placeholder: string  
  markdown: string  
  onContentChange: (markdown: string) => void  
  isFirst?: boolean  
  isLast?: boolean
  segmentNumber?: number
  totalSegments?: number
}  
  
export function EditorSegment({ 
  placeholder, 
  markdown, 
  onContentChange, 
  isFirst, 
  isLast,
  segmentNumber,
  totalSegments 
}: EditorSegmentProps) {  
  const textareaRef = useRef<HTMLTextAreaElement>(null)  
  
  // Usar useLayoutEffect para ajustar altura antes del paint
  // Esto evita el parpadeo visual
  useLayoutEffect(() => {  
    const textarea = textareaRef.current;
    if (textarea) {  
      textarea.style.height = "auto"  
      textarea.style.height = `${textarea.scrollHeight}px`  
    }  
  }, [markdown])  

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value)
  }, [onContentChange])
  
  return (  
    <div className={cn("relative group", !isFirst && "border-t border-border/50")}>  
      {!isFirst && (  
        <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />  
      )}  

      {/* Tooltip trigger zone - invisible hover area on left edge */}
      {segmentNumber && totalSegments && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="absolute left-0 top-0 w-3 h-full cursor-default z-10 hover:bg-muted/30 transition-colors"
                aria-label={`Segmento ${segmentNumber}: ${placeholder}`}
              />
            </TooltipTrigger>
            <TooltipContent side="right" align="start" className="text-xs">
              <p className="font-medium">{placeholder}</p>
              <p className="text-muted-foreground">Sección {segmentNumber} de {totalSegments}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
  
      <textarea  
        ref={textareaRef}  
        value={markdown}  
        onChange={handleChange}  
        className={cn(  
          "w-full px-4 py-3 bg-transparent resize-none outline-none",  
          "text-sm leading-relaxed text-foreground",  
          "min-h-[60px]",  
          isFirst && "pt-4",  
          isLast && "pb-4",  
        )}  
        placeholder={`Escribe el contenido de ${placeholder}...`}  
        spellCheck={true}
        lang="es"
        autoCorrect="on"
        autoCapitalize="sentences"
        data-gramm="true"
        data-gramm_editor="true"
      />  
    </div>  
  )  
}