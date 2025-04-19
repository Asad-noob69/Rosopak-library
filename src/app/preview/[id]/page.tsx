import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ComponentPreview } from '@/components/ComponentPreview'
import { ComponentService } from '@/lib/api';
import { notFound } from 'next/navigation';

// This enables dynamic rendering for preview pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Component Preview Page
export default async function PreviewPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  
  // Fetch component data
  let component;
  try {
    component = await ComponentService.getComponentById(id);
  } catch (err) {
    console.error('Failed to fetch component:', err);
    notFound();
  }

  // If component not found
  if (!component) {
    notFound();
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