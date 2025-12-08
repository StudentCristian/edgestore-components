'use client';  
  
import { Button } from '@/components/ui/button';  
import {  
  Form,  
  FormControl,  
  FormField,  
  FormItem,  
  FormLabel,  
  FormMessage,  
} from '@/components/ui/form';  
import { Input } from '@/components/ui/input';  
import { FileTextIcon, Download } from 'lucide-react';  
import * as React from 'react';  
import { useForm } from 'react-hook-form';  
import { useToast } from '@/components/ui/use-toast';  
import { FieldData } from '@/lib/docx/types';  
  
// Tipo helper para DynamicFields  
type DynamicFieldsResult = Record<string, string>;  
  
interface DynamicDocumentFormProps {  
  tags: Record<string, any> | null;  
  selectedFile: {  
    url: string;  
    filename: string;  
    uploadedAt: Date;  
  } | null;  
  onGenerateStart?: () => void;  
  onGenerateComplete?: (url: string, filename: string) => void;  
  onGenerateError?: (error: string) => void;  
}  
  
export function DynamicDocumentForm({  
  tags,  
  selectedFile,  
  onGenerateStart,  
  onGenerateComplete,  
  onGenerateError,  
}: DynamicDocumentFormProps) {  
  const [isGenerating, setIsGenerating] = React.useState(false);  
  const [isDownloading, setIsDownloading] = React.useState(false);  
  const { toast } = useToast();  
    
  // Crear schema dinámicamente  
  const formSchema = React.useMemo(() => {  
    if (!tags) return {};  
    return Object.keys(tags).reduce((acc, tag) => {  
      acc[tag] = '';  
      return acc;  
    }, {} as Record<string, string>);  
  }, [tags]);  
    
  const form = useForm({  
    defaultValues: formSchema,  
  });  
    
  React.useEffect(() => {  
    if (tags) {  
      form.reset(formSchema);  
    }  
  }, [tags, form, formSchema]);  
    
  // Función para generar contenido usando la API /api/process-form  
  const generateContentWithBaml = async (placeholders: string[]): Promise<Record<string, FieldData>> => {  
    const fields: Record<string, FieldData> = {};  
    const formValues = form.getValues(); // Obtener valores actuales del formulario  
      
    try {  
      // Construir structuredData para la API usando valores del formulario  
      const structuredData = {  
        data: {}, // Sin datos de contexto adicionales  
        prompt: placeholders.reduce((acc, placeholder) => {  
          // Usar el valor real del formulario o un placeholder si está vacío  
          const userInstruction = formValues[placeholder] || `Generar contenido detallado y extenso para: ${placeholder}`;  
          acc[placeholder] = userInstruction;  
          return acc;  
        }, {} as Record<string, string>)  
      };  
        
      // Llamar a la API  
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
        fields[placeholder] = {    
          originalValue: formValues[placeholder] || '', // Guardar el valor original del usuario  
          generatedValue: generatedContent[placeholder] || `Contenido generado para ${placeholder}`,    
          isPrompt: true    
        };    
      });    
          
    } catch (error) {    
      console.error('Error generating content with ProcessForm:', error);    
      placeholders.forEach(placeholder => {    
        fields[placeholder] = {    
          originalValue: formValues[placeholder] || '',  
          generatedValue: `Contenido generado para ${placeholder}`,    
          isPrompt: true    
        };    
      });    
    }    
        
    return fields;    
  };  
    
  // Nueva función de descarga DOCX  
  const handleDownloadDocx = async () => {  
    if (!selectedFile) {    
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
      const response = await fetch(selectedFile.url);    
      if (!response.ok) {    
        throw new Error('Failed to download template');    
      }    
          
      const templateBuffer = Buffer.from(await response.arrayBuffer());    
          
      // 2. Detectar placeholders    
      const detectFormData = new FormData();    
      const templateFile = new File([templateBuffer], selectedFile.filename);    
      detectFormData.append('template', templateFile);    
          
      const detectResponse = await fetch('/api/docx/detect-placeholders', {    
        method: 'POST',    
        body: detectFormData    
      });    
          
      if (!detectResponse.ok) {    
        throw new Error('Error detectando placeholders');    
      }    
          
      const { placeholders } = await detectResponse.json();    
          
      // 3. Generar contenido con BAML    
      const generatedFields = await generateContentWithBaml(placeholders);    
          
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
      a.download = 'documento-generado.docx';    
      document.body.appendChild(a);    
      a.click();    
      window.URL.revokeObjectURL(url);    
      document.body.removeChild(a);    
          
      toast({    
        title: "Éxito",    
        description: "Documento DOCX generado y descargado"    
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
    
  // Sistema antiguo (compatibilidad temporal)  
  async function onSubmit(values: any) {  
    setIsGenerating(true);  
    onGenerateStart?.();  
        
    try {  
      // Sistema antiguo - puedes eliminar esto si ya no lo necesitas  
      onGenerateComplete?.(selectedFile?.url || '', selectedFile?.filename || '');  
    } catch (error) {  
      console.error('Error generating document:', error);  
      onGenerateError?.(error instanceof Error ? error.message : 'Unknown error generating document');  
    } finally {  
      setIsGenerating(false);  
    }  
  }  
    
  if (!tags || !selectedFile || Object.keys(tags).length === 0) {  
    return null;  
  }  
    
  return (  
    <div className="mt-8 w-full">  
      <h3 className="mb-4 text-lg font-semibold">Generar Documento</h3>  
      <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">  
        <Form {...form}>  
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">  
            <div className="grid gap-4 sm:grid-cols-2">  
              {tags && Object.keys(tags).map((tag) => (  
                <FormField  
                  key={tag}  
                  control={form.control}  
                  name={tag}  
                  render={({ field }) => (  
                    <FormItem>  
                      <FormLabel className="text-foreground">{tag}</FormLabel>  
                      <FormControl>  
                        <Input     
                          placeholder={`Ingresa ${tag}`}     
                          {...field}     
                          value={field.value ?? ''}     
                        />  
                      </FormControl>  
                      <FormMessage />  
                    </FormItem>  
                  )}  
                />  
              ))}  
            </div>  
                
            <div className="flex gap-2">  
              {/* Botón del sistema antiguo */}  
              <Button     
                type="submit"     
                variant="outline"    
                className="flex-1"    
                disabled={isGenerating}  
              >    
                <FileTextIcon className="h-4 w-4 mr-2" />  
                {isGenerating ? 'Generando...' : 'Generar (Antiguo)'}  
              </Button>  
                  
              {/* Nuevo botón Download DOCX */}  
              <Button  
                onClick={handleDownloadDocx}  
                disabled={isDownloading || !selectedFile}  
                className="flex-1"  
              >  
                <Download className="h-4 w-4 mr-2" />  
                {isDownloading ? 'Generando...' : 'Descargar DOCX'}  
              </Button>  
            </div>  
          </form>  
        </Form>  
      </div>  
    </div>  
  );  
}