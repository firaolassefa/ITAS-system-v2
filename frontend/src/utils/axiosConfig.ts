import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('itas_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🔴 [apiClient] Authentication failed - token may be expired');
      console.log('   Current path:', window.location.pathname);
      console.log('   Request URL:', error.config?.url);
      console.log('   Token exists:', !!localStorage.getItem('itas_token'));
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        // Clear invalid token and redirect to login
        console.log('   ⚠️ Redirecting to login...');
        localStorage.removeItem('itas_token');
        localStorage.removeItem('itas_user');
        
        // Add a small delay to prevent redirect loop
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export default apiClient;
