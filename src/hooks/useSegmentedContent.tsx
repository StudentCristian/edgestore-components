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

// Helper para renderizar markdown a HTML
function renderMarkdownToHtml(markdown: string, renderer: any): string {
  if (!markdown || !renderer) return "";
  
  try {
    const options = {
      htmlTags: true,
      width: 800,
      breaks: true,        // Convierte \n en <br> para respetar saltos de línea
      typographer: true,   // Mejora tipográfica (espacios, comillas, etc.)
    };
    
    if (typeof renderer.markdownToHTML === "function") {
      return renderer.markdownToHTML(markdown, options);
    } else if (typeof renderer === "function") {
      const inst = new renderer();
      if (typeof inst.markdownToHTML === "function") {
        return inst.markdownToHTML(markdown, options);
      }
    }
  } catch {
    // Silently ignore renderer errors
  }
  return "";
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
  const [rendererLoaded, setRendererLoaded] = useState(false);

  // Load renderer once (handles different export shapes)
  useEffect(() => {
    let mounted = true;
    import("mathpix-markdown-it")
      .then((mod) => {
        if (!mounted) return;
        rendererRef.current =
          mod.MathpixMarkdownModel || mod.default || mod;
        setRendererLoaded(true);
      })
      .catch(() => {
        rendererRef.current = null;
        setRendererLoaded(true);
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
        // If initialContent changed, use new initial values and render HTML
        if (contentChanged && initialContent[p] !== undefined) {
          const md = initialContent[p];
          const html = renderMarkdownToHtml(md, rendererRef.current);
          return { placeholder: p, markdown: md, htmlContent: html };
        }
        // Otherwise preserve existing content if available
        return map.has(p)
          ? map.get(p)!
          : { placeholder: p, markdown: initialContent[p] || "", htmlContent: "" };
      });
    });
  }, [placeholders, initialContent]);

  // Re-render HTML when renderer loads (for initial content)
  useEffect(() => {
    if (!rendererLoaded || !rendererRef.current) return;
    
    setSegments((prev) =>
      prev.map((seg) => {
        // Solo renderizar si hay markdown pero no HTML
        if (seg.markdown && !seg.htmlContent) {
          const html = renderMarkdownToHtml(seg.markdown, rendererRef.current);
          return { ...seg, htmlContent: html };
        }
        return seg;
      })
    );
  }, [rendererLoaded]);

  const updateSegmentMarkdown = useCallback((placeholder: string, newMarkdown: string) => {
    setSegments((prev) =>
      prev.map((seg) => {
        if (seg.placeholder !== placeholder) return seg;
        const html = renderMarkdownToHtml(newMarkdown, rendererRef.current);
        return { ...seg, markdown: newMarkdown, htmlContent: html };
      })
    );
  }, []);

  const markdown = useMemo(() => {
    return segments.map((s) => `## ${s.placeholder}\n\n${s.markdown}`).join("\n\n---\n\n");
  }, [segments]);

  // Preview sin segmentación visible - flujo continuo con espaciado natural
  const combinedHtml = useMemo(() => {
    return segments
      .map((s) => s.htmlContent)
      .filter(Boolean) // Filtrar contenido vacío
      .map((html) => `<div class="segment-content">${html}</div>`) // Wrap para espaciado
      .join('\n');
  }, [segments]);

  return {
    segments,
    updateSegmentMarkdown,
    markdown,
    combinedHtml,
  };
}
