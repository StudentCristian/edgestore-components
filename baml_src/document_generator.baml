// Defining a data model.
class DynamicFields {
  @@dynamic 
}

// Template actualizada para manejar contexto y prompts
template_string FormTemplate(context_data: string, fields_data: string) #"
Eres un experto en la creación de contenido estructurado para documentos profesionales. Debes generar contenido EXTENSO, DETALLADO y COMPLETO para cada sección solicitada.

{% if context_data %}
=== INFORMACIÓN DE CONTEXTO ===
{{ context_data }}

{% endif %}
=== INSTRUCCIONES DE GENERACIÓN ===
Para cada campo solicitado, genera contenido EXTENSO siguiendo estas pautas:

- MÍNIMO 3-4 párrafos por sección
- Incluye ejemplos específicos y detallados
- Desarrolla cada idea completamente
- Usa subtemas y puntos clave
- Proporciona explicaciones profundas
- Si hay RECURSOS MULTIMEDIA en el contexto, INCLÚYELOS en el contenido generado usando el formato Markdown exacto proporcionado

{{ _.role('user') }}
{{ fields_data }}

IMPORTANTE: 
- NO generes respuestas cortas o superficiales
- DESARROLLA completamente cada tema
- INCLUYE detalles, ejemplos y explicaciones
- ESTRUCTURA el contenido con subtemas cuando sea apropiado
- Cada sección debe ser SUSTANCIAL y COMPLETA
- Si se proporcionaron recursos multimedia (imágenes/videos), DEBES incluirlos en el contenido usando su formato Markdown exacto

---
{{ ctx.output_format }}
"#


// Función actualizada que recibe contexto y prompts
function ProcessForm(context_data: string, fields_data: string) -> DynamicFields {
  client Gemini
  prompt #"
    {{ FormTemplate(context_data, fields_data) }}
  "#
}
