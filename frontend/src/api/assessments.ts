import { apiClient } from '../utils/axiosConfig';

export const assessmentsApi = {
  // Get all assessments
  getAll: async () => {
    const response = await apiClient.get('/assessment-definitions');
    return response.data;
  },

  // Get assessments for a course
  getByCourse: async (courseId: number) => {
    const response = await apiClient.get(`/assessment-definitions/course/${courseId}`);
    return response.data;
  },

  // Get final exam for a course
  getFinalExam: async (courseId: number) => {
    const response = await apiClient.get(`/assessment-definitions/course/${courseId}/final-exam`);
    return response.data;
  },

  // Get module quizzes for a course
  getModuleQuizzes: async (courseId: number) => {
    const response = await apiClient.get(`/assessment-definitions/course/${courseId}/module-quizzes`);
    return response.data;
  },

  // Get assessment by ID
  getById: async (id: number) => {
    const response = await apiClient.get(`/assessment-definitions/${id}`);
    return response.data;
  },

  // Create assessment
  create: async (data: any) => {
    const response = await apiClient.post('/assessment-definitions', data);
    return response.data;
  },

  // Update assessment
  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/assessment-definitions/${id}`, data);
    return response.data;
  },

  // Delete assessment
  delete: async (id: number) => {
    const response = await apiClient.delete(`/assessment-definitions/${id}`);
    return response.data;
  },

  // Import questions from file (TODO: Backend implementation needed)
  importFromFile: async (file: File, courseId: number, moduleId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId.toString());
    if (moduleId) formData.append('moduleId', moduleId.toString());

    const response = await apiClient.post('/assessment-definitions/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user's attempts for an assessment
  getAttempts: async (assessmentId: number, userId: number) => {
    const response = await apiClient.get(`/assessment-attempts/assessment/${assessmentId}/user/${userId}`);
    return response.data;
  },

  // Submit assessment attempt
  submitAttempt: async (data: any) => {
    const response = await apiClient.post('/assessment-attempts', data);
    return response.data;
  },
};
