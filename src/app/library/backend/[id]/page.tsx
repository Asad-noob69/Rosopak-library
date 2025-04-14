"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css'; // VS Code dark theme style

import { SidebarInset } from "@/components/ui/sidebar"
import { ComponentService } from "@/lib/api"

// Client component that handles state and interactions
function ClientBackendComponent({ id }: { id: string }) {
  const router = useRouter();
  // State to store the current component data
  const [component, setComponent] = useState<any>(null);
  // State to track if we're in editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State to store the editable code
  const [editableCode, setEditableCode] = useState("");
  // State to track loading state
  const [isLoading, setIsLoading] = useState(true);
  // State to track error state
  const [error, setError] = useState<string | null>(null);
  // State for password modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // State for password input
  const [password, setPassword] = useState("");
  // State for password validation
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  // State for copy confirmation
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);
  // Store component ID directly as a constant instead of using state
  const componentId = id;

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Effect to load component data when the component mounts
  useEffect(() => {
    // Skip if component ID is not set yet
    if (!componentId) return;

    async function fetchComponent() {
      setIsLoading(true);
      setError(null);
      
      try {
        // If it's a new component, don't try to fetch
        if (componentId === 'new') {
          setComponent({
            id: '',
            name: '',
            code: '',
            type: 'backend'
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

  // Add a new effect to apply syntax highlighting after component data loads
  useEffect(() => {
    if (component && component.code) {
      hljs.highlightAll();
    }
  }, [component]);

  // Handle copy code to clipboard
  const handleCopyCode = () => {
    if (component) {
      navigator.clipboard.writeText(component.code);
      setShowCopyConfirmation(true);
      setTimeout(() => {
        setShowCopyConfirmation(false);
      }, 3000);
    }
  };

  // Handle saving component
  const handleSaveComponent = async () => {
    setIsPasswordModalOpen(true);
  };

  // Handle delete component
  const handleDeleteComponent = async () => {
    try {
      // Check if password is valid
      const passwordCheck = await ComponentService.verifyPassword(password);
      
      if (!passwordCheck.valid) {
        setIsPasswordValid(false);
        return;
      }
      
      await ComponentService.deleteComponent(componentId, password);
      
      // Reset state and close modal
      setIsDeleteModalOpen(false);
      setPassword('');
      
      // Redirect to home page instead of library page
      router.push('/');
    } catch (err) {
      console.error('Failed to delete component:', err);
      setError('Failed to delete component. Please try again later.');
    }
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
        code: editableCode,
        type: 'backend' as const
      };
      
      if (componentId === 'new') {
        // Create new component and get the response with the new ID
        const newComponent = await ComponentService.createComponent(componentData, password);
        
        // Reset state and close modal
        setIsPasswordModalOpen(false);
        setPassword('');
        setIsEditing(false);
        
        // Redirect to the newly created component
        window.location.href = `/library/backend/${newComponent.id}`;
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

  // If component is not found, show a not found message
  if (error || (!component && componentId !== 'new')) {
    return (
      <SidebarInset className="p-6">
        <div className="flex h-full items-center justify-center">
          <p>{error || 'Component not found'}</p>
        </div>
      </SidebarInset>
    );
  }

  // Helper function to detect language from code or use fallback
  const detectLanguage = (code: string): string => {
    try {
      const detected = hljs.highlightAuto(code).language;
      return detected || 'javascript'; // Default to javascript if detection fails
    } catch (e) {
      return 'javascript';
    }
  };

  // Get capitalized component name
  const displayName = component.name ? capitalizeFirstLetter(component.name) : '';

  // Render the component detail page
  return (
    <SidebarInset className="p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Component header with name and action buttons */}
        <div className="flex flex-col gap-4 mb-6">
          {isEditing ? (
            <>
              <input
                type="text"
                value={component.name || ''}
                onChange={(e) => setComponent({...component, name: e.target.value})}
                placeholder="Component Name"
                className="text-3xl font-bold bg-background border-b border-border px-2 py-1 text-center"
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {displayName}
              </h1>
            </>
          )}
        </div>

        {/* Code display container */}
        <div className="border rounded-lg overflow-hidden bg-muted">
          <div className="bg-muted p-2 border-b flex justify-between">
            <span className="text-sm font-medium">Code</span>
            {!isEditing && (
              <button 
                onClick={handleCopyCode}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                Copy Code
              </button>
            )}
          </div>
          
          {/* Toggle between edit mode and preview mode */}
          {isEditing ? (
            <textarea 
              value={editableCode} 
              onChange={(e) => setEditableCode(e.target.value)}
              className="w-full h-[600px] p-4 font-mono text-sm bg-background focus:outline-none"
            />
          ) : (
            <div className="rounded-md overflow-hidden">
              {/* VS Code-like editor container */}
              <div className="bg-[#1E1E1E] rounded-t-md py-2 px-4 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400 text-sm ml-2">
                  {component.name}.{component.type === 'backend' ? 'js' : 'jsx'}
                </span>
              </div>
              <div className="bg-[#1E1E1E] text-white p-1">
                {/* Line numbers and code content */}
                <div className="flex">
                  <div className="pr-4 select-none text-gray-500 text-right" style={{ minWidth: '2rem' }}>
                    {component.code.split('\n').map((_: string, i: number) => (
                      <div key={i} className="code-line-number">{i + 1}</div>
                    ))}
                  </div>
                  <pre className="overflow-x-auto w-full">
                    <code className={`language-${detectLanguage(component.code)}`}>
                      {component.code}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end mt-4 gap-4">
          {isEditing ? (
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Cancel
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Edit
            </button>
          )}
          
          {isEditing && (
            <button 
              onClick={handleSaveComponent}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Publish
            </button>
          )}
          
          {componentId !== 'new' && (
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Copy confirmation popup */}
      {showCopyConfirmation && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded shadow-lg z-50">
          Code copied to clipboard!
        </div>
      )}

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

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Component</h3>
            <p className="mb-4">Are you sure you want to delete this component? This action cannot be undone.</p>
            <p className="mb-4">Please enter the admin password to confirm:</p>
            
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
                  setIsDeleteModalOpen(false);
                  setPassword('');
                  setIsPasswordValid(true);
                }}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteComponent}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarInset>
  );
}

export default async function BackendComponentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <ClientBackendComponent id={resolvedParams.id} />
  );
}