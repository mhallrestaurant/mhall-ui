/**
 * API Configuration
 * Centralized configuration for API base URL
 */

export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://api.moorhall.com/api/v1'
    : 'http://localhost:3005/api/v1');

/**
 * Construct full API endpoint URL
 * @param endpoint - Relative endpoint path (e.g., '/menu-items/public/home')
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
