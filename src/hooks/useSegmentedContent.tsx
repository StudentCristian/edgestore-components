"use client";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";

export interface Segment {
  placeholder: string;
  markdown: string;
  htmlContent: string;
}

export interface InitialContent {
  [placeholder: string]: string;
}

function createSegmentsFromPlaceholders(
  placeholders: string[],
  initialContent: InitialContent = {}
): Segment[] {
  return placeholders.map((placeholder) => ({
    placeholder,
    markdown: initialContent[placeholder] || "",
    htmlContent: "",
  }));
}

export function useSegmentedContent(
  placeholders: string[] = [],
  initialContent: InitialContent = {}
) {
  const [segments, setSegments] = useState<Segment[]>(() =>
    createSegmentsFromPlaceholders(placeholders, initialContent)
  );
  const initialContentRef = useRef(initialContent);
  const rendererRef = useRef<any>(null);

  // Load renderer once (handles different export shapes)
  useEffect(() => {
    let mounted = true;
    import("mathpix-markdown-it")
      .then((mod) => {
        if (!mounted) return;
        rendererRef.current =
          mod.MathpixMarkdownModel || mod.default || mod;
      })
      .catch(() => {
        rendererRef.current = null;
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Sync segments when placeholders or initialContent change
  useEffect(() => {
    // Check if initialContent changed
    const contentChanged = JSON.stringify(initialContent) !== JSON.stringify(initialContentRef.current);
    initialContentRef.current = initialContent;

    setSegments((prev) => {
      const map = new Map(prev.map((s) => [s.placeholder, s]));
      return placeholders.map((p) => {
        // If initialContent changed, use new initial values
        if (contentChanged && initialContent[p] !== undefined) {
          return { placeholder: p, markdown: initialContent[p], htmlContent: "" };
        }
        // Otherwise preserve existing content if available
        return map.has(p)
          ? map.get(p)!
          : { placeholder: p, markdown: initialContent[p] || "", htmlContent: "" };
      });
    });
  }, [placeholders, initialContent]);

  const updateSegmentMarkdown = useCallback((placeholder: string, newMarkdown: string) => {
    setSegments((prev) =>
      prev.map((seg) => {
        if (seg.placeholder !== placeholder) return seg;
        let html = seg.htmlContent;
        try {
          const renderer = rendererRef.current;
          if (renderer) {
            if (typeof renderer.markdownToHTML === "function") {
              html = renderer.markdownToHTML(newMarkdown, {
                htmlTags: true,
                width: 800,
              });
            } else if (typeof renderer === "function") {
              const inst = new renderer();
              if (typeof inst.markdownToHTML === "function") {
                html = inst.markdownToHTML(newMarkdown, {
                  htmlTags: true,
                  width: 800,
                });
              }
            }
          }
        } catch {
          // Silently ignore renderer errors to avoid breaking editing flow
        }
        return { ...seg, markdown: newMarkdown, htmlContent: html };
      })
    );
  }, []);

  const markdown = useMemo(() => {
    return segments.map((s) => `## ${s.placeholder}\n\n${s.markdown}`).join("\n\n---\n\n");
  }, [segments]);

  const combinedHtml = useMemo(() => {
    return segments.map((s) => s.htmlContent).join('<hr class="segment-divider"/>');
  }, [segments]);

  return {
    segments,
    updateSegmentMarkdown,
    markdown,
    combinedHtml,
  };
}
