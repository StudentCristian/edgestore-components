"use client"
import { useSegmentedContent, type InitialContent } from "@/hooks/useSegmentedContent"
import { EditorSegment } from "./EditorSegment"
import { PreviewPanel } from "./PreviewPanel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Code } from "lucide-react"
import { useState, useEffect } from "react"

interface SegmentedEditorProps {
  placeholders: string[]
  initialContent?: InitialContent
  onContentChange?: (markdown: string) => void
}

export function SegmentedEditor({ placeholders, initialContent = {}, onContentChange }: SegmentedEditorProps) {
  const { segments, updateSegmentMarkdown, markdown, combinedHtml } = useSegmentedContent(placeholders, initialContent)
  const [showPreview, setShowPreview] = useState(true)

  // Notify parent when markdown changes
  useEffect(() => {
    onContentChange?.(markdown)
  }, [markdown, onContentChange])

  const handleSegmentChange = (placeholder: string, newMarkdown: string) => {
    updateSegmentMarkdown(placeholder, newMarkdown)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant={showPreview ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-7 px-2 text-xs gap-1.5"
          >
            {showPreview ? <Eye className="h-3.5 w-3.5" /> : <Code className="h-3.5 w-3.5" />}
            {showPreview ? "Preview" : "Solo editor"}
          </Button>
          <Badge variant="secondary" className="text-xs">
            {segments.length} campos
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`${showPreview ? "w-1/2" : "w-full"} border-r border-border overflow-auto bg-card`}>
          {segments.map((segment, index) => (
            <EditorSegment
              key={segment.placeholder}
              placeholder={segment.placeholder}
              markdown={segment.markdown}
              onContentChange={(md) => handleSegmentChange(segment.placeholder, md)}
              isFirst={index === 0}
              isLast={index === segments.length - 1}
            />
          ))}
        </div>

        {showPreview && (
          <div className="w-1/2 overflow-auto bg-background">
            <PreviewPanel html={combinedHtml} />
          </div>
        )}
      </div>
    </div>
  )
}
