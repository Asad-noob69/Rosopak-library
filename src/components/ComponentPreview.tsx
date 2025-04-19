"use client"

import React, { useEffect, useState } from 'react';
import * as Babel from '@babel/standalone';
import Image from 'next/image';
import * as ReactIcons from 'react-icons/fa'; // Mock react-icons

/**
 * Component for rendering live previews of React code
 * @param {Object} props - Component props
 * @param {string} props.code - The React component code to render
 * @param {string} props.className - Optional className for the preview container
 * @param {Object} props.componentProps - Props to pass to the rendered component
 */
export function ComponentPreview({ 
  code, 
  className = "bg-white p-4 rounded-md",
  componentProps = {}
}: { 
  code: string; 
  className?: string;
  componentProps?: Record<string, any>;
}) {
  const [previewComponent, setPreviewComponent] = useState<React.ReactNode | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
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
          if (importPath === 'react-icons/fa') {
            return '// React Icons import handled';
          }
          if (importPath === 'react') {
            return '// React import handled';
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
      
      // Handle default export assignment
      processedCode = processedCode.replace(
        /export\s+default\s+(\w+)\s*;?/g,
        (match, name) => {
          return `// Default export: ${name}`;
        }
      );
      
      // Transform JSX to JavaScript using Babel
      const transformedCode = Babel.transform(processedCode, {
        presets: ['react', 'typescript'], // Add TypeScript support
        filename: 'component.tsx',
      }).code;
      
      if (!transformedCode) {
        throw new Error('Failed to transform JSX code');
      }
      
      // Create safe wrapper for evaluation
      const wrapCode = (transformedCode: string) => {
        return `
          const {useState, useEffect, useRef, createElement, Fragment} = React;
          
          // Provide Next.js and mocked dependencies
          const Image = NextImage;
          const FaStar = ReactIcons.FaStar; // Mock react-icons/fa
          
          try {
            // Execute the transformed code
            ${transformedCode}
            
            // Check for exported components
            function PreviewComponent() {
              // Try to find any component in order of priority
              if (typeof Component !== 'undefined') {
                return createElement(Component, ${JSON.stringify(componentProps)});
              } 
              else if (typeof Rating !== 'undefined') {
                return createElement(Rating, ${JSON.stringify(componentProps)});
              }
              else if (typeof Footer !== 'undefined') {
                return createElement(Footer, ${JSON.stringify(componentProps)});
              }
              else if (typeof Header !== 'undefined') {
                return createElement(Header, ${JSON.stringify(componentProps)});
              }
              else if (typeof Layout !== 'undefined') {
                return createElement(Layout, ${JSON.stringify(componentProps)});
              }
              else if (typeof Card !== 'undefined') {
                return createElement(Card, ${JSON.stringify(componentProps)});
              }
              else if (typeof Button !== 'undefined') {
                return createElement(Button, ${JSON.stringify(componentProps)});
              }
              else {
                // Try to find any function that starts with uppercase
                for (const key in this) {
                  if (typeof this[key] === 'function' && /^[A-Z]/.test(key)) {
                    return createElement(this[key], ${JSON.stringify(componentProps)});
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
      
      // Use Function constructor as a sandbox
      const ReactComponent = new Function('React', 'NextImage', 'ReactIcons', wrapCode(transformedCode));
      
      // Set the component to state with provided dependencies
      setPreviewComponent(ReactComponent(React, Image, ReactIcons));
      setPreviewError(null);
    } catch (err) {
      console.error('Preview error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setPreviewError(`Failed to render preview: ${errorMessage}`);
    }
  }, [code, componentProps]);
  
  return (
    <div className={className}>
      {previewError ? (
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">{previewError}</div>
      ) : (
        <div className="preview-render">
          {previewComponent}
        </div>
      )}
    </div>
  );
}