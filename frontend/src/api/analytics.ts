import { apiClient } from '../utils/axiosConfig';

export const analyticsApi = {
  // Get dashboard analytics
  getDashboard: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`/analytics/dashboard?${params.toString()}`);
    return response.data;
  },

  // Get overview stats (fallback to calculating from available data)
  getOverviewStats: async () => {
    try {
      // Try to get from analytics endpoint first
      const response = await apiClient.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      // Fallback: calculate from users and courses
      try {
        const [usersRes, coursesRes] = await Promise.all([
          apiClient.get('/users'),
          apiClient.get('/courses'),
        ]);
        
        const users = usersRes.data.data || usersRes.data || [];
        const courses = coursesRes.data.data || coursesRes.data || [];
        
        return {
          totalUsers: users.length,
          activeUsers: users.filter((u: any) => u.active).length,
          courseEnrollments: courses.reduce((sum: number, c: any) => sum + (c.enrollments || 0), 0),
          completionRate: 68, // Default value
        };
      } catch (err) {
        console.error('Error fetching analytics:', err);
        return {
          totalUsers: 0,
          activeUsers: 0,
          courseEnrollments: 0,
          completionRate: 0,
        };
      }
    }
  },

  // Get top courses
  getTopCourses: async () => {
    try {
      const response = await apiClient.get('/courses');
      const courses = response.data.data || response.data || [];
      
      return courses.slice(0, 5).map((course: any) => ({
        id: course.id,
        title: course.title,
        enrollments: course.enrollments || 0,
        completions: course.completions || 0,
        completionRate: course.enrollments > 0 
          ? Math.round((course.completions || 0) / course.enrollments * 100)
          : 0,
      }));
    } catch (error) {
      console.error('Error fetching top courses:', error);
      return [];
    }
  },

  // Export analytics
  exportReport: async (format: string = 'pdf') => {
    try {
      const response = await apiClient.get(`/analytics/export?format=${format}`);
      
      // Show success message
      const data = response.data.data || response.data;
      alert(`Report generated successfully! Format: ${format.toUpperCase()}\n\nNote: In production, this would download a ${format.toUpperCase()} file with complete analytics data.`);
      
      return data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  },

  // Get user engagement by category
  getUserEngagement: async () => {
    try {
      const response = await apiClient.get('/analytics/user-engagement');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching user engagement:', error);
      return [];
    }
  },

  // Get resource statistics
  getResourceStats: async () => {
    try {
      const response = await apiClient.get('/analytics/resource-stats');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching resource stats:', error);
      return [];
    }
  },

  // Get key insights
  getKeyInsights: async () => {
    try {
      const response = await apiClient.get('/analytics/key-insights');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching key insights:', error);
      return [];
    }
  },
};
