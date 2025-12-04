


# Instalar docx

```bash
npm unlink docx  
npm install ../test-list/docx

npm link docx

tree -I "node_modules|.next|.vscode|content|docsbaml"  
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