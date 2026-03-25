import axios from 'axios';

// In production (docker), nginx proxies /api → backend:9090/api
// In local dev, use localhost:9090 directly
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('itas_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Only redirect to login on a genuine 401 response from the server.
// Never redirect on network errors, CORS failures, or 5xx errors —
// those should be handled by the calling component.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // error.response is undefined for network/CORS errors — do NOT redirect
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      // Don't redirect if already on login or public pages
      const publicPaths = ['/login', '/register', '/', '/public'];
      const isPublic = publicPaths.some(p => currentPath.startsWith(p));

      if (!isPublic) {
        console.warn('[apiClient] 401 — clearing session and redirecting to login');
        localStorage.removeItem('itas_token');
        localStorage.removeItem('itas_user');
        setTimeout(() => { window.location.href = '/login'; }, 150);
      }
    }
    return Promise.reject(error);
  }
);

export const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export default apiClient;
