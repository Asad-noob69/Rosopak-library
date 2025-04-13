"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { ComponentService } from "@/lib/api"

// =========================================================
// FRONTEND COMPONENT DETAIL PAGE
// =========================================================
// This component renders the detail page for a frontend component
// The dynamic route parameter [id] is passed to this component via params
//
// How dynamic routes work in Next.js App Router:
// 1. The folder named [id] creates a dynamic route segment
// 2. The actual value in the URL replaces [id] and is accessible via params.id
// 3. For example, visiting /library/frontend/fe1 will make params.id = "fe1"
// =========================================================
export default async function FrontendComponentDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return <ClientFrontendComponent id={resolvedParams.id} />;
}

// Client component that handles state and interactions
function ClientFrontendComponent({ id }: { id: string }) {
  // State for the current component
  const [component, setComponent] = useState<any>(null);
  // State for tracking edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State for the editable code
  const [editableCode, setEditableCode] = useState("");
  // State to track loading state
  const [isLoading, setIsLoading] = useState(true);
  // State to track error state
  const [error, setError] = useState<string | null>(null);
  // State for password modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  // State for password input
  const [password, setPassword] = useState("");
  // State for password validation
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  // Store component ID in state
  const [componentId, setComponentId] = useState<string>(id);

  // Load component data when the component mounts or when the ID changes
  useEffect(() => {
    // Skip if component ID is not set yet
    if (!componentId) return;
    
    async function fetchComponent() {
      setIsLoading(true);
      setError(null);
      
      try {
        // If it's a new component, set up an empty component
        if (componentId === 'new') {
          setComponent({
            id: '',
            name: '',
            description: '',
            code: '',
            type: 'frontend'
          });
          setEditableCode('');
          setIsEditing(true);
          setIsLoading(false);
          return;
        }
        
        // Fetch component from API
        const componentData = await ComponentService.getComponentById(componentId);
        setComponent(componentData);
        setEditableCode(componentData.code);
      } catch (err) {
        console.error('Failed to fetch component:', err);
        setError('Failed to load component. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchComponent();
  }, [componentId]);

  // Handle saving component
  const handleSaveComponent = async () => {
    setIsPasswordModalOpen(true);
  };

  // Handle publishing with password
  const handlePublish = async () => {
    try {
      // Check if password is valid
      const passwordCheck = await ComponentService.verifyPassword(password);
      
      if (!passwordCheck.valid) {
        setIsPasswordValid(false);
        return;
      }
      
      // Create/update component based on whether it's new or existing
      const componentData = {
        name: component.name || 'Untitled Component',
        description: component.description || 'No description provided',
        code: editableCode,
        type: 'frontend'
      };
      
      if (componentId === 'new') {
        // Create new component and get the response with the new ID
        const newComponent = await ComponentService.createComponent(componentData, password);
        
        // Reset state and close modal
        setIsPasswordModalOpen(false);
        setPassword('');
        setIsEditing(false);
        
        // Redirect to the newly created component
        window.location.href = `/library/frontend/${newComponent.id}`;
      } else {
        await ComponentService.updateComponent(componentId, componentData, password);
        
        // Reset state and close modal
        setIsPasswordModalOpen(false);
        setPassword('');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to publish component:', err);
      setError('Failed to publish component. Please try again later.');
    }
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <SidebarInset className="p-6">
        <div className="flex h-full items-center justify-center">
          <p>Loading component...</p>
        </div>
      </SidebarInset>
    );
  }

  // If the component doesn't exist, show a not found message
  if (error || (!component && componentId !== 'new')) {
    return (
      <SidebarInset className="p-6">
        <div className="flex h-full items-center justify-center">
          <p>{error || 'Component not found'}</p>
        </div>
      </SidebarInset>
    );
  }

  // Render the component detail view
  return (
    <SidebarInset className="p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Component header */}
        <div className="flex flex-col gap-4 mb-6">
          {isEditing ? (
            <>
              <input
                type="text"
                value={component.name || ''}
                onChange={(e) => setComponent({...component, name: e.target.value})}
                placeholder="Component Name"
                className="text-3xl font-bold bg-background border-b border-border px-2 py-1"
              />
              <textarea
                value={component.description || ''}
                onChange={(e) => setComponent({...component, description: e.target.value})}
                placeholder="Component Description"
                className="text-muted-foreground mt-1 bg-background border border-border px-2 py-1 resize-none h-20"
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{component.name}</h1>
              <p className="text-muted-foreground mt-1">{component.description}</p>
            </>
          )}
          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            
            {isEditing && (
              <button 
                onClick={handleSaveComponent}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Publish
              </button>
            )}
          </div>
        </div>

        {/* Code display/edit area */}
        <div className="border rounded-lg overflow-hidden bg-muted">
          {/* Code header with copy button */}
          <div className="bg-muted p-2 border-b flex justify-between">
            <span className="text-sm font-medium">Code</span>
            {!isEditing && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(component.code);
                }}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                Copy Code
              </button>
            )}
          </div>
          
          {/* Toggle between edit textarea and code preview */}
          {isEditing ? (
            <textarea 
              value={editableCode} 
              onChange={(e) => setEditableCode(e.target.value)}
              className="w-full h-[600px] p-4 font-mono text-sm bg-background focus:outline-none"
            />
          ) : (
            <pre className="p-4 overflow-auto font-mono text-sm whitespace-pre-wrap">
              {component.code}
            </pre>
          )}
        </div>
      </div>

      {/* Password modal for publishing */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Enter Password</h3>
            <p className="mb-4">Please enter the admin password to publish this component:</p>
            
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsPasswordValid(true); // Reset validation on input change
              }}
              className={`w-full p-2 border ${!isPasswordValid ? 'border-red-500' : 'border-border'} rounded-md mb-2`}
              placeholder="Password"
            />
            
            {!isPasswordValid && (
              <p className="text-red-500 text-sm mb-4">Invalid password. Please try again.</p>
            )}
            
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPassword('');
                }}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
              >
                Cancel
              </button>
              <button 
                onClick={handlePublish}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarInset>
  );
}