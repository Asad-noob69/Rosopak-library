// API Service for connecting to local API routes
// This file contains utilities for communicating with Next.js API routes

/**
 * Base URL for the API routes
 * Using relative URL to access Next.js API routes from client
 * We'll use absolute URL when called from the server
 */
export const API_BASE_URL = '/api';

/**
 * Simplified Component type with only the essential fields
 */
export type Component = {
  id: string;
  name: string;
  code: string;
  type: 'backend' | 'frontend';
};

/**
 * Get base URL for API requests that works in both client and server environments
 */
function getBaseUrl() {
  // Check if we're running on the server
  if (typeof window === 'undefined') {
    // Server-side request - use absolute URL with NEXT_PUBLIC_BASE_URL environment variable
    // or default to localhost if not set
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }
  // Client-side request - use relative URL
  return '';
}

/**
 * Generic function to make API requests from both client and server components
 */
export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Add this for server-side requests to ensure they're properly cached/revalidated
    ...(typeof window === 'undefined' && { cache: options.cache || 'no-store' }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }

  // For DELETE requests, there may not be a response body
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * API services for components using Next.js API routes
 */
export const ComponentService = {
  // Get all components by type (backend or frontend)
  async getComponentsByType(type: 'backend' | 'frontend'): Promise<Component[]> {
    return fetchFromApi<Component[]>(`/components?type=${type}`);
  },

  // Get a specific component by ID
  async getComponentById(id: string): Promise<Component> {
    return fetchFromApi<Component>(`/components/${id}`);
  },

  // Create a new component
  async createComponent(componentData: Omit<Component, 'id'>, password: string): Promise<Component> {
    return fetchFromApi<Component>('/components', {
      method: 'POST',
      body: JSON.stringify({ 
        name: componentData.name,
        code: componentData.code,
        type: componentData.type,
        password 
      }),
    });
  },

  // Update an existing component
  async updateComponent(id: string, componentData: Partial<Component>, password: string): Promise<Component> {
    return fetchFromApi<Component>(`/components/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        name: componentData.name,
        code: componentData.code,
        type: componentData.type,
        password 
      }),
    });
  },

  // Delete a component
  async deleteComponent(id: string, password: string): Promise<void> {
    return fetchFromApi<void>(`/components/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  },

  // Verify admin password
  async verifyPassword(password: string): Promise<{ valid: boolean }> {
    return fetchFromApi<{ valid: boolean }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }
};