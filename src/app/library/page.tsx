import React from 'react';
import Link from 'next/link';
import { SidebarInset } from "@/components/ui/sidebar";
import { ComponentService } from "@/lib/api";

// Use ISR (Incremental Static Regeneration) with a 1 hour revalidation period
// This will cache the page but refresh it periodically
export const revalidate = 3600;

export default async function LibraryPage() {
  // Fetch both component types in parallel
  const [frontendComponents, backendComponents] = await Promise.all([
    ComponentService.getComponentsByType('frontend'),
    ComponentService.getComponentsByType('backend')
  ]);

  return (
    <SidebarInset className="p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 font-[tusker]">Component Library</h1>
          <div className="flex justify-center gap-4">
            <Link 
              href="/library/frontend/new"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Create Frontend Component
            </Link>
            <Link 
              href="/library/backend/new"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Create Backend Component
            </Link>
          </div>
        </div>

        {/* Frontend Components Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-[tusker]">Frontend Components</h2>
            <span className="text-muted-foreground text-sm">
              {frontendComponents.length} Components
            </span>
          </div>
          
          {frontendComponents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {frontendComponents.map((component) => (
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
        </section>

        {/* Backend Components Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-[tusker]">Backend Components</h2>
            <span className="text-muted-foreground text-sm">
              {backendComponents.length} Components
            </span>
          </div>
          
          {backendComponents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {backendComponents.map((component) => (
                <Link
                  key={component.id}
                  href={`/library/backend/${component.id}`}
                  className="border rounded-md overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-muted h-36 flex items-center justify-center p-4 bg-gray-800">
                    <div className="text-center text-gray-300">
                      <p>API Component</p>
                      <p className="text-xs">{component.code.length} characters</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{component.name}</h3>
                    <p className="text-sm text-muted-foreground">Backend Component</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-md p-8 text-center">
              <p className="text-muted-foreground mb-4">No backend components yet</p>
              <Link 
                href="/library/backend/new"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Create Your First Backend Component
              </Link>
            </div>
          )}
        </section>
      </div>
    </SidebarInset>
  );
}