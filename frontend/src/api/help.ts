import axios from 'axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export interface HelpContent {
  id: number;
  fieldId: string;
  fieldName: string;
  description: string;
  steps: string[];
  example: string;
  videoUrl?: string;
  docUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const helpAPI = {
  getHelpByField: async (fieldId: string): Promise<HelpContent> => {
    const response = await axios.get(`/help/field/${fieldId}`, getAuthHeaders());
    return response.data.data;
  },

  searchHelp: async (query: string): Promise<HelpContent[]> => {
    const response = await axios.get(`/help/search?q=${query}`, getAuthHeaders());
    return response.data.data;
  },

  createHelp: async (data: Omit<HelpContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<HelpContent> => {
    const response = await axios.post('/help', data, getAuthHeaders());
    return response.data.data;
  },

  updateHelp: async (id: number, data: Partial<HelpContent>): Promise<HelpContent> => {
    const response = await axios.put(`/help/${id}`, data, getAuthHeaders());
    return response.data.data;
  },
};