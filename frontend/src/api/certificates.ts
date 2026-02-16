import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const certificatesAPI = {
  getUserCertificates: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/certificates/user/${userId}`);
    return response.data;
  },

  generateCertificate: async (userId: number, courseId: number) => {
    const response = await axios.post(`${API_BASE_URL}/certificates/generate`, {
      userId,
      courseId,
    });
    return response.data;
  },

  verifyCertificate: async (certificateId: string) => {
    const response = await axios.get(`${API_BASE_URL}/certificates/verify/${certificateId}`);
    return response.data;
  },

  downloadCertificate: async (certificateId: number) => {
    const response = await axios.get(`${API_BASE_URL}/certificates/${certificateId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
