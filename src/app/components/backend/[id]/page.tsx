'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css'; // VS Code dark theme style

interface Component {
  id: string;
  name: string;
  code: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function BackendComponentDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [component, setComponent] = useState<Component | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const response = await fetch(`/api/components/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch component: ${response.statusText}`);
        }
        
        const data = await response.json();
        setComponent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching the component');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComponent();
  }, [id]);

  // Add an effect to apply syntax highlighting after component data loads
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

  // Handle delete component with password
  const handleDeleteComponent = async () => {
    if (!component) return;
    
    try {
      const response = await fetch(`/api/components/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setIsPasswordValid(false);
        return;
      }
      
      setIsPasswordModalOpen(false);
      // Redirect to home page instead of components page
      router.push('/');
    } catch (err) {
      console.error('Failed to delete component:', err);
      setIsPasswordValid(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading component...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Error: {error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg">Component not found</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {displayName}
      </h1>
      
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <p className="text-sm text-gray-500 mb-2">Component ID: {component.id}</p>
        <p className="text-sm text-gray-500 mb-2">Type: {component.type}</p>
        <p className="text-sm text-gray-500 mb-2">Created: {new Date(component.createdAt).toLocaleString()}</p>
        <p className="text-sm text-gray-500">Last Updated: {new Date(component.updatedAt).toLocaleString()}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-center">Code:</h2>
        <div className="rounded-md overflow-hidden">
          {/* VS Code-like editor container */}
          <div className="bg-[#1E1E1E] rounded-t-md py-2 px-4 flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-400 text-sm ml-2">
              {component.name}.{component.type === 'backend' ? 'js' : 'jsx'}
            </span>
            <button 
              onClick={handleCopyCode}
              className="ml-auto text-xs text-gray-400 hover:text-white"
            >
              Copy Code
            </button>
          </div>
          <div className="bg-[#1E1E1E] text-white p-1">
            {/* Line numbers and code content */}
            <div className="flex">
              <div className="pr-4 select-none text-gray-500 text-right" style={{ minWidth: '2rem' }}>
                {component.code.split('\n').map((_, i) => (
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
        
        {/* Delete button - now below the code block */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow-md"
          >
            Delete Component
          </button>
        </div>
      </div>
      
      {/* Back button */}
      <div className="flex justify-center">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </div>
      
      {/* Copy confirmation popup */}
      {showCopyConfirmation && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded shadow-lg">
          Code copied to clipboard!
        </div>
      )}
      
      {/* Delete confirmation modal with password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Component</h3>
            <p className="mb-4">Are you sure you want to delete this component? This action cannot be undone.</p>
            <p className="mb-4">Please enter the admin password to confirm:</p>
            
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsPasswordValid(true);
              }}
              className={`w-full p-2 border ${!isPasswordValid ? 'border-red-500' : 'border-gray-300'} rounded-md mb-2`}
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
                  setIsPasswordValid(true);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
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
    </div>
  );
}