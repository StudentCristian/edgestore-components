'use client';  
  
import * as React from "react";  
import { useForm } from "react-hook-form";  
import { FileDown, Download, FileText } from "lucide-react";  
import { Button } from "@/components/ui/button";  
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";  
import { Input } from "@/components/ui/input";  
import { Switch } from "@/components/ui/switch";  
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";  
import { useToast } from "@/components/ui/use-toast";  
import { FieldData } from "@/lib/docx/types";  
  
// Tipo helper para DynamicFields  
type DynamicFieldsResult = Record<string, string>;  
  
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
  
export function DocumentForm({   
  selectedDocument,   
  documentTags,   
  onGenerateStart,   
  onGenerateComplete,   
  onGenerateError   
}: DocumentFormProps) {  
  const [generating, setGenerating] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [selectedNameField, setSelectedNameField] = React.useState<string | null>(null);
  const { toast } = useToast();  
  const inputRefs = React.useRef<{ [key: string]: HTMLInputElement | null }>({});  
  const placeholders = React.useMemo(() => Object.keys(documentTags), [documentTags]);  
  
  // Initialize form with default values based on placeholders  
  const defaultValues = React.useMemo(() => {  
    return placeholders.reduce((acc: { [key: string]: FieldConfig }, field: string) => {  
      acc[field] = { value: "", type: "prompt" };  
      return acc;  
    }, {});  
  }, [placeholders]);  
  
  const form = useForm<{ [key: string]: FieldConfig }>({  
    defaultValues,  
  });  
  
  // Update form when placeholders change  
  React.useEffect(() => {  
    form.reset(defaultValues);  
  }, [defaultValues, form]);  
  
  const handleInputChange = (id: string, value: string) => {  
    form.setValue(`${id}.value`, value);  
  };  
  
  // Función adaptada para usar la API /api/process-form
  const generateContentWithBaml = async (placeholders: string[]): Promise<Record<string, FieldData>> => {
    const fields: Record<string, FieldData> = {};
    
    try {
      // Obtener valores reales del formulario
      const formValues = form.getValues();
      
      // Separar campos de tipo "data" y "prompt"
      const dataFields: Record<string, string> = {};
      const promptFields: Record<string, string> = {};
      
      placeholders.forEach(placeholder => {
        const fieldConfig = formValues[placeholder];
        if (fieldConfig?.type === 'data' && fieldConfig.value) {
          dataFields[placeholder] = fieldConfig.value;
        } else if (fieldConfig?.type === 'prompt') {
          // ✅ Incluir TODOS los campos prompt, incluso si están vacíos
          promptFields[placeholder] = fieldConfig.value || '';
        }
      });
      
      // Construir structuredData para tu API existente
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
      
      if (!success) {
        throw new Error('API returned unsuccessful response');
      }
      
      placeholders.forEach(placeholder => {
        const fieldConfig = formValues[placeholder];
        fields[placeholder] = {
          originalValue: fieldConfig?.value || '',
          generatedValue: generatedContent[placeholder] || `Contenido generado para ${placeholder}`,
          isPrompt: fieldConfig?.type === 'prompt'
        };
      });
      
    } catch (error) {
      console.error('Error generating content with ProcessForm:', error);
      
      // Fallback usando valores del formulario
      const formValues = form.getValues();
      placeholders.forEach(placeholder => {
        const fieldConfig = formValues[placeholder];
        fields[placeholder] = {
          originalValue: fieldConfig?.value || '',
          generatedValue: `Contenido generado para ${placeholder}`,
          isPrompt: fieldConfig?.type === 'prompt'
        };
      });
    }
    
    return fields;
  };
  
  // Función principal de descarga DOCX (nuevo sistema)  
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

      // Obtener el nombre personalizado si está seleccionado
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

      // 3. Generar contenido con BAML
      const generatedFields = await generateContentWithBaml(detectedPlaceholders);

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

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error generando documento",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };  
  
  // Sistema antiguo simplificado sin dependencias problemáticas  
  const onSubmit = async (data: { [key: string]: FieldConfig }) => {  
    toast({  
      title: "Sistema Antiguo",  
      description: "Usa el botón 'Download DOCX' para el nuevo sistema",  
      variant: "destructive"  
    });  
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
  
  return (  
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Document Form</CardTitle>
        <CardDescription>Complete the fields to generate your document</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="document-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {placeholders.map((field) => (
              <div key={field} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <FormLabel className="text-base font-semibold">{field}</FormLabel>
                    {/* Selector de nombre de documento - estilo mejorado */}
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
                            <span className="text-sm text-muted-foreground">Data Input</span>
                            <FormControl>
                              <Switch
                                checked={formField.value === "prompt"}
                                onCheckedChange={(checked) => formField.onChange(checked ? "prompt" : "data")}
                              />
                            </FormControl>
                            <span className="text-sm text-muted-foreground">AI Prompt</span>
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
                        <div className="relative">
                          <Input
                            {...formField}
                            value={formField.value ?? ''}
                            placeholder={form.watch(`${field}.type`) === "prompt"
                              ? `Enter instructions for generating ${field}`
                              : `Enter value for ${field}`}
                            onChange={(e) => {
                              formField.onChange(e);
                              handleInputChange(field, e.target.value);
                            }}
                            ref={(el) => {
                              inputRefs.current[field] = el;
                            }}
                            className="w-full"
                          />
                        </div>
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
      <CardFooter className="flex gap-2">
        {/* Botón del sistema antiguo simplificado */}
        <Button
          type="submit"
          form="document-form"
          variant="outline"
          className="flex-1"
          disabled={generating}
        >
          <FileDown className="h-4 w-4 mr-2" />
          {generating ? "Generating..." : "Generate (Old)"}
        </Button>

        {/* Nuevo botón Download DOCX */}
        <Button
          onClick={handleDownloadDocx}
          disabled={isDownloading || !selectedDocument}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? 'Generando...' : 'Download DOCX'}
        </Button>
      </CardFooter>
    </Card>
  );  
}