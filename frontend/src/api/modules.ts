import { apiClient } from '../utils/axiosConfig';

export const modulesAPI = {
  getAllModules: async () => {
    const response = await apiClient.get('/modules');
    // Backend returns {message: "Success", data: [...]}
    return response.data.data || response.data;
  },

  getModuleById: async (id: number) => {
    const response = await apiClient.get(`/modules/${id}`);
    return response.data.data || response.data;
  },

  getModulesByCourse: async (courseId: number) => {
    const response = await apiClient.get(`/modules/course/${courseId}`);
    return response.data.data || response.data;
  },

  createModule: async (data: any) => {
    const response = await apiClient.post('/modules', data);
    return response.data;
  },

  updateModule: async (id: number, data: any) => {
    const response = await apiClient.put(`/modules/${id}`, data);
    return response.data;
  },

  deleteModule: async (id: number) => {
    const response = await apiClient.delete(`/modules/${id}`);
    return response.data;
  },

  hasQuiz: async (moduleId: number) => {
    const response = await apiClient.get(`/modules/${moduleId}/has-quiz`);
    return response.data.data || response.data;
  },
};

export const questionsAPI = {
  getQuestionsByModule: async (moduleId: number) => {
    const response = await apiClient.get(`/questions/module/${moduleId}`);
    return response.data.data || response.data;
  },

  createQuestion: async (data: any) => {
    const response = await apiClient.post('/questions', data);
    return response.data.data || response.data;
  },

  updateQuestion: async (id: number, data: any) => {
    const response = await apiClient.put(`/questions/${id}`, data);
    return response.data.data || response.data;
  },

  deleteQuestion: async (id: number) => {
    const response = await apiClient.delete(`/questions/${id}`);
    return response.data.data || response.data;
  },

  submitAssessment: async (data: any) => {
    const response = await apiClient.post('/questions/submit-assessment', data);
    return response.data.data || response.data;
  },
};
