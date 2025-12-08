'use client';

import * as React from 'react';
import { Settings2, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { FieldConfig } from '@/hooks/useWizardPersistence';

interface FormSettingsDialogProps {
  /** Lista de campos/placeholders del documento */
  placeholders: string[];
  /** Configuración actual de cada campo (type: 'data' | 'prompt') */
  fieldTypes: Record<string, 'data' | 'prompt'>;
  /** Callback cuando cambia el tipo de un campo */
  onFieldTypeChange: (field: string, type: 'data' | 'prompt') => void;
  /** Campo seleccionado para usar como nombre de archivo */
  selectedNameField: string | null;
  /** Callback cuando cambia el campo de nombre */
  onNameFieldChange: (field: string | null) => void;
  /** Campo seleccionado para búsquedas manuales */
  searchField: string | null;
  /** Callback cuando cambia el campo de búsqueda */
  onSearchFieldChange: (field: string | null) => void;
  /** Clase CSS adicional */
  className?: string;
}

export function FormSettingsDialog({
  placeholders,
  fieldTypes,
  onFieldTypeChange,
  selectedNameField,
  onNameFieldChange,
  searchField,
  onSearchFieldChange,
  className,
}: FormSettingsDialogProps) {
  const [isFieldTypesOpen, setIsFieldTypesOpen] = React.useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn('gap-2', className)}>
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Configuración</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personalizador del documento a crear</DialogTitle>
          <DialogDescription>
            Configura los tipos de campo, el nombre de archivos y las búsquedas manuales.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sección: Tipos de campo (Collapsible) */}
          <Collapsible
            open={isFieldTypesOpen}
            onOpenChange={setIsFieldTypesOpen}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">Tipos de campo</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Data = valor directo, AI = generado por inteligencia artificial.
                </p>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle tipos de campo</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="space-y-0">
              <div className="rounded-lg border bg-card">
                {placeholders.map((field, index) => (
                  <div
                    key={field}
                    className={cn(
                      'flex items-center justify-between px-4 py-3',
                      index !== placeholders.length - 1 && 'border-b'
                    )}
                  >
                    <Label htmlFor={`field-type-${field}`} className="text-sm font-medium">
                      {field}
                    </Label>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'text-xs transition-colors',
                        fieldTypes[field] === 'data' ? 'text-foreground font-medium' : 'text-muted-foreground'
                      )}>
                        Data
                      </span>
                      <Switch
                        id={`field-type-${field}`}
                        checked={fieldTypes[field] === 'prompt'}
                        onCheckedChange={(checked) => 
                          onFieldTypeChange(field, checked ? 'prompt' : 'data')
                        }
                      />
                      <span className={cn(
                        'text-xs transition-colors',
                        fieldTypes[field] === 'prompt' ? 'text-foreground font-medium' : 'text-muted-foreground'
                      )}>
                        AI
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Sección: Seleccionar campo para nombre de archivos */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="name-field-select" className="text-sm font-semibold">
                Seleccionar campo para usar como nombre de archivos
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                El valor de este campo se usará para nombrar los documentos generados.
              </p>
            </div>
            <Select
              value={selectedNameField ?? 'none'}
              onValueChange={(value) => onNameFieldChange(value === 'none' ? null : value)}
            >
              <SelectTrigger id="name-field-select" className="w-full">
                <SelectValue placeholder="Seleccionar campo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="text-muted-foreground">Ninguno (usar nombre por defecto)</span>
                </SelectItem>
                {placeholders.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Sección: Seleccionar campo para búsquedas manuales */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="search-field-select" className="text-sm font-semibold">
                Seleccionar campo para hacer búsquedas manuales
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Al seleccionar un campo, aparecerá un botón de búsqueda en ese campo para buscar imágenes y videos automáticamente.
              </p>
            </div>
            <Select
              value={searchField ?? 'none'}
              onValueChange={(value) => onSearchFieldChange(value === 'none' ? null : value)}
            >
              <SelectTrigger id="search-field-select" className="w-full">
                <SelectValue placeholder="Seleccionar campo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="text-muted-foreground">Ninguno</span>
                </SelectItem>
                {placeholders.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
