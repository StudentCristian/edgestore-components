'use client';

import * as React from 'react';

// Tipos para el estado del wizard
export type WizardPhase = 'upload' | 'provide-data' | 'validate';

export interface FieldConfig {
  value: string;
  type: 'data' | 'prompt';
}

export interface StoredFile {
  url: string;
  filename: string;
  uploadedAt: string;
}

// Item de media seleccionada con toda la información necesaria para markdown
export interface SelectedImageItem {
  img_src: string;   // URL directa de la imagen
  title: string;     // Título/alt text
}

export interface SelectedVideoItem {
  img_src: string;     // Thumbnail URL
  url: string;         // URL de la página del video (YouTube watch URL)
  title: string;       // Título del video
  iframe_src: string;  // URL del iframe (usado como ID)
}

// Media seleccionada para pasar a BAML como contexto
export interface SelectedMedia {
  images: SelectedImageItem[]; // Objetos de imágenes seleccionadas
  videos: SelectedVideoItem[]; // Objetos de videos seleccionados
}

export interface WizardPersistedData {
  // Datos del archivo seleccionado
  selectedFile: StoredFile | null;
  documentTags: Record<string, any> | null;
  // Datos del formulario
  formValues: Record<string, FieldConfig>;
  selectedNameField: string | null;
  // Campo para búsquedas manuales
  searchField: string | null;
  // Media seleccionada para contexto BAML
  selectedMedia: SelectedMedia;
  // Timestamp para debugging
  savedAt: string;
}

const STORAGE_KEY = 'document-generator-wizard';

const defaultSelectedMedia: SelectedMedia = {
  images: [],
  videos: [],
};

const defaultPersistedData: WizardPersistedData = {
  selectedFile: null,
  documentTags: null,
  formValues: {},
  selectedNameField: null,
  searchField: null,
  selectedMedia: defaultSelectedMedia,
  savedAt: '',
};

export function useWizardPersistence() {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [persistedData, setPersistedData] = React.useState<WizardPersistedData>(defaultPersistedData);

  // Cargar datos del localStorage al montar (solo cliente)
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WizardPersistedData;
        setPersistedData(parsed);
      }
    } catch (error) {
      console.error('Error loading wizard data from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Función para guardar datos
  const saveData = React.useCallback((data: Partial<WizardPersistedData>) => {
    setPersistedData((prev) => {
      const newData = {
        ...prev,
        ...data,
        savedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      } catch (error) {
        console.error('Error saving wizard data to localStorage:', error);
      }
      return newData;
    });
  }, []);

  // Guardar archivo seleccionado y tags
  const saveFileSelection = React.useCallback((
    selectedFile: StoredFile | null,
    documentTags: Record<string, any> | null
  ) => {
    saveData({ selectedFile, documentTags });
  }, [saveData]);

  // Guardar valores del formulario
  const saveFormValues = React.useCallback((formValues: Record<string, FieldConfig>) => {
    saveData({ formValues });
  }, [saveData]);

  // Guardar campo de nombre seleccionado
  const saveSelectedNameField = React.useCallback((selectedNameField: string | null) => {
    saveData({ selectedNameField });
  }, [saveData]);

  // Guardar todo el estado del formulario de una vez (incluyendo searchField y selectedMedia)
  const saveFormState = React.useCallback((
    formValues: Record<string, FieldConfig>,
    selectedNameField: string | null,
    searchField?: string | null,
    selectedMedia?: SelectedMedia
  ) => {
    const updateData: Partial<WizardPersistedData> = { formValues, selectedNameField };
    if (searchField !== undefined) {
      updateData.searchField = searchField;
    }
    if (selectedMedia !== undefined) {
      updateData.selectedMedia = selectedMedia;
    }
    saveData(updateData);
  }, [saveData]);

  // Guardar campo de búsqueda seleccionado
  const saveSearchField = React.useCallback((searchField: string | null) => {
    saveData({ searchField });
  }, [saveData]);

  // Guardar media seleccionada
  const saveSelectedMedia = React.useCallback((selectedMedia: SelectedMedia) => {
    saveData({ selectedMedia });
  }, [saveData]);

  // Limpiar todos los datos persistidos
  const clearPersistedData = React.useCallback(() => {
    setPersistedData(defaultPersistedData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing wizard data from localStorage:', error);
    }
  }, []);

  // Limpiar solo datos del formulario (mantiene archivo y tags)
  const clearFormData = React.useCallback(() => {
    saveData({
      formValues: {},
      selectedNameField: null,
      searchField: null,
      selectedMedia: defaultSelectedMedia,
    });
  }, [saveData]);

  // Verificar si hay datos persistidos
  const hasPersistedData = React.useMemo(() => {
    return !!(
      persistedData.selectedFile ||
      persistedData.documentTags ||
      Object.keys(persistedData.formValues).length > 0 ||
      persistedData.selectedNameField
    );
  }, [persistedData]);

  // Verificar si hay datos de formulario
  const hasFormData = React.useMemo(() => {
    return Object.keys(persistedData.formValues).length > 0 || 
           persistedData.selectedNameField !== null ||
           persistedData.searchField !== null ||
           persistedData.selectedMedia.images.length > 0 ||
           persistedData.selectedMedia.videos.length > 0;
  }, [persistedData]);

  return {
    // Estado
    isHydrated,
    persistedData,
    hasPersistedData,
    hasFormData,
    
    // Acciones de guardado
    saveData,
    saveFileSelection,
    saveFormValues,
    saveSelectedNameField,
    saveSearchField,
    saveSelectedMedia,
    saveFormState,
    
    // Acciones de limpieza
    clearPersistedData,
    clearFormData,
  };
}
