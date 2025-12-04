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
import { RefreshCwIcon, UploadCloudIcon } from 'lucide-react';
import * as React from 'react';

export default function Page() {
  return (
    <ExampleFrame details={<MultiFileDetails />} centered>
      <MultiFileExample />
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

function MultiFileExample() {
  const [uploadRes, setUploadRes] = React.useState<UploadResult[]>([]);
  const [storedFiles, setStoredFiles] = React.useState<StoredFile[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { edgestore } = useEdgeStore();

  // Función para cargar archivos existentes
  const fetchStoredFiles = React.useCallback(async () => {
    try {
      setIsLoading(true);

      // Implementar la llamada a una API para obtener la lista de archivos
      // Esta API debe implementarse en el backend
      const response = await fetch('/api/files');

      if (!response.ok) {
        throw new Error('Error al obtener los archivos');
      }

      const data = await response.json();
      setStoredFiles(data.files);
    } catch (error) {
      console.error('Error al cargar los archivos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar archivos al montar el componente
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

  return (
    <div className="flex flex-col items-center">
      <UploaderProvider uploadFn={uploadFn}>
        {({ isUploading, uploadFiles, fileStates, resetFiles }) => (
          <div className="w-full space-y-4">
            <FileUploader
              maxFiles={5}
              maxSize={1024 * 1024 * 1} // 1 MB
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

            {/* Componente para mostrar archivos almacenados */}
            <StoredFilesList
              files={storedFiles}
              isLoading={isLoading}
              onRefresh={fetchStoredFiles}
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

function MultiFileDetails() {
  return (
    <div className="flex flex-col">
      <h3 className="mt-4 text-base font-bold">See in GitHub</h3>
      <ul className="text-sm text-foreground/80">
        <li>
          <a
            href="https://github.com/edgestorejs/edgestore/blob/main/examples/components/src/app/(tabs)/multi-file/page.tsx"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Usage
          </a>
        </li>
        <li>
          <a
            href="https://github.com/edgestorejs/edgestore/blob/main/examples/components/src/components/upload/multi-file.tsx"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Component
          </a>
        </li>
      </ul>
      <h3 className="mt-4 text-base font-bold">About</h3>
      <div className="flex flex-col gap-2 text-sm text-foreground/80">
        <p>
          This component is a dropzone to upload multiple files. It is
          configured with a max file size of 1 MB and a max number of files of
          5.
        </p>
        <p>
          Here, the EdgeStoreProvider is configured for a maximum of 2 parallel
          uploads. This means that if you upload 5 files, only 2 will be
          uploaded at a time. The other 3 will be queued and uploaded in order
          as soon as one of the first 2 uploads finishes.
        </p>
        <p>
          Additionally, a custom trigger for the upload process and a custom
          clear button are implemented using the provider methods. This allows
          for more control over the upload and reset actions directly from the
          UI.
        </p>
        <p>
          p.s. The default value for maxParallelUploads is 5. Here we are
          setting it to 2 just to make it easier to see the queue in action.
        </p>
      </div>
    </div>
  );
}

// Nuevo componente para mostrar archivos almacenados
function StoredFilesList({
  files,
  isLoading,
  onRefresh,
}: {
  files: StoredFile[];
  isLoading: boolean;
  onRefresh: () => void;
}) {
  if (isLoading) {
    return (
      <div className="mt-8 w-full">
        <div className="flex items-center justify-between">
          <h3 className="mb-2 text-lg font-semibold">Archivos Almacenados</h3>
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
          <h3 className="mb-2 text-lg font-semibold">Archivos Almacenados</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
          <p className="text-muted-foreground">No hay archivos almacenados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full">
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-lg font-semibold">Archivos Almacenados</h3>
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
          <div key={file.url} className="mb-2 flex justify-between border-b pb-2 last:border-0 last:pb-0">
            <a
              className="block underline"
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.filename}
            </a>
            <span className="text-xs text-muted-foreground">
              {new Date(file.uploadedAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
