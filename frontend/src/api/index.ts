import axios from 'axios';
import { authAPI } from './auth';
import { coursesAPI } from './courses';
import { certificatesAPI } from './certificates';
import { resourcesAPI } from './resources';
import { webinarsAPI } from './webinars';
import { notificationsAPI } from './notifications';
import { analyticsAPI } from './analytics';
import { userRolesAPI } from './userRoles';
import { helpAPI } from './help';
import { syncAPI } from './sync';
import { archiveAPI } from './archive';
import { dashboardAPI } from './dashboard';
import { modulesAPI, questionsAPI } from './modules';

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor to add auth token
axios.interceptors.request.use(
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

// Response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on a public page
      const currentPath = window.location.pathname;
      const isPublicPage = currentPath === '/' || 
                          currentPath === '/login' || 
                          currentPath === '/register' || 
                          currentPath.startsWith('/public');
      
      console.log('ðŸ”´ [axios default] 401 Error');
      console.log('   Current path:', currentPath);
      console.log('   Is public:', isPublicPage);
      console.log('   Request URL:', error.config?.url);
      console.log('   Token exists:', !!localStorage.getItem('itas_token'));
      
      // TEMPORARILY DISABLED - Don't redirect, just log
      console.log('   âš ï¸ REDIRECT DISABLED FOR DEBUGGING');
      
      // if (!isPublicPage) {
      //   // Token expired or invalid on protected page
      //   console.log('   âš ï¸ Redirecting to login...');
      //   localStorage.removeItem('itas_token');
      //   localStorage.removeItem('itas_user');
      //   window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);

// Export all API services
export {
  authAPI,
  coursesAPI,
  certificatesAPI,
  resourcesAPI,
  webinarsAPI,
  notificationsAPI,
  analyticsAPI,
  userRolesAPI,
  helpAPI,
  syncAPI,
  archiveAPI,
  dashboardAPI,
  modulesAPI,
  questionsAPI,
};

// Utility function for file uploads
export const uploadFile = async (url: string, file: File, data: any, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Append other data
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });

  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data;
};