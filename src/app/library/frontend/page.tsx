import React from 'react';
import Link from 'next/link';
import { SidebarInset } from "@/components/ui/sidebar";
import { ComponentService } from "@/lib/api";
import { ArrowLeft, Plus } from 'lucide-react';

// Use ISR with a 1 hour revalidation period
export const revalidate = 3600;

export default async function FrontendComponentsPage() {
  // Fetch frontend components
  const components = await ComponentService.getComponentsByType('frontend');

  return (
    <SidebarInset className="p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link href="/library" className="text-primary hover:underline inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                All Components
              </Link>
              <h1 className="text-xl font-bold font-[tusker] p-4">Frontend Components</h1>
            </div>
            <Link 
              href="/library/frontend/new"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Component
            </Link>
          </div>
          <p className="text-muted-foreground">
            Browse and use our collection of frontend UI components designed for ROSOPAK.
          </p>
        </div>

        {components.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <Link
                key={component.id}
                href={`/library/frontend/${component.id}`}
                className="border rounded-md overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-muted h-36 flex items-center justify-center p-4">
                  <div className="text-center text-muted-foreground">
                    <p>UI Component</p>
                    <p className="text-xs">{component.code.length} characters</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{component.name}</h3>
                  <p className="text-sm text-muted-foreground">Frontend Component</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-md p-8 text-center">
            <p className="text-muted-foreground mb-4">No frontend components yet</p>
            <Link 
              href="/library/frontend/new"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Create Your First Frontend Component
            </Link>
          </div>
        )}
      </div>
    </SidebarInset>
  );
}