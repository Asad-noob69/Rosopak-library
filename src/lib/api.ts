// API Service for connecting to local API routes
// This file contains utilities for communicating with Next.js API routes

/**
 * Base URL for the API routes
 * Using relative URL to access Next.js API routes
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
 * Generic function to make API requests
 */
export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
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