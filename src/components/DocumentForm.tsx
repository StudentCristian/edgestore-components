'use client';  
  
import * as React from "react";  
import { useForm } from "react-hook-form";
import { Download, FileDown, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SegmentedEditor } from "@/components/editor";
import { useToast } from "@/components/ui/use-toast";  
import { FieldData } from "@/lib/docx/types";  

interface FieldConfig {
  value: string;
  type: "data" | "prompt";
}

interface DocumentFormProps {  
  selectedDocument: {  
    url: string;  
    filename: string;  
    uploadedAt: Date;  
  };  
  documentTags: Record<string, any>;  
  onGenerateStart?: () => void;  
  onGenerateComplete?: (url: string, filename: string) => void;  
  onGenerateError?: (error: string) => void;  
}  

// Tipo para el contenido inicial del editor
interface EditorInitialContent {
  [placeholder: string]: string;
}

export function DocumentForm({   
  selectedDocument,   
  documentTags,   
  onGenerateStart,   
  onGenerateComplete,   
  onGenerateError   
}: DocumentFormProps) {  
  // Estados del flujo
  const [step, setStep] = React.useState<'form' | 'editor'>('form');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [selectedNameField, setSelectedNameField] = React.useState<string | null>(null);
  const [editorInitialContent, setEditorInitialContent] = React.useState<EditorInitialContent>({});
  const [generatedMarkdown, setGeneratedMarkdown] = React.useState<string>("");
  
  const { toast } = useToast();  
  const placeholders = React.useMemo(() => Object.keys(documentTags), [documentTags]);  

  // Configuración del formulario
  const defaultValues = React.useMemo(() => {  
    return placeholders.reduce((acc: { [key: string]: FieldConfig }, field: string) => {  
      acc[field] = { value: "", type: "prompt" };  
      return acc;  
    }, {});  
  }, [placeholders]);  
  
  const form = useForm<{ [key: string]: FieldConfig }>({  
    defaultValues,  
  });  
  
  // Reset form cuando cambian los placeholders
  React.useEffect(() => {  
    form.reset(defaultValues);
    setStep('form');
    setEditorInitialContent({});
  }, [defaultValues, form]);  

  // Función para generar contenido con BAML
  const generateContentWithBaml = async (formValues: { [key: string]: FieldConfig }): Promise<EditorInitialContent> => {
    const content: EditorInitialContent = {};
    
    // Separar campos de tipo "data" y "prompt"
    const dataFields: Record<string, string> = {};
    const promptFields: Record<string, string> = {};
    
    placeholders.forEach(placeholder => {
      const fieldConfig = formValues[placeholder];
      if (fieldConfig?.type === 'data') {
        // Para campos de datos, usar directamente el valor
        dataFields[placeholder] = fieldConfig.value || '';
        content[placeholder] = fieldConfig.value || '';
      } else if (fieldConfig?.type === 'prompt') {
        promptFields[placeholder] = fieldConfig.value || '';
      }
    });
    
    // Si hay campos de tipo prompt, llamar a la API de BAML
    if (Object.keys(promptFields).length > 0) {
      try {
        const structuredData = {
          data: dataFields,
          prompt: promptFields
        };

        const response = await fetch('/api/process-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ structuredData })
        });
        
        if (!response.ok) {
          throw new Error('Error calling process-form API');
        }
        
        const { success, data: generatedContent } = await response.json();
        
        if (success && generatedContent) {
          // Agregar contenido generado por AI
          Object.keys(promptFields).forEach(placeholder => {
            content[placeholder] = generatedContent[placeholder] || `Contenido generado para ${placeholder}`;
          });
        } else {
          // Fallback si la API no devuelve éxito
          Object.keys(promptFields).forEach(placeholder => {
            content[placeholder] = `[AI] Contenido para: ${promptFields[placeholder] || placeholder}`;
          });
        }
      } catch (error) {
        console.error('Error generating content with BAML:', error);
        // Fallback en caso de error
        Object.keys(promptFields).forEach(placeholder => {
          content[placeholder] = `[Error AI] ${promptFields[placeholder] || placeholder}`;
        });
      }
    }
    
    return content;
  };

  // Handler para el botón Generate
  const handleGenerate = async () => {
    const formValues = form.getValues();
    
    setIsGenerating(true);
    onGenerateStart?.();
    
    try {
      const content = await generateContentWithBaml(formValues);
      setEditorInitialContent(content);
      setStep('editor');
      
      toast({
        title: "Contenido generado",
        description: "Ahora puedes editar el contenido antes de descargar el documento."
      });
    } catch (error) {
      console.error('Generate error:', error);
      onGenerateError?.(error instanceof Error ? error.message : 'Error generando contenido');
      toast({
        title: "Error",
        description: "Error al generar el contenido",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler para volver al formulario
  const handleBackToForm = () => {
    setStep('form');
  };

  // Función principal de descarga DOCX
  const handleDownloadDocx = async () => {  
    if (!selectedDocument) {  
      toast({  
        title: "Error",  
        description: "Por favor selecciona un documento primero",  
        variant: "destructive"  
      });  
      return;  
    }  
  
    setIsDownloading(true);
    try {
      // 1. Obtener el archivo template
      const response = await fetch(selectedDocument.url);
      if (!response.ok) {
        throw new Error('Failed to download the document template');
      }

      // Obtener nombre personalizado
      const formValues = form.getValues();
      let customFileName = selectedDocument.filename.replace(/\.docx$/, '') + '-generado';
      if (selectedNameField && formValues[selectedNameField]?.value) {
        customFileName = formValues[selectedNameField].value;
      }

      const templateFile = new File([await response.blob()], selectedDocument.filename, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      // 2. Detectar placeholders
      const detectFormData = new FormData();
      detectFormData.append('template', templateFile);

      const detectResponse = await fetch('/api/docx/detect-placeholders', {
        method: 'POST',
        body: detectFormData
      });

      if (!detectResponse.ok) {
        throw new Error('Error detectando placeholders');
      }

      const { placeholders: detectedPlaceholders } = await detectResponse.json();

      // 3. Usar contenido del editor segmentado
      const generatedFields = detectedPlaceholders.reduce((acc: Record<string, FieldData>, placeholder: string) => {
        acc[placeholder] = {
          originalValue: "",
          generatedValue: generatedMarkdown.includes(`## ${placeholder}`)
            ? generatedMarkdown.split(`## ${placeholder}`)[1]?.split('---')[0]?.trim() || `Contenido para ${placeholder}`
            : `Contenido para ${placeholder}`,
          isPrompt: true
        };
        return acc;
      }, {} as Record<string, FieldData>);

      // 4. Convertir a DOCX
      const convertFormData = new FormData();
      convertFormData.append('template', templateFile);
      convertFormData.append('fields', JSON.stringify(generatedFields));

      const convertResponse = await fetch('/api/docx/convert', {
        method: 'POST',
        body: convertFormData
      });

      if (!convertResponse.ok) {
        throw new Error('Error convirtiendo a DOCX');
      }

      // 5. Descargar archivo
      const blob = await convertResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${customFileName}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Éxito",
        description: `Documento DOCX generado y descargado como "${customFileName}.docx"`
      });

      onGenerateComplete?.(url, `${customFileName}.docx`);

    } catch (error) {
      console.error('Download error:', error);
      onGenerateError?.(error instanceof Error ? error.message : 'Error descargando documento');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error generando documento",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };  
  
  if (!selectedDocument || placeholders.length === 0) {  
    return (  
      <Card className="w-full mt-8">  
        <CardContent className="pt-6">  
          <div className="text-center text-muted-foreground">  
            {!selectedDocument   
              ? "Select a document to generate a form"  
              : "No placeholders found in the document"  
            }  
          </div>  
        </CardContent>  
      </Card>  
    );  
  }

  // PASO 1: Formulario dinámico
  if (step === 'form') {
    return (
      <Card className="w-full mt-8">
        <CardHeader>
          <CardTitle>Document Form</CardTitle>
          <CardDescription>Complete the fields to generate your document. Choose Data for direct values or AI for generated content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              {placeholders.map((field) => (
                <div key={field} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <FormLabel className="text-base font-semibold">{field}</FormLabel>
                      {/* Selector de nombre de documento */}
                      <button
                        type="button"
                        onClick={() => setSelectedNameField(selectedNameField === field ? null : field)}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                          selectedNameField === field
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                        title={`Usar "${field}" como nombre del archivo`}
                      >
                        <FileText className="h-3 w-3" />
                        {selectedNameField === field ? 'Nombre ✓' : 'Usar como nombre'}
                      </button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`${field}.type`}
                      render={({ field: formField }) => (
                        <FormItem className="flex items-center space-x-2">
                          <div className="flex items-center justify-between w-full gap-4">
                            <FormLabel className="text-sm font-medium">Input Type</FormLabel>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">Data</span>
                              <FormControl>
                                <Switch
                                  checked={formField.value === "prompt"}
                                  onCheckedChange={(checked) => formField.onChange(checked ? "prompt" : "data")}
                                />
                              </FormControl>
                              <span className="text-sm text-muted-foreground">AI</span>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`${field}.value`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...formField}
                            value={formField.value ?? ''}
                            placeholder={form.watch(`${field}.type`) === "prompt"
                              ? `Enter instructions for generating ${field}`
                              : `Enter value for ${field}`}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // PASO 2: Editor segmentado
  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Editor de Documento</CardTitle>
            <CardDescription>Revisa y edita el contenido generado antes de descargar</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleBackToForm}>
            ← Volver al formulario
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <SegmentedEditor 
          placeholders={placeholders}
          initialContent={editorInitialContent}
          onContentChange={(markdown) => {
            setGeneratedMarkdown(markdown);
          }}
        />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={handleDownloadDocx}
          disabled={isDownloading || !selectedDocument}
          className="flex-1"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download DOCX
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );  
}