"use client"
import { useSegmentedContent, type InitialContent, type Segment } from "@/hooks/useSegmentedContent"
import { EditorSegment } from "./EditorSegment"
import { PreviewPanel } from "./PreviewPanel"
import { Button } from "@/components/ui/button"
import { Eye, Code } from "lucide-react"
import { useState, useEffect } from "react"

interface SegmentedEditorProps {
  placeholders: string[]
  initialContent?: InitialContent
  onContentChange?: (markdown: string, segments: Segment[]) => void
}

export function SegmentedEditor({ placeholders, initialContent = {}, onContentChange }: SegmentedEditorProps) {
  const { segments, updateSegmentMarkdown, markdown, combinedHtml } = useSegmentedContent(placeholders, initialContent)
  const [showPreview, setShowPreview] = useState(true)

  // Notify parent when markdown changes - includes segments for reliable content extraction
  useEffect(() => {
    onContentChange?.(markdown, segments)
  }, [markdown, segments, onContentChange])

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
            {showPreview ? "Vista previa" : "Solo editor"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor area */}
        <div className={`${showPreview ? "w-1/2" : "w-full"} border-r border-border overflow-auto bg-card`}>
          {segments.map((segment, index) => (
            <EditorSegment
              key={segment.placeholder}
              placeholder={segment.placeholder}
              markdown={segment.markdown}
              onContentChange={(md) => handleSegmentChange(segment.placeholder, md)}
              isFirst={index === 0}
              isLast={index === segments.length - 1}
              segmentNumber={index + 1}
              totalSegments={segments.length}
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
