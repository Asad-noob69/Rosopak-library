"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ComponentService } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import * as Babel from '@babel/standalone';
import Image from 'next/image'; // Import Next.js Image component

// Component Preview Page
export default function PreviewPage() {
  const params = useParams();
  const id = params?.id as string;
  
  // State for the current component
  const [component, setComponent] = useState<any>(null);
  // State to track loading state
  const [isLoading, setIsLoading] = useState(true);
  // State to track error state
  const [error, setError] = useState<string | null>(null);
  // State for preview error
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  // Load component data when the component mounts
  useEffect(() => {
    async function fetchComponent() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch component from API
        const componentData = await ComponentService.getComponentById(id);
        setComponent(componentData);
      } catch (err) {
        console.error('Failed to fetch component:', err);
        setError('Failed to load component. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      fetchComponent();
    }
  }, [id]);

  // Render preview with error handling
  const ComponentPreview = ({ code }: { code: string }) => {
    const [previewComponent, setPreviewComponent] = useState<React.ReactNode | null>(null);
    
    useEffect(() => {
      try {
        // Pre-process the code to handle imports and exports
        let processedCode = code;
        
        // Replace import statements with mockable variables
        processedCode = processedCode.replace(
          /import\s+(\w+|\{\s*\w+(\s+as\s+\w+)?\s*(,\s*\w+(\s+as\s+\w+)?\s*)*\})\s+from\s+["']([^"']+)["'];?/g, 
          (match, importName, _, __, ___, importPath) => {
            if (importPath === 'next/image') {
              return '// Image import handled';
            }
            return `// Import replaced: ${importPath}`;
          }
        );
        
        // Handle export statements by removing the 'export' keyword
        processedCode = processedCode.replace(
          /export\s+(default\s+)?(function|class|const|let|var)\s+(\w+)/g,
          (match, defaultExport, declarationType, name) => {
            return `${declarationType} ${name}`;
          }
        );
        
        // Handle default export assignment (export default Component)
        processedCode = processedCode.replace(
          /export\s+default\s+(\w+)\s*;?/g,
          (match, name) => {
            return `// Default export: ${name}`;
          }
        );
        
        // Transform JSX to regular JavaScript using Babel
        const transformedCode = Babel.transform(processedCode, {
          presets: ['react'],
          filename: 'component.jsx',
        }).code;
        
        if (!transformedCode) {
          throw new Error('Failed to transform JSX code');
        }
        
        // Create safe wrapper for evaluation
        const wrapCode = (transformedCode: string) => {
          return `
            const {useState, useEffect, useRef, createElement, Fragment} = React;
            
            // Provide Next.js components
            const Image = NextImage;
            
            try {
              // Execute the transformed code
              ${transformedCode}
              
              // Check for exported components
              function PreviewComponent() {
                // Try to find any component in order of priority
                if (typeof Component !== 'undefined') {
                  return createElement(Component, {});
                } 
                else if (typeof Footer !== 'undefined') {
                  return createElement(Footer, {});
                }
                else if (typeof Header !== 'undefined') {
                  return createElement(Header, {});
                }
                else if (typeof Layout !== 'undefined') {
                  return createElement(Layout, {});
                }
                else if (typeof Card !== 'undefined') {
                  return createElement(Card, {});
                }
                else if (typeof Button !== 'undefined') {
                  return createElement(Button, {});
                }
                else {
                  // Try to find any function that starts with uppercase (React component convention)
                  for (const key in this) {
                    if (typeof this[key] === 'function' && /^[A-Z]/.test(key)) {
                      return createElement(this[key], {});
                    }
                  }
                  return createElement('div', {}, 'No component found to render');
                }
              }
              
              return createElement('div', { className: "preview-container" }, createElement(PreviewComponent, {}));
            } catch (err) {
              throw new Error('Error in component code: ' + err.message);
            }
          `;
        };
        
        // Use Function constructor as a sandbox (with limitations)
        const ReactComponent = new Function('React', 'NextImage', wrapCode(transformedCode));
        
        // Set the component to state with provided Next.js components
        setPreviewComponent(ReactComponent(React, Image));
        setPreviewError(null);
      } catch (err) {
        console.error('Preview error:', err);
        // More detailed error message
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setPreviewError(`Failed to render preview: ${errorMessage}`);
      }
    }, [code]);
    
    return (
      <div className="bg-white p-4 rounded-md">
        {previewError ? (
          <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">{previewError}</div>
        ) : (
          <div className="preview-render">
            {previewComponent}
          </div>
        )}
      </div>
    );
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex h-full items-center justify-center">
          <p>Loading component preview...</p>
        </div>
      </div>
    );
  }

  // If error or component not found
  if (error || !component) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex h-full items-center justify-center flex-col gap-4">
          <p>{error || 'Component not found'}</p>
          <Link 
            href="/library"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> 
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  // Get back link based on component type
  const getBackLink = () => {
    return `/library/${component.type}/${id}`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Link 
            href={getBackLink()}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> 
            Back to Component
          </Link>
          
          <div className="text-sm text-muted-foreground">
            Component Preview Mode
          </div>
        </div>
        
        <h1 className="text-3xl font-bold font-[tusker]">{component.name}</h1>
        <p className="text-sm text-muted-foreground">
          {component.type === 'frontend' 
            ? 'Frontend Component Preview' 
            : 'Backend Component (Code View Only)'}
        </p>
      </div>
      
      <div className="bg-muted rounded-lg overflow-hidden border">
        {component.type === 'frontend' ? (
          <div className="p-6">
            <ComponentPreview code={component.code} />
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-background p-4 rounded-md border">
              <p className="text-center text-muted-foreground">
                Backend components cannot be previewed.
                <br />
                <Link href={getBackLink()} className="text-primary hover:underline inline-flex items-center gap-1 mt-2">
                  <ArrowLeft className="h-3 w-3" /> Return to view code
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}