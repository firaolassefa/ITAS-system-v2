import { apiClient } from '../utils/axiosConfig';

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
    const response = await apiClient.get(`/help/field/${fieldId}`);
    return response.data.data;
  },

  searchHelp: async (query: string): Promise<HelpContent[]> => {
    const response = await apiClient.get(`/help/search?q=${query}`);
    return response.data.data;
  },

  createHelp: async (data: Omit<HelpContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<HelpContent> => {
    const response = await apiClient.post('/help', data);
    return response.data.data;
  },

  updateHelp: async (id: number, data: Partial<HelpContent>): Promise<HelpContent> => {
    const response = await apiClient.put(`/help/${id}`, data);
    return response.data.data;
  },
};