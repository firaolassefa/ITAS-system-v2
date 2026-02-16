import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const resourcesAPI = {
  getAllResources: async () => {
    const response = await axios.get(`${API_BASE_URL}/resources`);
    return response.data;
  },

  searchResources: async (query?: string, category?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    
    const response = await axios.get(`${API_BASE_URL}/resources/search?${params.toString()}`);
    return response.data;
  },

  downloadResource: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/resources/${id}/download`);
    return response.data;
  },

  uploadResource: async (resourceData: any) => {
    const response = await axios.post(`${API_BASE_URL}/resources`, resourceData);
    return response.data;
  },
};
