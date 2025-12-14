class DynamicFields {  
  @@dynamic  
}  
  
class CurriculumRow {  
  grado string @description("Grado escolar (ej: PRIMERO, SEGUNDO, TERCERO, etc.)")  
  periodo string @description("Período académico (PRIMER, SEGUNDO, TERCER, CUARTO)")  
  area string @description("Área de conocimiento o asignatura")  
  contenidos_tematicos string @description("Temas específicos del currículo para el grado y período")  
  evidencias_del_dba string @description("Evidencias de aprendizaje según los Derechos Básicos de Aprendizaje")  
  estandar_basico_competencia string @description("Estándares básicos de competencias del Ministerio de Educación")  
  indicador_desempeno string @description("Descriptor o indicador de desempeño específico")  
} 
  
class CurriculumData {  
  rows CurriculumRow[] @description("Filas de datos curriculares organizadas por grado y período")  
}  
  
class PdfKnowledge {  
  title string @description("Título del documento PDF")  
  content string @description("Contenido principal extraído del PDF")  
  competencias string[] @description("Lista de competencias identificadas en el documento")  
  estandares string[] @description("Estándares educativos mencionados en el PDF")  
}  
  
function ProcessForm(context_data: string, fields_data: string, media_context: string?) -> DynamicFields {
  client Gemini
  prompt #"
    Actúa como un Coordinador Académico Experto en Pedagogía de Primaria (Grados 4° y 5°).
    Tu misión es redactar el contenido de la clase respetando estrictamente la estructura de la plantilla Word.

    === 1. MANDATO DE RECURSOS MULTIMEDIA (Prioridad Crítica) ===
    {% if media_context %}
    **ATENCIÓN: SI EL USUARIO HA PROPORCIONADO RECURSOS REALES.**
    Debes insertar estos recursos OBLIGATORIAMENTE dentro del texto de las fases.

    LISTA DE RECURSOS:
    {{ media_context }}

    **REGLAS DE INSERCIÓN:**
    1. **COPIA TEXTUAL:** Debes copiar y pegar el código Markdown exacto del recurso (ej: `![Alt](url)` o `[![Alt](img)](url)`) dentro de tu redacción.
    2. **UBICACIÓN:**
       - Si es una IMAGEN: Úsala preferiblemente en **Exploración** o **Estructuración**.
       - Si es un VIDEO: Úsalo en **Estructuración** o al inicio de **Aplicación**.
    3. **INTEGRACIÓN:** No dejes el link suelto. Introdúcelo con texto narrativo.
       - *Correcto:* "Para entender mejor, observemos el siguiente esquema: \n\n ![Tabla](url) \n\n Como pueden ver..."
    {% else %}
    *NO hay recursos reales:* Escribe sugerencias editables entre corchetes.
    *Ejemplo:* "...observaremos un [Video corto sobre X] y luego..."
    {% endif %}

    {% if context_data %}
    === CONTEXTO PEDAGÓGICO ===
    {{ context_data }}
    {% endif %}

    === 2. REGLAS DE FORMATO "ANTI-ROBOT" ===
    A. **NO USAR TÍTULOS DE FASES:** La plantilla ya tiene encabezados grises ("FASE EXPLORACIÓN", etc.).
    B. **LISTAS PLANAS:** Párrafos + lista simple (1., 2., 3.). No anidar.
    C. **MARKDOWN:** Negrita para conceptos clave.

    === 3. INSTRUCCIONES ESPECÍFICAS POR CAMPO ===

    **PARA EL CAMPO 'exploracion' (Fase Exploración - 10 min):**
    - **SIN TÍTULOS.** (No escribas "Actividad Inicial").
    - Redacta el gancho o dinámica. *Si hay una imagen en los recursos, insértala aquí.*

    **PARA EL CAMPO 'estructuracion' (Fase Estructuración - 20 min):**
    - **SIN TÍTULOS.** (No escribas "Actividad 1").
    - Explicación del concepto. *Si hay un video explicativo en los recursos, insértalo aquí.*

    **PARA EL CAMPO 'actividades' (Fase Aplicación - 40 min):**
    - **AQUÍ SÍ USA TÍTULOS.** Genera EXACTAMENTE estas 4 actividades:
       1. Título: **Actividad Inicial** (Instrucción breve de preparación).
       2. Espacio.
       3. Título: **Actividad 1** (Ejercicio guiado).
       4. Espacio.
       5. Título: **Actividad 2** (Ejercicio grupal).
       6. Espacio.
       7. Título: **Actividad 3** (Cierre/Evaluación).

    === 4. CEREBRO PEDAGÓGICO (4°-5° Primaria) ===
    *Chain of Thought (Reflexiona antes de generar):*
    1. ¿Cómo conecto esto con su vida real?
    2. ¿Qué analogía simple explica el concepto difícil?
    3. ¿Qué producto tangible van a crear?

    {{ _.role('user') }}
    DATOS DE LA CLASE:
    {{ fields_data }}

    {{ ctx.output_format }}
  "#
}



  
function ExtractPdfKnowledge(pdf: image) -> string {  
  client Gemini  
  prompt #"  
    {{ _.role("user") }}  
    Extrae el conocimiento clave del siguiente PDF sobre educación en tecnología:  
      
    {{ pdf }}  
      
    Enfócate en:  
    1. Estándares de competencias en tecnología  
    2. Evidencias de aprendizaje  
    3. Indicadores de desempeño  
    4. Enfoques pedagógicos  
      
    IMPORTANTE: Si no encuentras información específica para un tema o grado particular,   
    indícalo claramente y proporciona orientaciones generales basadas en conocimientos pedagógicos.  
      
    Retorna el contenido en formato texto plano.  
  "#  
} 
  
function ExtractCurriculumData(  
  curriculum_content: string,   
  grado: string,   
  periodo: string,   
  tema: string  
) -> string {  
  client Gemini  
  prompt #"  
    {{ _.role("user") }}  
    ATENCIÓN: INSTRUCCIONES CRÍTICAS - SEGUIR EXACTAMENTE  
      
    Busca la fila que coincida EXACTAMENTE con:  
    GRADO: {{ grado }}  
    PERIODO: {{ periodo }}  
    CONTENIDOS TEMATICOS: {{ tema }}  
      
    Tabla:  
    {{ curriculum_content }}  
      
    REGLAS OBLIGATORIAS:  
    1. Si el campo TIENE contenido (no es | |): USA EL VALOR EXACTO  
    2. Si el campo está VACÍO (| |): GENERA contenido nuevo  
    3. NUNCA GENERES contenido si el campo ya tiene valor  
    4. NUNCA USES el valor de otro campo  
      
    Para cada campo vacío, genera contenido ÚNICO y DIFERENTE:  
    - EVIDENCIAS DEL DBA: Lo que el estudiante DEMUESTRA  
    - ESTANDAR BÁSICO DE COMPETENCIA: Lo que se ESPERA que logre  
    - INDICADOR DE DESEMPEÑO: Cómo se VERIFICA el aprendizaje  
      
    Ejemplo de campo VACÍO: | |  
    Ejemplo de campo CON contenido: | Texto existente |  
      
    Formato EXACTO de respuesta:  
    EVIDENCIAS DEL DBA: [valor exacto si existe, generado si vacío]  
    ESTANDAR BÁSICO DE COMPETENCIA: [valor exacto si existe, generado si vacío]  
    INDICADOR DE DESEMPEÑO: [valor exacto si existe, generado si vacío]  
  "#  
}

function ProcessFormWithRAG(  
  form_data: string,  
  prompts: string,  
  pdf_content: string,  
  curriculum_content: string,  
  media_context: string?  
) -> DynamicFields {  
  client Gemini  
    
  prompt #"  
    Eres un experto en pedagogía y tecnología educativa.  
      
    === CONOCIMIENTO DEL PDF ===  
    {{ pdf_content }}  
      
    === TABLA CURRICULAR ===  
    {{ curriculum_content }}  
      
    === DATOS DEL FORMULARIO ===  
    {{ form_data }}  
      
    === INSTRUCCIONES ===  
    {{ prompts }}  
      
    {% if media_context %}  
    === RECURSOS MULTIMEDIA ===  
    {{ media_context }}  
    {% endif %}  
      
    {{ ctx.output_format }}  
  "#  
}