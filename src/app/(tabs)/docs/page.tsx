'use client';

import { Button } from '@/components/ui/button';
import { ExampleFrame } from '@/components/ui/example-frame';
import { FileUploader } from '@/components/upload/multi-file';
import {
  UploaderProvider,
  useUploader,
  type CompletedFileState,
  type UploadFn,
} from '@/components/upload/uploader-provider';
import { useEdgeStore } from '@/lib/edgestore';
import { RefreshCwIcon, TagIcon, UploadCloudIcon } from 'lucide-react';
import * as React from 'react';
import { toast } from '@/components/ui/use-toast';
import { DocumentForm } from '@/components/DocumentForm';

export default function DocsPage() {
  return (
    <ExampleFrame details={<DocsDetails />} centered>
      <DocsExample />
    </ExampleFrame>
  );
}

type UploadResult = {
  url: string;
  filename: string;
};

type StoredFile = {
  url: string;
  filename: string;
  uploadedAt: string; // ISO string para ser JSON serializable
};

function DocsExample() {
  const [uploadRes, setUploadRes] = React.useState<UploadResult[]>([]);
  const [storedFiles, setStoredFiles] = React.useState<StoredFile[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<StoredFile | null>(null);
  const [documentTags, setDocumentTags] = React.useState<Record<string, any> | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingError, setProcessingError] = React.useState<string | null>(null);
  const [generatedDocs, setGeneratedDocs] = React.useState<Array<{
    url: string;
    filename: string;
    generatedAt: string; // ISO string para ser JSON serializable
  }>>([]);
  const { edgestore } = useEdgeStore();

  // Function to load stored files
  const fetchStoredFiles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/files');

      if (!response.ok) {
        throw new Error('Error al obtener archivos');
      }

      const data = await response.json();
      setStoredFiles(data.files);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load files when component mounts
  React.useEffect(() => {
    fetchStoredFiles();
  }, [fetchStoredFiles]);

  const uploadFn: UploadFn = React.useCallback(
    async ({ file, signal, onProgressChange }) => {
      const res = await edgestore.myPublicFiles.upload({
        file,
        signal,
        onProgressChange,
      });

      setUploadRes((prev) => [
        ...prev,
        {
          url: res.url,
          filename: file.name,
        },
      ]);
      return { url: res.url };
    },
    [edgestore],
  );

  // Function to extract tags from a selected document using API
  const extractDocumentTags = React.useCallback(async (file: StoredFile) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setProcessingError(null);
    setDocumentTags(null);
    
    try {
      // Only process .docx files
      if (!file.filename.toLowerCase().endsWith('.docx')) {
        throw new Error('Solo se permiten documentos Word (.docx)');
      }
      
      // Fetch the document content
      const fileResponse = await fetch(file.url);
      if (!fileResponse.ok) {
        throw new Error('Error al descargar el documento');
      }
      
      // Get the file as blob and create FormData
      const blob = await fileResponse.blob();
      const formData = new FormData();
      formData.append('template', blob, file.filename);
      
      // Call the API to detect placeholders
      const response = await fetch('/api/docx/detect-placeholders', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al detectar campos');
      }
      
      const { placeholders } = await response.json();
      
      // Convert placeholders array to tags object format
      const tags: Record<string, any> = {};
      placeholders.forEach((placeholder: string) => {
        tags[placeholder] = true;
      });
      
      setDocumentTags(tags);
    } catch (error) {
      console.error('Error processing document:', error);
      setProcessingError(error instanceof Error ? error.message : 'Error desconocido al procesar documento');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <UploaderProvider uploadFn={uploadFn}>
        {({ isUploading, uploadFiles, fileStates, resetFiles }) => (
          <div className="w-full space-y-4">
            <FileUploader
              maxFiles={5}
              maxSize={1024 * 1024 * 5} // 5 MB
              accept={{
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
              }}
            />
            <Button
              onClick={() => uploadFiles()}
              className="flex items-center gap-2 pl-3"
              disabled={
                isUploading ||
                !fileStates.some((file) => file.status === 'PENDING')
              }
            >
              <UploadCloudIcon className="h-4 w-4" />
              <span>{isUploading ? 'Subiendo...' : 'Subir Archivos'}</span>
            </Button>

            <CompletedFiles />

            {/* Component to display stored files with selection */}
            <StoredFilesWithSelection
              files={storedFiles}
              isLoading={isLoading}
              onRefresh={fetchStoredFiles}
              onFileSelect={extractDocumentTags}
              selectedFile={selectedFile}
            />
            
            {/* Document tags display */}
            <DocumentTagsDisplay 
              tags={documentTags} 
              isProcessing={isProcessing}
              error={processingError}
              selectedFile={selectedFile}
            />
            
            {/* Document form */}
            {selectedFile && documentTags && (
              <DocumentForm 
                selectedDocument={selectedFile}
                documentTags={documentTags}
                onGenerateStart={() => {
                  toast({
                    title: "Generando documento...",
                    description: "Por favor espera mientras se genera tu documento."
                  });
                }}
                onGenerateComplete={(url, filename) => {
                  toast({
                    title: "¡Documento generado!",
                    description: `Tu documento '${filename}' se ha descargado.`,
                    variant: "success"
                  });
                  setGeneratedDocs(prev => [
                    ...prev,
                    { url, filename, generatedAt: new Date().toISOString() }
                  ]);
                }}
                onGenerateError={(error) => {
                  toast({
                    title: "Error al generar documento",
                    description: error,
                    variant: "destructive"
                  });
                }}
              />
            )}
          </div>
        )}
      </UploaderProvider>
    </div>
  );
}

function CompletedFiles() {
  const { fileStates } = useUploader();

  const completedFiles = fileStates.filter(
    (fs): fs is CompletedFileState => fs.status === 'COMPLETE',
  );

  if (completedFiles.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 w-full">
      <h3 className="mb-2 text-lg font-semibold">Archivos Subidos</h3>
      <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
        {completedFiles.map((res) => (
          <a
            key={res.url}
            className="mb-1 block underline"
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {res.file.name}
          </a>
        ))}
      </div>
    </div>
  );
}

// Component to display stored files with selection capability
function StoredFilesWithSelection({
  files,
  isLoading,
  onRefresh,
  onFileSelect,
  selectedFile,
}: {
  files: StoredFile[];
  isLoading: boolean;
  onRefresh: () => void;
  onFileSelect: (file: StoredFile) => void;
  selectedFile: StoredFile | null;
}) {
  if (isLoading) {
    return (
      <div className="mt-8 w-full">
        <div className="flex items-center justify-between">
          <h3 className="mb-2 text-lg font-semibold">Archivos Guardados</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
          <p className="text-muted-foreground">Cargando archivos...</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="mt-8 w-full">
        <div className="flex items-center justify-between">
          <h3 className="mb-2 text-lg font-semibold">Archivos Guardados</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
          <p className="text-muted-foreground">No hay archivos guardados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full">
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-lg font-semibold">Archivos Guardados</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCwIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
        {files.map((file) => (
          <div 
            key={file.url} 
            className={`mb-2 flex justify-between border-b pb-2 last:border-0 last:pb-0 ${
              selectedFile?.url === file.url ? 'bg-blue-50 dark:bg-blue-900/20 rounded px-2' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFileSelect(file)}
                className="p-1"
                title="Extraer Campos"
              >
                <TagIcon className="h-4 w-4" />
              </Button>
              <a
                className="block underline"
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.filename}
              </a>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(file.uploadedAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component to display extracted document tags
function DocumentTagsDisplay({
  tags,
  isProcessing,
  error,
  selectedFile,
}: {
  tags: Record<string, any> | null;
  isProcessing: boolean;
  error: string | null;
  selectedFile: StoredFile | null;
}) {
  if (!selectedFile) {
    return null;
  }

  return (
    <div className="mt-8 w-full">
      <h3 className="mb-2 text-lg font-semibold">Campos del Documento</h3>
      <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
        {isProcessing && (
          <p className="text-muted-foreground">Procesando documento...</p>
        )}
        
        {error && (
          <div className="text-red-500">
            <p>Error: {error}</p>
          </div>
        )}
        
        {tags && Object.keys(tags).length === 0 && !isProcessing && !error && (
          <p className="text-muted-foreground">No se encontraron campos en el documento.</p>
        )}
        
        {tags && Object.keys(tags).length > 0 && (
          <div>
            <h4 className="mb-2 font-medium">Campos encontrados en {selectedFile.filename}:</h4>
            <ul className="list-disc pl-5">
              {Object.keys(tags).map((tag) => (
                <li key={tag} className="mb-1">
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function DocsDetails() {
  return (
    <div className="flex flex-col">
      <h3 className="mt-4 text-base font-bold">Sistema de Generación de Documentos</h3>
      <ul className="text-sm text-foreground/80">
        <li>
          <a
            href="https://github.com/open-xml-templating/docxtemplater"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Documentación de Docxtemplater
          </a>
        </li>
      </ul>
      <h3 className="mt-4 text-base font-bold">Acerca de</h3>
      <div className="flex flex-col gap-2 text-sm text-foreground/80">
        <p>
          Este sistema permite subir plantillas .docx, extraer los campos, y completarlos
          con tus datos para generar documentos personalizados.
        </p>
        <p>
          Sube una plantilla, selecciónala de la lista de archivos guardados, y completa el formulario
          para reemplazar todos los campos con tu contenido.
        </p>
        <p>
          Puedes alternar entre ingresar datos directamente o usar contenido generado por IA para cada campo.
        </p>
      </div>
    </div>
  );
}