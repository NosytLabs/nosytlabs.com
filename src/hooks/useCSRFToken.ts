import { useState, useEffect } from 'react';

/**
 * Custom hook to manage CSRF tokens
 * Fetches and manages CSRF tokens for form submissions
 */
export const useCSRFToken = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCSRFToken = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/contact/csrf-token', {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.csrfToken) {
        setCsrfToken(data.csrfToken);
      } else {
        throw new Error('Invalid CSRF token response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch CSRF token';
      setError(errorMessage);
      console.error('CSRF token fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = () => {
    fetchCSRFToken();
  };

  // Fetch token on mount
  useEffect(() => {
    fetchCSRFToken();
  }, []);

  return {
    csrfToken,
    isLoading,
    error,
    refreshToken,
  };
};

export default useCSRFToken;