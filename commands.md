


# Instalar docx

```bash
npm unlink docx  
npm install ../test-list/docx

npm link docx

tree -I "node_modules|.next|.vscode|content|baml_client"  
```

---

# SearXNG - Configuración

### Archivos de configuración (carpeta `searxng/`)

| Archivo | Descripción |
|---------|-------------|
| `settings.yml` | Configuración principal: secret_key, formatos (json/html), engines habilitados |
| `limiter.toml` | Rate limiting y detección de bots (opcional) |
| `uwsgi.ini` | Configuración del servidor uWSGI para Docker |

### Problemas comunes resueltos

1. **Error `secret_key is not changed`**: No usar `ultrasecretkey` - usar una clave única
2. **Error `schema of limiter.toml is invalid`**: Las claves `botdetection.ip_limit.activate` y `botdetection.token` ya no existen
3. **Error `no request plugin is loaded`**: Agregar `plugin = python3` en `uwsgi.ini`

### Comando para iniciar SearXNG (desarrollo local)

```bash
docker stop searxng; docker rm searxng; docker run -d --name searxng -p 8080:8080 -v $(pwd)/searxng:/etc/searxng -e SEARXNG_BASE_URL=http://localhost:8080 searxng/searxng:latest
```

### Verificar funcionamiento

```bash
# Esperar y probar búsqueda general
sleep 10 && curl "http://localhost:8080/search?q=test&format=json"

# Probar búsqueda de imágenes
curl "http://localhost:8080/search?q=cats&format=json&engines=google%20images,bing%20images"

# Probar búsqueda de videos
curl "http://localhost:8080/search?q=cats&format=json&engines=youtube"
```

### Configuración mínima requerida en `settings.yml`

```yaml
use_default_settings: true

server:
  secret_key: "TU_CLAVE_UNICA_AQUI"  # NO usar "ultrasecretkey"
  limiter: false
  image_proxy: true

search:
  formats:
    - html
    - json  # Crítico para API

engines:
  - name: google images
    engine: google_images
    disabled: false
  - name: bing images
    engine: bing_images
    disabled: false
  - name: youtube
    engine: youtube_noapi
    disabled: false
```

# Configurar variables de entorno

**`.env.local`**

```
EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=
GOOGLE_API_KEY=
SEARXNG_API_URL=http://localhost:8080
```

---

# API de Búsqueda - Endpoints

## Endpoints con IA (BAML)

Usan BAML para procesar el query antes de enviarlo a SearXNG.

| Endpoint | Método | Body |
|----------|--------|------|
| `/api/search/images` | POST | `{ "query": "...", "chatHistory": [] }` |
| `/api/search/videos` | POST | `{ "query": "...", "chatHistory": [] }` |

## Endpoints Manuales (sin IA)

Envían el query directamente a SearXNG sin procesamiento de IA.

| Endpoint | Método | Body |
|----------|--------|------|
| `/api/search/images/manual` | POST | `{ "query": "...", "engines?": [...] }` |
| `/api/search/videos/manual` | POST | `{ "query": "...", "engines?": [...] }` |

### Ejemplos curl (Manual)

```bash
# Búsqueda manual de imágenes
curl -X POST http://localhost:3000/api/search/images/manual \
  -H "Content-Type: application/json" \
  -d '{"query":"cats","engines":["google images","bing images"]}'

# Búsqueda manual de videos
curl -X POST http://localhost:3000/api/search/videos/manual \
  -H "Content-Type: application/json" \
  -d '{"query":"cats","engines":["youtube"]}'
```

### UI Toggle

En `/search` hay un switch para alternar entre modos:
- **Manual** (default): usa `/api/.../manual` - búsqueda directa
- **IA**: usa `/api/...` - procesa query con BAML antes de buscar

---

# Componentes de Búsqueda - Media Selection

## SearchResultsPanel

Panel unificado de búsqueda con modo seleccionable para elegir media.

### Props principales

| Prop | Tipo | Descripción |
|------|------|-------------|
| `selectable` | `boolean` | Habilita modo selección |
| `selectedImages` | `Set<string>` | Set de URLs de imágenes seleccionadas |
| `selectedVideos` | `Set<string>` | Set de IDs de videos seleccionados |
| `onImageSelect` | `(image: ImageResult) => void` | Callback al seleccionar imagen |
| `onVideoSelect` | `(video: VideoResult) => void` | Callback al seleccionar video |
| `onSearchComplete` | `(results: SearchResults) => void` | Callback al completar búsqueda (útil para limpiar selecciones) |
| `maxImageSelection` | `number` | Límite de imágenes (default: 5) |
| `maxVideoSelection` | `number` | Límite de videos (default: 5) |

## Formato Markdown para BAML

Los componentes ImageGrid y VideoGrid incluyen botón "Copy as Markdown" para copiar en formato:

```markdown
# Imágenes
![título](url_imagen)

# Videos  
[![título](thumbnail_url)](video_url)
```

### Contexto BAML simplificado

Solo se envían strings markdown (evita duplicación de datos):

```json
{
  "images": ["![título1](url1)", "![título2](url2)"],
  "videos": ["[![título](thumb)](url)"]
}
```

## Ejemplo de uso (test/page.tsx)

```tsx
const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
const [selectedImagesMarkdown, setSelectedImagesMarkdown] = useState<string[]>([]);
const [selectedVideosMarkdown, setSelectedVideosMarkdown] = useState<string[]>([]);

// Limpiar selecciones en nueva búsqueda
const handleSearchComplete = useCallback((results: SearchResults) => {
  setSelectedImages(new Set());
  setSelectedVideos(new Set());
  setSelectedImagesMarkdown([]);
  setSelectedVideosMarkdown([]);
}, []);

const handleImageSelect = (image: ImageResult) => {
  const markdown = `![${image.title}](${image.img_src})`;
  const isSelected = selectedImages.has(image.img_src);
  
  if (isSelected) {
    setSelectedImages((prev) => {
      const next = new Set(prev);
      next.delete(image.img_src);
      return next;
    });
    setSelectedImagesMarkdown((prev) => prev.filter(md => md !== markdown));
  } else {
    setSelectedImages((prev) => new Set(prev).add(image.img_src));
    setSelectedImagesMarkdown((prev) => [...prev, markdown]);
  }
};

<SearchResultsPanel
  selectable={true}
  selectedImages={selectedImages}
  selectedVideos={selectedVideos}
  onImageSelect={handleImageSelect}
  onVideoSelect={handleVideoSelect}
  onSearchComplete={handleSearchComplete}
  maxImageSelection={5}
  maxVideoSelection={5}
/>
```

---

# Editor Unificado por Segmentos

## Arquitectura

Layout de 2 columnas:
- **Izquierda**: Formulario (`DocumentForm`) - campos editables
- **Derecha**: Preview (`DocumentEditor`) - vista previa con edición inline

## DocumentForm

Formulario que maneja campos del documento Word.

### Props exportadas

```tsx
export interface FieldConfig {
  name: string;
  placeholder: string;
  type: 'text' | 'image' | 'prompt';
  required?: boolean;
  promptConfig?: { ... };
}

export interface FormEditorState {
  values: Record<string, string>;
  generatedContent: Record<string, string>;
  isGenerating: Record<string, boolean>;
}
```

| Prop | Tipo | Descripción |
|------|------|-------------|
| `onStateChange` | `(state: FormEditorState) => void` | Sincroniza estado con parent |
| `externalGeneratedContent` | `Record<string, string>` | Contenido editado desde el editor |

## DocumentEditor

Preview del documento con edición inline por segmentos.

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `fields` | `FieldConfig[]` | Configuración de campos |
| `values` | `Record<string, string>` | Valores actuales |
| `generatedContent` | `Record<string, string>` | Contenido generado por IA |
| `onContentChange` | `(field, content) => void` | Callback al editar contenido |
| `hasPromptFields` | `boolean` | Si hay campos tipo prompt |
| `allPromptsGenerated` | `boolean` | Si todos los prompts fueron generados |

### Estado en header

- ✓ **Ready** (verde): Todos los prompts generados
- ⚠ **Generate AI content first** (amarillo): Faltan prompts por generar

## Ejemplo de implementación (docs/page.tsx)

```tsx
const [formState, setFormState] = useState<FormEditorState>({
  values: {},
  generatedContent: {},
  isGenerating: {},
});
const [editorContent, setEditorContent] = useState<Record<string, string>>({});

// Layout 2 columnas
<div className="grid grid-cols-2 gap-6">
  <DocumentForm
    fields={fields}
    onStateChange={setFormState}
    externalGeneratedContent={editorContent}
  />
  <DocumentEditor
    fields={fields}
    values={formState.values}
    generatedContent={formState.generatedContent}
    onContentChange={(field, content) => {
      setEditorContent(prev => ({ ...prev, [field]: content }));
    }}
    hasPromptFields={hasPromptFields}
    allPromptsGenerated={allPromptsGenerated}
  />
</div>
```