import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const resourcesAPI = {
  getAllResources: async () => {
    const response = await axios.get(`${API_BASE_URL}/resources`, getAuthHeaders());
    return response.data;
  },

  searchResources: async (query?: string, category?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    
    const response = await axios.get(`${API_BASE_URL}/resources/search?${params.toString()}`, getAuthHeaders());
    return response.data;
  },

  downloadResource: async (id: number) => {
    const token = localStorage.getItem('itas_token');
    const response = await axios.get(`${API_BASE_URL}/resources/${id}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'blob', // Important: get file as blob
    });
    return response.data;
  },

  streamResource: async (id: number) => {
    const token = localStorage.getItem('itas_token');
    const response = await axios.get(`${API_BASE_URL}/resources/${id}/stream`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'blob', // Important: get file as blob
    });
    return response.data;
  },

  getResourceUrl: (id: number) => {
    const token = localStorage.getItem('itas_token');
    return `${API_BASE_URL}/resources/${id}/stream?token=${token}`;
  },

  uploadResource: async (file: File, resourceData: any, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', resourceData.title);
    formData.append('description', resourceData.description || '');
    formData.append('resourceType', resourceData.resourceType);
    formData.append('category', resourceData.category);
    formData.append('audience', resourceData.audience);

    const token = localStorage.getItem('itas_token');
    const response = await axios.post(`${API_BASE_URL}/resources/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
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
  },
};
