'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileUploader } from '@/components/upload/multi-file';
import {
  UploaderProvider,
  useUploader,
  type CompletedFileState,
  type UploadFn,
} from '@/components/upload/uploader-provider';
import { useEdgeStore } from '@/lib/edgestore';
import { RefreshCwIcon, TagIcon, UploadCloudIcon, FileText, ArrowLeft, Download, Loader2, Sparkles, SearchCheck } from 'lucide-react';
import * as React from 'react';
import { toast } from '@/components/ui/use-toast';
import { WizardStepper } from '@/components/ui/wizard-stepper';
import { useWizardPersistence, type WizardPhase, type FieldConfig, type StoredFile, type SelectedMedia } from '@/hooks/useWizardPersistence';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SegmentedEditor } from '@/components/editor';
import { FieldData } from '@/lib/docx/types';
import { type Segment } from '@/hooks/useSegmentedContent';
import { FormSettingsDialog } from '@/components/form-settings-dialog';
import SearchResultsPanel from '@/components/search/SearchResultsPanel';
import { type ImageResult } from '@/components/search/ImageGrid';
import { type VideoResult } from '@/components/search/VideoGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

type UploadResult = {
  url: string;
  filename: string;
};

// Tipo para el contenido inicial del editor
interface EditorInitialContent {
  [placeholder: string]: string;
}

// Helper para generar markdown de media seleccionada
function generateMediaMarkdown(media: SelectedMedia): string {
  const lines: string[] = [];
  
  // Imágenes: ![title](img_src)
  media.images.forEach(img => {
    lines.push(`![${img.title}](${img.img_src})`);
  });
  
  // Videos: [![title](thumbnail)](video_url)
  media.videos.forEach(video => {
    lines.push(`[![${video.title}](${video.img_src})](${video.url})`);
  });
  
  return lines.join('\n');
}

export default function GeneratorPage() {
  // Estado del wizard
  const [phase, setPhase] = React.useState<WizardPhase>('upload');
  const [completedPhases, setCompletedPhases] = React.useState<WizardPhase[]>([]);
  
  // Estados de la fase Upload
  const [uploadRes, setUploadRes] = React.useState<UploadResult[]>([]);
  const [storedFiles, setStoredFiles] = React.useState<StoredFile[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<StoredFile | null>(null);
  const [documentTags, setDocumentTags] = React.useState<Record<string, any> | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingError, setProcessingError] = React.useState<string | null>(null);
  
  // Estados de la fase Provide Data
  const [selectedNameField, setSelectedNameField] = React.useState<string | null>(null);
  const [searchField, setSearchField] = React.useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = React.useState<SelectedMedia>({ images: [], videos: [] });
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [searchTrigger, setSearchTrigger] = React.useState<number>(0); // Usar contador en lugar de boolean
  const [searchButtonActive, setSearchButtonActive] = React.useState<boolean>(false); // Botón de búsqueda activo (verde)
  const [mobileTab, setMobileTab] = React.useState<'form' | 'search'>('form');
  
  // Estados de la fase Validate
  const [editorInitialContent, setEditorInitialContent] = React.useState<EditorInitialContent>({});
  const [generatedMarkdown, setGeneratedMarkdown] = React.useState<string>('');
  const [editorSegments, setEditorSegments] = React.useState<Segment[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  
  // Estados para AlertDialog de confirmación
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: '', description: '', onConfirm: () => {} });
  
  const { edgestore } = useEdgeStore();
  const {
    isHydrated,
    persistedData,
    hasFormData,
    saveFileSelection,
    saveFormState,
    saveSearchField,
    saveSelectedMedia,
    clearPersistedData,
    clearFormData,
  } = useWizardPersistence();

  // Placeholders del documento
  const placeholders = React.useMemo(() => 
    documentTags ? Object.keys(documentTags) : [], 
    [documentTags]
  );

  // Configuración del formulario
  const defaultValues = React.useMemo(() => {
    // Si hay datos persistidos, usarlos
    if (persistedData.formValues && Object.keys(persistedData.formValues).length > 0) {
      return persistedData.formValues;
    }
    // Si no, crear valores por defecto
    return placeholders.reduce((acc: Record<string, FieldConfig>, field: string) => {
      acc[field] = { value: '', type: 'prompt' };
      return acc;
    }, {});
  }, [placeholders, persistedData.formValues]);

  const form = useForm<Record<string, FieldConfig>>({
    defaultValues,
  });

  // Cargar datos persistidos al hidratar
  React.useEffect(() => {
    if (isHydrated && persistedData.selectedFile && persistedData.documentTags) {
      setSelectedFile(persistedData.selectedFile);
      setDocumentTags(persistedData.documentTags);
      if (persistedData.selectedNameField) {
        setSelectedNameField(persistedData.selectedNameField);
      }
      if (persistedData.searchField) {
        setSearchField(persistedData.searchField);
      }
      if (persistedData.selectedMedia) {
        setSelectedMedia(persistedData.selectedMedia);
      }
      // Si hay datos persistidos, ir a fase 2
      if (Object.keys(persistedData.formValues).length > 0) {
        setPhase('provide-data');
        setCompletedPhases(['upload']);
        form.reset(persistedData.formValues);
      }
    }
  }, [isHydrated, persistedData, form]);

  // Resetear formulario cuando cambian los placeholders
  React.useEffect(() => {
    if (placeholders.length > 0 && !persistedData.formValues?.[placeholders[0]]) {
      const newDefaults = placeholders.reduce((acc: Record<string, FieldConfig>, field: string) => {
        acc[field] = { value: '', type: 'prompt' };
        return acc;
      }, {});
      form.reset(newDefaults);
    }
  }, [placeholders, form, persistedData.formValues]);

  // Fetch stored files
  const fetchStoredFiles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/files');
      if (!response.ok) throw new Error('Error fetching files');
      const data = await response.json();
      setStoredFiles(data.files);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStoredFiles();
  }, [fetchStoredFiles]);

  // Upload function
  const uploadFn: UploadFn = React.useCallback(
    async ({ file, signal, onProgressChange }) => {
      const res = await edgestore.myPublicFiles.upload({
        file,
        signal,
        onProgressChange,
      });
      setUploadRes((prev) => [...prev, { url: res.url, filename: file.name }]);
      return { url: res.url };
    },
    [edgestore],
  );

  // Helper para mostrar confirmación con AlertDialog
  const showConfirmDialog = React.useCallback((
    title: string,
    description: string,
    onConfirm: () => void
  ) => {
    setConfirmDialog({ open: true, title, description, onConfirm });
  }, []);

  // Función para navegar entre fases con confirmaciones
  const goToPhase = React.useCallback((targetPhase: WizardPhase) => {
    // Si vamos hacia adelante, no hay confirmación
    const phaseOrder: WizardPhase[] = ['upload', 'provide-data', 'validate'];
    const currentIndex = phaseOrder.indexOf(phase);
    const targetIndex = phaseOrder.indexOf(targetPhase);

    if (targetIndex > currentIndex) {
      setPhase(targetPhase);
      return;
    }

    // Si vamos hacia atrás, mostrar confirmación según la fase actual
    if (phase === 'validate') {
      showConfirmDialog(
        'Volver al formulario',
        'Perderás el contenido editado/generado. ¿Deseas continuar?',
        () => {
          // Limpiar estados del editor
          setEditorInitialContent({});
          setGeneratedMarkdown('');
          setEditorSegments([]);
          // Limpiar selecciones de media y búsqueda para comenzar limpio
          setSelectedMedia({ images: [], videos: [] });
          setSearchQuery('');
          setSearchTrigger(0);
          setSearchButtonActive(false);
          setMobileTab('form');
          setPhase(targetPhase);
        }
      );
    } else if (phase === 'provide-data') {
      showConfirmDialog(
        'Cambiar plantilla',
        'Perderás la configuración del formulario (valores, tipos de campo, campo de nombre). ¿Deseas continuar?',
        () => {
          clearFormData();
          form.reset(placeholders.reduce((acc: Record<string, FieldConfig>, field: string) => {
            acc[field] = { value: '', type: 'prompt' };
            return acc;
          }, {}));
          setSelectedNameField(null);
          setSearchField(null);
          setSelectedMedia({ images: [], videos: [] });
          setCompletedPhases([]);
          setPhase(targetPhase);
        }
      );
    } else {
      setPhase(targetPhase);
    }
  }, [phase, clearFormData, form, placeholders, showConfirmDialog]);

  // Función interna para procesar el documento (sin confirmación)
  const processDocument = React.useCallback(async (file: StoredFile, shouldClearForm: boolean) => {
    if (shouldClearForm) {
      clearFormData();
    }

    setSelectedFile(file);
    setIsProcessing(true);
    setProcessingError(null);
    setDocumentTags(null);
    
    try {
      if (!file.filename.toLowerCase().endsWith('.docx')) {
        throw new Error('Only Word (.docx) documents are supported');
      }
      
      const fileResponse = await fetch(file.url);
      if (!fileResponse.ok) throw new Error('Failed to download the document');
      
      const blob = await fileResponse.blob();
      const formData = new FormData();
      formData.append('template', blob, file.filename);
      
      const response = await fetch('/api/docx/detect-placeholders', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to detect placeholders');
      }
      
      const { placeholders: detectedPlaceholders } = await response.json();
      const tags: Record<string, any> = {};
      detectedPlaceholders.forEach((placeholder: string) => {
        tags[placeholder] = true;
      });
      
      setDocumentTags(tags);
      saveFileSelection(file, tags);
      
      // Avanzar automáticamente a fase 2
      setCompletedPhases(['upload']);
      setPhase('provide-data');
      
      toast({
        title: 'Campos detectados',
        description: `Se encontraron ${detectedPlaceholders.length} campos editables en tu documento.`
      });
    } catch (error) {
      console.error('Error processing document:', error);
      setProcessingError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  }, [clearFormData, saveFileSelection]);

  // Extraer placeholders del documento (con confirmación si es necesario)
  const extractDocumentTags = React.useCallback((file: StoredFile) => {
    // Si hay datos de formulario existentes y es un archivo diferente, confirmar
    if (hasFormData && selectedFile && selectedFile.url !== file.url) {
      showConfirmDialog(
        'Cambiar documento',
        'Tienes datos guardados de otro formulario. ¿Deseas descartarlos y continuar con el nuevo documento?',
        () => processDocument(file, true)
      );
    } else {
      processDocument(file, false);
    }
  }, [hasFormData, selectedFile, showConfirmDialog, processDocument]);

  // Función para generar contenido con BAML
  const generateContentWithBaml = async (
    formValues: Record<string, FieldConfig>,
    mediaContext: SelectedMedia
  ): Promise<EditorInitialContent> => {
    const content: EditorInitialContent = {};
    
    const dataFields: Record<string, string> = {};
    const promptFields: Record<string, string> = {};
    
    placeholders.forEach(placeholder => {
      const fieldConfig = formValues[placeholder];
      if (fieldConfig?.type === 'data') {
        dataFields[placeholder] = fieldConfig.value || '';
        content[placeholder] = fieldConfig.value || '';
      } else if (fieldConfig?.type === 'prompt') {
        promptFields[placeholder] = fieldConfig.value || '';
      }
    });
    
    if (Object.keys(promptFields).length > 0) {
      try {
        const response = await fetch('/api/process-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            structuredData: { data: dataFields, prompt: promptFields },
            mediaContext: (mediaContext.images.length > 0 || mediaContext.videos.length > 0)
              ? generateMediaMarkdown(mediaContext)
              : undefined
          })
        });
        
        if (!response.ok) throw new Error('Error calling process-form API');
        
        const responseData = await response.json();
        
        if (responseData?.success && responseData.data) {
          Object.keys(promptFields).forEach(placeholder => {
            const value = responseData.data[placeholder];
            content[placeholder] = typeof value === 'string' && value.trim() 
              ? value 
              : `Contenido generado para ${placeholder}`;
          });
        } else {
          Object.keys(promptFields).forEach(placeholder => {
            content[placeholder] = `[AI] Contenido para: ${promptFields[placeholder] || placeholder}`;
          });
        }
      } catch (error) {
        console.error('Error generating content with BAML:', error);
        Object.keys(promptFields).forEach(placeholder => {
          content[placeholder] = `[Error AI] ${promptFields[placeholder] || placeholder}`;
        });
      }
    }
    
    return content;
  };

  // Handler para generar contenido
  const handleGenerate = async () => {
    const formValues = form.getValues();
    
    // Guardar estado del formulario con searchField y selectedMedia
    saveFormState(formValues, selectedNameField, searchField, selectedMedia);
    
    // Verificar si hay algún campo de tipo 'prompt' (AI)
    const hasPromptFields = placeholders.some(
      placeholder => formValues[placeholder]?.type === 'prompt'
    );
    
    // Si todos los campos son 'data', ir al editor sin llamar a BAML (flujo silencioso)
    if (!hasPromptFields) {
      const content: EditorInitialContent = {};
      placeholders.forEach(placeholder => {
        content[placeholder] = formValues[placeholder]?.value || '';
      });
      
      setEditorInitialContent(content);
      setCompletedPhases(['upload', 'provide-data']);
      
      // Si hay campo de búsqueda configurado, preparar búsqueda automática
      const searchValue = searchField && formValues[searchField]?.value;
      if (searchValue) {
        setSearchQuery(searchValue);
      }
      
      // Usar setTimeout para asegurar que React procese los estados anteriores
      // y que el SearchResultsPanel esté montado antes de disparar la búsqueda
      setTimeout(() => {
        setPhase('validate');
        // Disparar búsqueda después de que el componente esté montado
        if (searchValue) {
          setTimeout(() => {
            setSearchTrigger(prev => prev + 1);
          }, 100);
        }
      }, 0);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const content = await generateContentWithBaml(formValues, selectedMedia);
      setEditorInitialContent(content);
      setCompletedPhases(['upload', 'provide-data']);
      
      // Si hay campo de búsqueda configurado, preparar búsqueda automática
      const searchValue = searchField && formValues[searchField]?.value;
      if (searchValue) {
        setSearchQuery(searchValue);
      }
      
      setPhase('validate');
      
      // Disparar búsqueda después de que el componente esté montado
      if (searchValue) {
        setTimeout(() => {
          setSearchTrigger(prev => prev + 1);
        }, 100);
      }
      
      toast({
        title: 'Contenido generado',
        description: 'Revisa y edita el contenido antes de descargar.'
      });
    } catch (error) {
      console.error('Generate error:', error);
      toast({
        title: 'Error',
        description: 'Error al generar el contenido',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler para descargar DOCX
  const handleDownloadDocx = async () => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'No hay documento seleccionado',
        variant: 'destructive'
      });
      return;
    }

    setIsDownloading(true);
    
    try {
      const response = await fetch(selectedFile.url);
      if (!response.ok) throw new Error('Failed to download template');

      const formValues = form.getValues();
      let customFileName = selectedFile.filename.replace(/\.docx$/, '') + '-generado';
      if (selectedNameField && formValues[selectedNameField]?.value) {
        customFileName = formValues[selectedNameField].value;
      }

      const templateFile = new File([await response.blob()], selectedFile.filename, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      const detectFormData = new FormData();
      detectFormData.append('template', templateFile);

      const detectResponse = await fetch('/api/docx/detect-placeholders', {
        method: 'POST',
        body: detectFormData
      });

      if (!detectResponse.ok) throw new Error('Error detectando placeholders');

      const { placeholders: detectedPlaceholders } = await detectResponse.json();

      const generatedFields = detectedPlaceholders.reduce((acc: Record<string, FieldData>, placeholder: string) => {
        // Buscar en segments directamente (confiable, sin parsing frágil)
        const segment = editorSegments.find(s => s.placeholder === placeholder);
        let generatedValue = segment?.markdown?.trim() || '';
        
        // Fallback a contenido inicial si no hay edición
        if (!generatedValue && editorInitialContent[placeholder]) {
          generatedValue = editorInitialContent[placeholder];
        }
        
        // Fallback final
        if (!generatedValue) {
          generatedValue = `Contenido para ${placeholder}`;
        }
        
        acc[placeholder] = {
          originalValue: '',
          generatedValue,
          isPrompt: true
        };
        return acc;
      }, {} as Record<string, FieldData>);

      const convertFormData = new FormData();
      convertFormData.append('template', templateFile);
      convertFormData.append('fields', JSON.stringify(generatedFields));

      const convertResponse = await fetch('/api/docx/convert', {
        method: 'POST',
        body: convertFormData
      });

      if (!convertResponse.ok) throw new Error('Error convirtiendo a DOCX');

      // Verificar si hay imágenes que fallaron
      const failedImagesCount = convertResponse.headers.get('X-Failed-Images-Count');

      const blob = await convertResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${customFileName}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Mostrar toast según si hubo imágenes fallidas o no
      if (failedImagesCount && parseInt(failedImagesCount) > 0) {
        const count = parseInt(failedImagesCount);
        toast({
          title: 'Documento descargado con advertencias',
          description: `"${customFileName}.docx" descargado. ${count} imagen${count > 1 ? 'es no pudieron' : ' no pudo'} ser incluida${count > 1 ? 's' : ''} (servidor no disponible o timeout).`,
          variant: 'default'
        });
      } else {
        toast({
          title: 'Documento descargado',
          description: `"${customFileName}.docx" se ha descargado correctamente.`
        });
      }

      // Limpiar datos persistidos después de descarga exitosa
      clearPersistedData();

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error descargando documento',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handler para generar otro documento
  const handleGenerateAnother = () => {
    clearPersistedData();
    setPhase('provide-data');
    setCompletedPhases(['upload']);
    setEditorInitialContent({});
    setGeneratedMarkdown('');
    setEditorSegments([]);
    form.reset(placeholders.reduce((acc: Record<string, FieldConfig>, field: string) => {
      acc[field] = { value: '', type: 'prompt' };
      return acc;
    }, {}));
    setSelectedNameField(null);
    setSearchField(null);
    setSelectedMedia({ images: [], videos: [] });
    // Limpiar estados de búsqueda para comenzar limpio
    setSearchQuery('');
    setSearchTrigger(0);
    setSearchButtonActive(false);
    setMobileTab('form');
  };

  // Handlers para selección de media (almacenar objeto completo para markdown)
  const handleImageSelect = React.useCallback((image: ImageResult) => {
    setSelectedMedia(prev => {
      const exists = prev.images.some(img => img.img_src === image.img_src);
      const newImages = exists
        ? prev.images.filter(img => img.img_src !== image.img_src)
        : prev.images.length < 5 
          ? [...prev.images, { img_src: image.img_src, title: image.title }]
          : prev.images;
      return { ...prev, images: newImages };
    });
  }, []);

  const handleVideoSelect = React.useCallback((video: VideoResult) => {
    // Usar iframe_src para coincidir con VideoGrid.getVideoId()
    const videoId = video.iframe_src || video.url;
    setSelectedMedia(prev => {
      const exists = prev.videos.some(v => (v.iframe_src || v.url) === videoId);
      const newVideos = exists
        ? prev.videos.filter(v => (v.iframe_src || v.url) !== videoId)
        : prev.videos.length < 5 
          ? [...prev.videos, { 
              img_src: video.img_src, 
              url: video.url, 
              title: video.title, 
              iframe_src: video.iframe_src 
            }]
          : prev.videos;
      return { ...prev, videos: newVideos };
    });
  }, []);

  // Handler para búsqueda desde campo
  const handleFieldSearch = React.useCallback((fieldValue: string) => {
    if (fieldValue.trim()) {
      setSearchQuery(fieldValue.trim());
      setSearchTrigger(prev => prev + 1); // Incrementar contador para disparar búsqueda
      setSearchButtonActive(true); // Activar botón verde
      setMobileTab('search');
    }
  }, []);

  // Extraer tipos de campo del formulario para el dialog (usar watchedValues)
  const watchedValues = form.watch();
  
  const fieldTypes = React.useMemo(() => {
    return placeholders.reduce((acc, field) => {
      acc[field] = watchedValues[field]?.type || 'prompt';
      return acc;
    }, {} as Record<string, 'data' | 'prompt'>);
  }, [placeholders, watchedValues]);

  // Guardar formulario en cada cambio
  React.useEffect(() => {
    if (phase === 'provide-data' && placeholders.length > 0) {
      const timeout = setTimeout(() => {
        saveFormState(watchedValues, selectedNameField, searchField, selectedMedia);
      }, 500); // Debounce de 500ms
      return () => clearTimeout(timeout);
    }
  }, [watchedValues, selectedNameField, searchField, selectedMedia, phase, placeholders, saveFormState]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Generador de Documentos</h1>
              </div>
            </div>
            
            {/* Stepper en el header */}
            <div className="hidden md:block flex-1 max-w-xl">
              <WizardStepper
                currentPhase={phase}
                completedPhases={completedPhases}
                onPhaseClick={goToPhase}
              />
            </div>
            
            {/* Download button en fase validate */}
            {phase === 'validate' && (
              <Button
                onClick={handleDownloadDocx}
                disabled={isDownloading}
                size="lg"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar MS Word
                  </>
                )}
              </Button>
            )}
          </div>
          
          {/* Stepper móvil */}
          <div className="md:hidden mt-4">
            <WizardStepper
              currentPhase={phase}
              completedPhases={completedPhases}
              onPhaseClick={goToPhase}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          
          {/* ============ FASE 1: UPLOAD ============ */}
          {phase === 'upload' && (
            <div className="space-y-8">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Subir Plantilla</CardTitle>
                  <CardDescription>
                    Sube un documento Word (.docx) con campos entre llaves como {'{nombre}'}, {'{fecha}'}, etc. Estos campos serán reemplazados con tu contenido.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UploaderProvider uploadFn={uploadFn}>
                    {({ isUploading, uploadFiles, fileStates }) => (
                      <div className="space-y-4">
                        <FileUploader
                          maxFiles={5}
                          maxSize={1024 * 1024 * 5}
                          accept={{
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                          }}
                        />
                        <Button
                          onClick={() => uploadFiles()}
                          disabled={isUploading || !fileStates.some((file) => file.status === 'PENDING')}
                        >
                          <UploadCloudIcon className="h-4 w-4 mr-2" />
                          {isUploading ? 'Subiendo...' : 'Subir Archivos'}
                        </Button>
                        <CompletedFiles />
                      </div>
                    )}
                  </UploaderProvider>
                </CardContent>
              </Card>

              {/* Stored Files Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Seleccionar Plantilla</CardTitle>
                      <CardDescription>Elige una plantilla para comenzar a generar tu documento.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={fetchStoredFiles} disabled={isLoading}>
                      <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <StoredFilesList
                    files={storedFiles}
                    isLoading={isLoading}
                    onFileSelect={extractDocumentTags}
                    selectedFile={selectedFile}
                    isProcessing={isProcessing}
                  />
                  {processingError && (
                    <p className="text-destructive text-sm mt-2">Ocurrió un error: {processingError}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ============ FASE 2: PROVIDE DATA ============ */}
          {phase === 'provide-data' && selectedFile && documentTags && (
            <div className="space-y-4">
              {/* Header fijo con configuración y generar */}
              <div className="flex items-center justify-between p-4 bg-card border rounded-lg sticky top-[73px] z-10">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedFile.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {placeholders.length} campos detectados • Completa la información de tu documento
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => goToPhase('upload')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Cambiar Plantilla</span>
                  </Button>
                  <FormSettingsDialog
                    placeholders={placeholders}
                    fieldTypes={fieldTypes}
                    onFieldTypeChange={(field, type) => {
                      form.setValue(`${field}.type`, type, { shouldDirty: true });
                    }}
                    selectedNameField={selectedNameField}
                    onNameFieldChange={setSelectedNameField}
                    searchField={searchField}
                    onSearchFieldChange={setSearchField}
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">Generando...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden sm:inline">Generar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Layout responsive: Desktop = side-by-side, Mobile = tabs */}
              {/* Desktop */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-6">
                {/* Formulario (5/12 del espacio ~42%) */}
                <div className="lg:col-span-5">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Datos del Documento</CardTitle>
                      <CardDescription>
                        Completa los campos con la información de tu documento. Usa el botón de ajustes para elegir entre texto fijo o generación con IA.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form className="space-y-4">
                          {placeholders.map((field) => (
                            <FormFieldItem
                              key={field}
                              field={field}
                              form={form}
                              isSearchField={searchField === field}
                              isSearchActive={searchField === field && searchButtonActive}
                              onSearch={handleFieldSearch}
                            />
                          ))}
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>

                {/* Panel de búsquedas (7/12 del espacio ~58%) */}
                <div className="lg:col-span-7">
                  <SearchResultsPanel
                    initialQuery={searchQuery}
                    autoSearch={searchTrigger}
                    showSearchInput={true}
                    selectable={true}
                    selectedImages={new Set(selectedMedia.images.map(img => img.img_src))}
                    selectedVideos={new Set(selectedMedia.videos.map(v => v.iframe_src || v.url))}
                    onImageSelect={handleImageSelect}
                    onVideoSelect={handleVideoSelect}
                    maxImageSelection={5}
                    maxVideoSelection={5}
                    selectedMediaForPreview={selectedMedia}
                    className="h-[calc(100vh-180px)] sticky top-[140px]"
                    onClearSelection={() => setSelectedMedia({ images: [], videos: [] })}
                  />
                </div>
              </div>

              {/* Mobile: Tabs */}
              <div className="lg:hidden">
                <Tabs value={mobileTab} onValueChange={(v) => setMobileTab(v as 'form' | 'search')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="form">Formulario</TabsTrigger>
                    <TabsTrigger value="search">
                      Búsqueda de Media
                      {(selectedMedia.images.length > 0 || selectedMedia.videos.length > 0) && (
                        <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                          {selectedMedia.images.length + selectedMedia.videos.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="form" className="mt-4">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Datos del Documento</CardTitle>
                        <CardDescription>
                          Completa los campos con la información de tu documento.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form className="space-y-4">
                            {placeholders.map((field) => (
                              <FormFieldItem
                                key={field}
                                field={field}
                                form={form}
                                isSearchField={searchField === field}
                                isSearchActive={searchField === field && searchButtonActive}
                                onSearch={handleFieldSearch}
                              />
                            ))}
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="search" className="mt-4">
                    <SearchResultsPanel
                      initialQuery={searchQuery}
                      autoSearch={searchTrigger}
                      showSearchInput={true}
                      selectable={true}
                      selectedImages={new Set(selectedMedia.images.map(img => img.img_src))}
                      selectedVideos={new Set(selectedMedia.videos.map(v => v.iframe_src || v.url))}
                      onImageSelect={handleImageSelect}
                      onVideoSelect={handleVideoSelect}
                      maxImageSelection={5}
                      maxVideoSelection={5}
                      selectedMediaForPreview={selectedMedia}
                      className="h-[calc(100vh-280px)]"
                      onClearSelection={() => setSelectedMedia({ images: [], videos: [] })}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* ============ FASE 3: VALIDATE ============ */}
          {phase === 'validate' && selectedFile && (
            <div className="space-y-4">
              {/* Info del documento */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedFile.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {placeholders.length} secciones • Revisa y edita el contenido generado
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => goToPhase('provide-data')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Formulario
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerateAnother}>
                    Generar Otro
                  </Button>
                </div>
              </div>

              {/* Layout: Editor + Panel de búsqueda */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Editor - 8/12 en desktop */}
                <div className="lg:col-span-8">
                  <Card>
                    <CardContent className="p-0">
                      <SegmentedEditor
                        placeholders={placeholders}
                        initialContent={editorInitialContent}
                        onContentChange={(markdown, segments) => {
                          setGeneratedMarkdown(markdown);
                          setEditorSegments(segments);
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Panel de búsqueda para copiar markdown - 4/12 en desktop */}
                <div className="lg:col-span-4 h-[calc(100vh-16rem)]">
                  <SearchResultsPanel
                    initialQuery={searchQuery}
                    autoSearch={searchTrigger}
                    selectable={false}
                    showSearchInput={true}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AlertDialog de confirmación */}
      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmDialog.onConfirm();
                setConfirmDialog(prev => ({ ...prev, open: false }));
              }}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============ COMPONENTES AUXILIARES ============

// Componente para cada campo del formulario
function FormFieldItem({ 
  field, 
  form, 
  isSearchField,
  isSearchActive = false,
  onSearch 
}: { 
  field: string; 
  form: ReturnType<typeof useForm<Record<string, FieldConfig>>>; 
  isSearchField: boolean;
  isSearchActive?: boolean;
  onSearch: (value: string) => void;
}) {
  const fieldType = form.watch(`${field}.type`);
  const fieldValue = form.watch(`${field}.value`) ?? '';

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-sm font-semibold">{field}</FormLabel>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          fieldType === 'prompt' 
            ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' 
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        }`}>
          {fieldType === 'prompt' ? 'AI' : 'Data'}
        </span>
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
                  placeholder={fieldType === 'prompt'
                    ? `Instrucciones para generar ${field}...`
                    : `Valor para ${field}...`}
                  className={isSearchField ? 'pr-10' : ''}
                />
                {isSearchField && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                          disabled={!fieldValue.trim()}
                          onClick={() => onSearch(fieldValue)}
                        >
                          <SearchCheck className={`h-4 w-4 ${
                            isSearchActive 
                              ? 'text-green-600 dark:text-green-500' 
                              : fieldValue.trim() 
                                ? 'text-primary' 
                                : 'text-muted-foreground'
                          }`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {fieldValue.trim() 
                          ? `Buscar multimedia para "${fieldValue}"` 
                          : 'Escribe algo para buscar'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function CompletedFiles() {
  const { fileStates } = useUploader();
  const completedFiles = fileStates.filter((fs): fs is CompletedFileState => fs.status === 'COMPLETE');

  if (completedFiles.length === 0) return null;

  return (
    <div className="rounded-md bg-muted p-4">
      <h4 className="mb-2 text-sm font-medium">Archivos subidos</h4>
      {completedFiles.map((res) => (
        <a key={res.url} className="block text-sm text-primary hover:underline" href={res.url} target="_blank" rel="noopener noreferrer">
          {res.file.name}
        </a>
      ))}
    </div>
  );
}

function StoredFilesList({ files, isLoading, onFileSelect, selectedFile, isProcessing }: {
  files: StoredFile[];
  isLoading: boolean;
  onFileSelect: (file: StoredFile) => void;
  selectedFile: StoredFile | null;
  isProcessing: boolean;
}) {
  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando archivos...</p>;
  if (files.length === 0) return <p className="text-muted-foreground text-sm">Aún no hay plantillas subidas.</p>;

  return (
    <div className="space-y-2">
      {files.map((file) => {
        const isSelected = selectedFile?.url === file.url;
        const isCurrentlyProcessing = isSelected && isProcessing;
        
        return (
          <div 
            key={file.url} 
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
            } ${isCurrentlyProcessing ? 'opacity-70' : ''}`}
            onClick={() => !isProcessing && onFileSelect(file)}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{file.filename}</p>
                <p className="text-xs text-muted-foreground">{new Date(file.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
            {isCurrentlyProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <TagIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        );
      })}
    </div>
  );
}