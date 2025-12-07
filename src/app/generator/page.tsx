'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/upload/multi-file';
import {
  UploaderProvider,
  useUploader,
  type CompletedFileState,
  type UploadFn,
} from '@/components/upload/uploader-provider';
import { useEdgeStore } from '@/lib/edgestore';
import { RefreshCwIcon, TagIcon, UploadCloudIcon, FileText, ArrowLeft } from 'lucide-react';
import * as React from 'react';
import { toast } from '@/components/ui/use-toast';
import { DocumentForm } from '@/components/DocumentForm';
import Link from 'next/link';

type UploadResult = {
  url: string;
  filename: string;
};

type StoredFile = {
  url: string;
  filename: string;
  uploadedAt: string;
};

export default function GeneratorPage() {
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
    generatedAt: string;
  }>>([]);
  const { edgestore } = useEdgeStore();

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

  const extractDocumentTags = React.useCallback(async (file: StoredFile) => {
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
      
      const { placeholders } = await response.json();
      const tags: Record<string, any> = {};
      placeholders.forEach((placeholder: string) => {
        tags[placeholder] = true;
      });
      setDocumentTags(tags);
    } catch (error) {
      console.error('Error processing document:', error);
      setProcessingError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Document Generator</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>1. Upload Template</CardTitle>
              <CardDescription>
                Upload a Word document (.docx) with placeholders.
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
                      {isUploading ? 'Uploading...' : 'Upload Files'}
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
                  <CardTitle>2. Select Template</CardTitle>
                  <CardDescription>Choose a template to extract placeholders.</CardDescription>
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
              />
            </CardContent>
          </Card>

          {/* Placeholders Display */}
          {selectedFile && (
            <Card>
              <CardHeader>
                <CardTitle>3. Detected Placeholders</CardTitle>
                <CardDescription>Found in "{selectedFile.filename}"</CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentTagsDisplay 
                  tags={documentTags} 
                  isProcessing={isProcessing}
                  error={processingError}
                />
              </CardContent>
            </Card>
          )}
          
          {/* Document Form */}
          {selectedFile && documentTags && Object.keys(documentTags).length > 0 && (
            <DocumentForm 
              selectedDocument={selectedFile}
              documentTags={documentTags}
              onGenerateStart={() => toast({ title: "Generating document..." })}
              onGenerateComplete={(url, filename) => {
                toast({ title: "Document generated!", description: `Downloaded: ${filename}` });
                setGeneratedDocs(prev => [...prev, { url, filename, generatedAt: new Date().toISOString() }]);
              }}
              onGenerateError={(error) => toast({ title: "Error", description: error, variant: "destructive" })}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function CompletedFiles() {
  const { fileStates } = useUploader();
  const completedFiles = fileStates.filter((fs): fs is CompletedFileState => fs.status === 'COMPLETE');

  if (completedFiles.length === 0) return null;

  return (
    <div className="rounded-md bg-muted p-4">
      <h4 className="mb-2 text-sm font-medium">Just Uploaded</h4>
      {completedFiles.map((res) => (
        <a key={res.url} className="block text-sm text-primary hover:underline" href={res.url} target="_blank" rel="noopener noreferrer">
          {res.file.name}
        </a>
      ))}
    </div>
  );
}

function StoredFilesList({ files, isLoading, onFileSelect, selectedFile }: {
  files: StoredFile[];
  isLoading: boolean;
  onFileSelect: (file: StoredFile) => void;
  selectedFile: StoredFile | null;
}) {
  if (isLoading) return <p className="text-muted-foreground text-sm">Loading files...</p>;
  if (files.length === 0) return <p className="text-muted-foreground text-sm">No templates uploaded yet.</p>;

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div 
          key={file.url} 
          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${
            selectedFile?.url === file.url ? 'bg-primary/10 border-primary' : ''
          }`}
          onClick={() => onFileSelect(file)}
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{file.filename}</p>
              <p className="text-xs text-muted-foreground">{new Date(file.uploadedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <TagIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      ))}
    </div>
  );
}

function DocumentTagsDisplay({ tags, isProcessing, error }: {
  tags: Record<string, any> | null;
  isProcessing: boolean;
  error: string | null;
}) {
  if (isProcessing) return <p className="text-muted-foreground text-sm">Analyzing document...</p>;
  if (error) return <p className="text-destructive text-sm">Error: {error}</p>;
  if (!tags) return <p className="text-muted-foreground text-sm">Select a template to detect placeholders.</p>;
  if (Object.keys(tags).length === 0) return <p className="text-muted-foreground text-sm">No placeholders found.</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(tags).map((tag) => (
        <span key={tag} className="px-3 py-1 rounded-full text-sm font-mono bg-primary/10 text-primary">
          {`{${tag}}`}
        </span>
      ))}
    </div>
  );
}