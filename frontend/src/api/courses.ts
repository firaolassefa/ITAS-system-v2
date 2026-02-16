import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const coursesAPI = {
  getAllCourses: async () => {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return response.data;
  },

  getCourseById: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
    return response.data;
  },

  enroll: async (userId: number, courseId: number) => {
    const response = await axios.post(`${API_BASE_URL}/courses/enroll`, {
      userId,
      courseId,
    });
    return response.data;
  },

  updateProgress: async (enrollmentId: number, progress: number) => {
    const response = await axios.put(`${API_BASE_URL}/courses/progress`, {
      enrollmentId,
      progress,
    });
    return response.data;
  },

  getUserEnrollments: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/courses/enrollments/${userId}`);
    return response.data;
  },
};
