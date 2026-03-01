import { apiClient } from '../utils/axiosConfig';

export const coursesAPI = {
  getAllCourses: async () => {
    const response = await apiClient.get('/courses');
    return response.data;
  },

  getCourseById: async (id: number) => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  enroll: async (userId: number, courseId: number) => {
    const response = await apiClient.post('/courses/enroll', {
      userId,
      courseId,
    });
    return response.data;
  },

  updateProgress: async (enrollmentId: number, progress: number) => {
    const response = await apiClient.put('/courses/progress', {
      enrollmentId,
      progress,
    });
    return response.data;
  },

  completeModule: async (userId: number, courseId: number, moduleId: number) => {
    const response = await apiClient.post('/courses/complete-module', {
      userId,
      courseId,
      moduleId,
    });
    return response.data;
  },

  getUserEnrollments: async (userId: number) => {
    const response = await apiClient.get(`/courses/enrollments/${userId}`);
    return response.data;
  },
};
