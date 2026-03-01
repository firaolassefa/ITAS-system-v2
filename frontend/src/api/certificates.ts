import { apiClient } from '../utils/axiosConfig';

export const certificatesAPI = {
  getUserCertificates: async (userId: number) => {
    const response = await apiClient.get(`/certificates/user/${userId}`);
    return response.data;
  },

  generateCertificate: async (userId: number, courseId: number) => {
    const response = await apiClient.post('/certificates/generate', {
      userId,
      courseId,
    });
    return response.data;
  },

  verifyCertificate: async (certificateId: string) => {
    const response = await apiClient.get(`/certificates/verify/${certificateId}`);
    return response.data;
  },

  downloadCertificate: async (certificateId: number) => {
    const response = await apiClient.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
