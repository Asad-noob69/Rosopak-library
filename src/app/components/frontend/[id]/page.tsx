'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Component {
  id: string;
  name: string;
  code: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function FrontendComponentDetail() {
  const params = useParams();
  const id = params.id as string;
  const [component, setComponent] = useState<Component | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // For frontend components, we could add preview rendering here if needed
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{component.name}</h1>
      
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <p className="text-sm text-gray-500 mb-2">Component ID: {component.id}</p>
        <p className="text-sm text-gray-500 mb-2">Type: {component.type}</p>
        <p className="text-sm text-gray-500 mb-2">Created: {new Date(component.createdAt).toLocaleString()}</p>
        <p className="text-sm text-gray-500">Last Updated: {new Date(component.updatedAt).toLocaleString()}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Code:</h2>
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
          <code>{component.code}</code>
        </pre>
      </div>
      
      {/* Could add a live preview section for frontend components */}
      
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => window.history.back()}
      >
        Back to Components
      </button>
    </div>
  );
}