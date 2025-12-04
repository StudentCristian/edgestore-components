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

// For docxtemplater functionality
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import InspectModule from 'docxtemplater/js/inspect-module';
import { DynamicDocumentForm } from '../../../components/dynamic-document-form';

export default function Page() {
  return (
    <ExampleFrame details={<TagsDetails />} centered>
      <TagsExample />
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
  uploadedAt: Date;
};

function TagsExample() {
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
    generatedAt: Date;
  }>>([]);
  const { edgestore } = useEdgeStore();

  // Function to load stored files
  const fetchStoredFiles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/files');

      if (!response.ok) {
        throw new Error('Error fetching files');
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

  // Function to extract tags from a selected document
  const extractDocumentTags = React.useCallback(async (file: StoredFile) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setProcessingError(null);
    setDocumentTags(null);
    
    try {
      // Only process .docx files
      if (!file.filename.toLowerCase().endsWith('.docx')) {
        throw new Error('Only Word (.docx) documents are supported');
      }
      
      // Fetch the document content
      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error('Failed to download the document');
      }
      
      // Convert response to ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength === 0) {
        throw new Error('Downloaded file is empty');
      }
      const content = new Uint8Array(arrayBuffer);
      
      // Use PizZip to unzip the document
      const zip = new PizZip(content);
      
      // Create InspectModule to extract tags - use 'new' keyword here
      const iModule = new InspectModule();
      
      // Create docxtemplater with the inspect module
      const doc = new Docxtemplater(zip, {
        modules: [iModule],
        linebreaks: true,
        paragraphLoop: true,
      });
      
      // Render document to prepare for tag extraction
      doc.render();
      
      // Get all tags
      const tags = iModule.getAllTags();
      setDocumentTags(tags);
    } catch (error) {
      console.error('Full error details:', error);
      if (error instanceof Error && 'properties' in error) {
        console.error('Sub-errors:', (error as any).properties?.errors);
      }
      setProcessingError(error instanceof Error ? error.message : 'Unknown error processing document');
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
              <span>{isUploading ? 'Uploading...' : 'Upload Files'}</span>
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
            
            {/* Dynamic form for document generation */}
            <DynamicDocumentForm
              tags={documentTags}
              selectedFile={selectedFile}
              onGenerateStart={() => {
                toast({
                  title: "Generating document...",
                  description: "Please wait while your document is being generated."
                });
              }}
              onGenerateComplete={(url, filename) => {
                toast({
                  title: "Document generated successfully!",
                  description: `Your document '${filename}' has been downloaded.`,
                  variant: "success"
                });
                setGeneratedDocs(prev => [
                  ...prev,
                  { url, filename, generatedAt: new Date() }
                ]);
              }}
              onGenerateError={(error) => {
                toast({
                  title: "Error generating document",
                  description: error,
                  variant: "destructive"
                });
              }}
            />
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
      <h3 className="mb-2 text-lg font-semibold">Uploaded Files</h3>
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
          <h3 className="mb-2 text-lg font-semibold">Stored Files</h3>
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
          <p className="text-muted-foreground">Loading files...</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="mt-8 w-full">
        <div className="flex items-center justify-between">
          <h3 className="mb-2 text-lg font-semibold">Stored Files</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
          <p className="text-muted-foreground">No stored files</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full">
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-lg font-semibold">Stored Files</h3>
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
                title="Extract Tags"
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
      <h3 className="mb-2 text-lg font-semibold">Document Tags</h3>
      <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
        {isProcessing && (
          <p className="text-muted-foreground">Processing document...</p>
        )}
        
        {error && (
          <div className="text-red-500">
            <p>Error: {error}</p>
          </div>
        )}
        
        {tags && Object.keys(tags).length === 0 && !isProcessing && !error && (
          <p className="text-muted-foreground">No tags found in document.</p>
        )}
        
        {tags && Object.keys(tags).length > 0 && (
          <div>
            <h4 className="mb-2 font-medium">Placeholders found in {selectedFile.filename}:</h4>
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

function TagsDetails() {
  return (
    <div className="flex flex-col">
      <h3 className="mt-4 text-base font-bold">Document Tag Extractor</h3>
      <ul className="text-sm text-foreground/80">
        <li>
          <a
            href="https://github.com/open-xml-templating/docxtemplater"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Docxtemplater Documentation
          </a>
        </li>
      </ul>
      <h3 className="mt-4 text-base font-bold">About</h3>
      <div className="flex flex-col gap-2 text-sm text-foreground/80">
        <p>
          This component allows you to upload .docx files and extract placeholder tags from them.
          You can upload up to 5 files with a maximum size of 5 MB each.
        </p>
        <p>
          After uploading files, click the tag icon next to a file in the "Stored Files" list
          to extract and display all placeholders (template variables) from the document.
        </p>
        <p>
          This is useful when working with document templates to identify all variables
          that need to be replaced before generating the final document.
        </p>
      </div>
    </div>
  );
}