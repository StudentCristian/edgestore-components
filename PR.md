PR

## Plan — Editor de documentos con búsqueda integrada y previsualizador (v4)

### Objetivo
Crear una experiencia de generación de documentos donde:
1. Se buscan imágenes/videos automáticamente para campos marcados
2. **Primero se muestran los resultados en el panel de búsqueda**
3. Se envían máximo 10 resultados (5 imágenes + 5 videos) a BAML como contexto
4. **La IA genera contenido con streaming**, mostrándose progresivamente en el editor
5. El previsualizador renderiza el resultado final en markdown (con Mathpix-Markdown-it)

---

### Paso 1: Crear endpoint de búsqueda unificada

**Archivo**: route.ts

```typescript
// Parámetros:
// - query: string
// - limit?: number (default: 20 para UI, pero BAML solo recibe 10)
// Retorna: { images, videos }
```

---

### Paso 2: Límites de resultados

| Contexto | Imágenes | Videos | Total |
|----------|----------|--------|-------|
| **Panel de búsqueda (UI)** | 20 | 20 | 40 |
| **Contexto para BAML** | 5 | 5 | 10 |

**Implementación:**
- El endpoint retorna hasta 20 de cada tipo
- El frontend muestra todos en el panel
- Al enviar a BAML, se recortan a 5+5

---

### Paso 3: Modificar API `/api/process-form` con streaming

**Archivo**: route.ts

Actualizar para:
1. Recibir `mediaContext` opcional (máximo 10 elementos)
2. **Retornar respuesta con streaming** usando `ReadableStream`

```typescript
interface ProcessFormRequest {
  structuredData: {
    data: Record<string, string>;
    prompt: Record<string, string>;
  };
  mediaContext?: {
    query: string;
    images: { url: string; title: string; source: string; }[];  // máx 5
    videos: { url: string; title: string; thumbnail: string; embedUrl: string; }[];  // máx 5
  };
}
```

---

### Paso 4: Actualizar BAML para streaming

**Archivo**: document_generator.baml

Configurar función para usar streaming y recibir mediaContext limitado.

---

### Paso 5: Crear componentes

| Componente | Función |
|------------|---------|
| `DocumentEditor.tsx` | Editor segmentado con soporte para streaming |
| `MarkdownPreview.tsx` | Previsualizador con mathpix-markdown-it |
| `ImageGrid.tsx` | Grid de imágenes reutilizable |
| `VideoGrid.tsx` | Grid de videos reutilizable |
| `SearchResultsPanel.tsx` | Panel con barra + resultados |

---

### Paso 6: Modificar página de formularios

**Archivo**: page.tsx

Layout de 3 columnas con flujo integrado.

---

### Flujo completo de "Generate" (actualizado)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Usuario completa campos                                      │
│  2. Marca campo "tema" para búsqueda automática                 │
│  3. Click "Generate"                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 1: Búsqueda multimedia                                     │
│  /api/search/all/manual                                          │
│  Input: { query: "las células" }                                │
│  Output: { images: [20], videos: [20] }                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 2: Mostrar resultados en UI                               │
│  → Panel de búsqueda muestra 20 imágenes + 20 videos            │
│  → Usuario ve los recursos disponibles                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 3: Preparar contexto para BAML                            │
│  → Recortar a 5 imágenes + 5 videos (10 total)                  │
│  → Formatear como mediaContext                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 4: Generación con streaming                               │
│  /api/process-form (streaming)                                   │
│  Input: { structuredData, mediaContext (10 items) }             │
│  Output: Stream de texto markdown                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 5: Actualización progresiva                               │
│  → Editor recibe chunks y actualiza secciones                   │
│  → Previsualizador renderiza markdown en tiempo real            │
│  → Usuario ve el contenido aparecer progresivamente             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Experiencia de usuario

1. **Click "Generate"**
2. **Inmediatamente**: Panel de búsqueda muestra imágenes/videos encontrados
3. **Segundos después**: Editor comienza a llenarse con streaming
4. **Progresivamente**: Texto aparece palabra por palabra con multimedia integrado
5. **Al finalizar**: Documento completo listo para descargar

---

### Estructura de archivos

```
src/
  app/api/
    search/all/manual/route.ts    # Endpoint unificado
    process-form/route.ts         # Actualizado con streaming + mediaContext
  components/
    DocumentForm.tsx              # Flujo actualizado
    DocumentEditor.tsx            # Con soporte streaming
    MarkdownPreview.tsx           # Renderizado en tiempo real
    search/
      ImageGrid.tsx               # Grid reutilizable
      VideoGrid.tsx               # Grid reutilizable
      SearchResultsPanel.tsx      # Panel con resultados
baml_src/
  document_generator.baml         # Función con streaming + mediaContext
```

---

### Resumen de límites

| Elemento | Límite UI | Límite BAML |
|----------|-----------|-------------|
| Imágenes | 20 | 5 |
| Videos | 20 | 5 |
| **Total** | **40** | **10** |

---

### Commit sugerido
```
feat: streaming editor, media search with BAML context limits
```

---

¿Quieres que implemente este plan paso a paso?