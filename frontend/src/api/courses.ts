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

export const coursesAPI = {
  getAllCourses: async () => {
    const response = await axios.get(`${API_BASE_URL}/courses`, getAuthHeaders());
    return response.data;
  },

  getCourseById: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/courses/${id}`, getAuthHeaders());
    return response.data;
  },

  enroll: async (userId: number, courseId: number) => {
    const response = await axios.post(`${API_BASE_URL}/courses/enroll`, {
      userId,
      courseId,
    }, getAuthHeaders());
    return response.data;
  },

  updateProgress: async (enrollmentId: number, progress: number) => {
    const response = await axios.put(`${API_BASE_URL}/courses/progress`, {
      enrollmentId,
      progress,
    }, getAuthHeaders());
    return response.data;
  },

  getUserEnrollments: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/courses/enrollments/${userId}`, getAuthHeaders());
    return response.data;
  },
};
