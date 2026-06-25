import { useState, useCallback } from 'react';
import appConfig from '../config';

// Automatically append the API route prefix so the developer only has to configure the root domain
const BASE_URL = `${appConfig.BACKEND_DOMAIN}/api/v1`;

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, method = 'GET', body = null, isFormData = false) => {
    setLoading(true);
    setError(null);
    try {
      const headers = {};
      
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config = {
        method,
        headers,
      };

      if (body) {
        config.body = isFormData ? body : JSON.stringify(body);
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }, []);

  return { request, loading, error };
};
