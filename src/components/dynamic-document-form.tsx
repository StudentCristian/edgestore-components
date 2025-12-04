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
import { zodResolver } from '@hookform/resolvers/zod';
import { FileTextIcon } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

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
  
  // Create the schema conditionally but don't use it in a hook yet
  const formSchema = React.useMemo(() => {
    if (!tags) return z.object({});
    
    return z.object(
      Object.keys(tags).reduce((acc, tag) => {
        acc[tag] = z.string().min(1, `${tag} is required`);
        return acc;
      }, {} as Record<string, z.ZodString>)
    );
  }, [tags]);
  
  // Similarly for default values
  const defaultValues = React.useMemo(() => {
    if (!tags) return {};
    
    return Object.keys(tags).reduce((acc, tag) => {
      acc[tag] = '';
      return acc;
    }, {} as Record<string, string>);
  }, [tags]);
  
  // Always call useForm regardless of conditions
  const form = useForm({
    resolver: tags ? zodResolver(formSchema) : undefined,
    defaultValues,
  });
  
  // ✅ Move the useEffect here - before any early returns
  React.useEffect(() => {
    if (tags) {
      form.reset(defaultValues);
    }
  }, [tags, form, defaultValues]);
  
  // Early return after all hooks have been called
  if (!tags || !selectedFile || Object.keys(tags).length === 0) {
    return null;
  }
  
  // Type definition after the early returns
  type FormValues = z.infer<typeof formSchema>;
  
  async function onSubmit(values: any) {
    setIsGenerating(true);
    onGenerateStart?.();
    
    try {
      // Fetch the original document
      const response = await fetch(selectedFile.url);
      if (!response.ok) {
        throw new Error('Failed to download the document template');
      }
      
      // Convert response to ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      const content = new Uint8Array(arrayBuffer);
      
      // Use PizZip to unzip the document
      const zip = new PizZip(content);
      
      // Create Docxtemplater instance
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      
      // Render document with form values
      doc.render(values);
      
      // Generate output buffer
      const buf = doc.getZip().generate({
        type: 'arraybuffer',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      
      // Create downloadable blob
      const blob = new Blob([buf], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      // Create download URL
      const url = window.URL.createObjectURL(blob);
      
      // Generate new filename
      const baseFilename = selectedFile.filename.replace(/\.docx$/, '');
      const newFilename = `${baseFilename}-filled.docx`;
      
      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', newFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up URL
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
      // Notify completion
      onGenerateComplete?.(url, newFilename);
    } catch (error) {
      console.error('Error generating document:', error);
      onGenerateError?.(error instanceof Error ? error.message : 'Unknown error generating document');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mt-8 w-full">
      <h3 className="mb-4 text-lg font-semibold">Generate Document</h3>
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
                          placeholder={`Enter ${tag}`} 
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
            
            <Button 
              type="submit" 
              className="mt-4 flex items-center gap-2"
              disabled={isGenerating}
            >
              <FileTextIcon className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Document'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}