'use client';

import * as React from "react";
import { useForm } from "react-hook-form";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

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

  const onSubmit = async (data: { [key: string]: FieldConfig }) => {
    if (!selectedDocument) return;

    setGenerating(true);
    onGenerateStart?.();
    
    try {
      // Structure data for both direct input and AI prompts
      const structuredData: {
        data: { [key: string]: string };
        prompt: { [key: string]: string };
      } = { data: {}, prompt: {} };
      
      for (const [key, value] of Object.entries(data)) {
        if (value.type === "data") {
          structuredData.data[key] = value.value;
        } else if (value.type === "prompt") {
          structuredData.prompt[key] = value.value;
        }
      }

      // Fetch the original document
      const response = await fetch(selectedDocument.url);
      if (!response.ok) {
        throw new Error('Failed to download the document template');
      }
      
      // Process AI prompts if any using our API endpoint
      const finalData = { ...structuredData.data };
      
      // Only process AI prompts if there are any
      if (Object.keys(structuredData.prompt).length > 0) {
        try {
          // Call our API route instead of direct BAML function
          const apiResponse = await fetch('/api/process-form', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ structuredData }),
          });
          
          if (!apiResponse.ok) {
            throw new Error('API request failed');
          }
          
          const { success, data: aiResponse, error } = await apiResponse.json();
          
          if (!success) {
            throw new Error(error || 'AI generation failed');
          }
          
          // Merge AI-generated content with final data
          Object.keys(structuredData.prompt).forEach(key => {
            if (aiResponse[key]) {
              finalData[key] = aiResponse[key];
            }
          });
        } catch (error) {
          console.error("AI generation failed:", error);
          throw new Error(`AI content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      // Convert response to ArrayBuffer for document processing
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
      doc.render(finalData);
      
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
      const baseFilename = selectedDocument.filename.replace(/\.docx$/, '');
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
      setGenerating(false);
    }
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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base font-semibold">{field}</FormLabel>
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
                            placeholder={form.watch(`${field}.type`) === "prompt" 
                              ? `Enter instructions for generating ${field}` 
                              : `Enter value for ${field}`}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            ref={(el) => (inputRefs.current[field] = el)}
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
      <CardFooter>
        <Button 
          type="submit" 
          form="document-form"
          className="w-full" 
          disabled={generating}
        >
          <FileDown className="h-4 w-4 mr-2" />
          {generating ? "Generating..." : "Generate Document"}
        </Button>
      </CardFooter>
    </Card>
  );
}