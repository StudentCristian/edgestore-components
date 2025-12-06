"use client"  

import { useEffect, useState } from "react"

interface PreviewPanelProps {  
  html: string  
}  

export function PreviewPanel({ html }: PreviewPanelProps) {  
  const [mathpixStyles, setMathpixStyles] = useState<string>("")

  // Cargar estilos de mathpix-markdown-it
  useEffect(() => {
    import("mathpix-markdown-it")
      .then((mod) => {
        const MM = mod.MathpixMarkdownModel || mod.default || mod
        if (MM && typeof MM.getMathpixMarkdownStyles === "function") {
          // useColors: true para obtener todos los estilos con colores
          setMathpixStyles(MM.getMathpixMarkdownStyles(true))
        } else if (MM && typeof MM.getMathpixStyle === "function") {
          setMathpixStyles(MM.getMathpixStyle(true))
        }
      })
      .catch(() => {
        // Fallback: no hay estilos de mathpix
      })
  }, [])

  return (  
    <div className="h-full overflow-auto">  
      {/* Inyectar estilos de mathpix */}
      {mathpixStyles && (
        <style dangerouslySetInnerHTML={{ __html: mathpixStyles }} />
      )}
      
      {/* Estilos personalizados para el preview */}
      <style>{`
        .preview-content {
          /* Tablas con bordes */
          & table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
            overflow: auto;
            display: block;
          }
          & table th,
          & table td {
            border: 1px solid #dfe2e5;
            padding: 0.5rem 0.75rem;
            text-align: left;
          }
          & table th {
            background-color: #f6f8fa;
            font-weight: 600;
          }
          & table tr:nth-child(even) {
            background-color: #f6f8fa;
          }
          
          /* Enlaces con colores */
          & a {
            color: #0B93ff;
            text-decoration: none;
            transition: color 0.2s ease;
          }
          & a:hover {
            color: #0070cc;
            text-decoration: underline;
          }
          
          /* Bloques de código */
          & pre {
            background: #f6f8fa;
            border-radius: 6px;
            padding: 1rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          & code {
            font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
            font-size: 0.875em;
            background: #f6f8fa;
            padding: 0.2em 0.4em;
            border-radius: 3px;
          }
          & pre code {
            background: transparent;
            padding: 0;
          }
          
          /* Blockquotes */
          & blockquote {
            border-left: 4px solid #dfe2e5;
            margin: 1rem 0;
            padding: 0.5rem 0 0.5rem 1rem;
            color: #6a737d;
            background: #f6f8fa;
          }
          
          /* Imágenes */
          & img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 0.5rem 0;
          }
          
          /* Listas */
          & ul, & ol {
            margin: 1rem 0;
            padding-left: 2rem;
          }
          & li {
            margin: 0.25rem 0;
          }
          
          /* Headings */
          & h1 { font-size: 2rem; font-weight: 700; margin: 1.5rem 0 1rem; border-bottom: 1px solid #eaecef; padding-bottom: 0.3rem; }
          & h2 { font-size: 1.5rem; font-weight: 600; margin: 1.25rem 0 0.75rem; border-bottom: 1px solid #eaecef; padding-bottom: 0.3rem; }
          & h3 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; }
          & h4 { font-size: 1rem; font-weight: 600; margin: 1rem 0 0.5rem; }
          
          /* Párrafos */
          & p {
            margin: 0.75rem 0;
            line-height: 1.7;
          }
          
          /* Líneas horizontales */
          & hr {
            border: none;
            border-top: 1px solid #eaecef;
            margin: 1.5rem 0;
          }
          
          /* Segmentos */
          & .segment-content {
            margin-bottom: 1.5rem;
          }
          & .segment-content:last-child {
            margin-bottom: 0;
          }
        }
        
        /* Dark mode support */
        .dark .preview-content {
          & table th,
          & table td {
            border-color: #30363d;
          }
          & table th {
            background-color: #21262d;
          }
          & table tr:nth-child(even) {
            background-color: #161b22;
          }
          & a {
            color: #58a6ff;
          }
          & a:hover {
            color: #79c0ff;
          }
          & pre, & code {
            background: #161b22;
          }
          & blockquote {
            border-color: #30363d;
            background: #161b22;
            color: #8b949e;
          }
          & h1, & h2 {
            border-color: #21262d;
          }
          & hr {
            border-color: #21262d;
          }
        }
      `}</style>
      
      <div  
        className="preview-content max-w-none p-6"
        dangerouslySetInnerHTML={{ __html: html }}  
      />  
    </div>  
  )  
}