import { apiClient } from '../utils/axiosConfig';

export interface Webinar {
  id: number;
  title: string;
  description: string;
  scheduleTime: string;
  durationMinutes: number;
  presenters: string[];
  maxAttendees: number;
  registered?: number;
  registeredCount?: number;
  status: string;
  targetAudience?: string;
  meetingLink?: string;
}

export const webinarApi = {
  // Get all webinars
  getAll: async () => {
    const response = await apiClient.get('/webinars');
    return response.data;
  },

  // Get upcoming webinars
  getUpcoming: async () => {
    const response = await apiClient.get('/webinars/upcoming');
    return response.data;
  },

  // Create new webinar
  create: async (webinarData: Partial<Webinar>) => {
    const response = await apiClient.post('/webinars', webinarData);
    return response.data;
  },

  // Get webinar statistics
  getStats: async () => {
    try {
      const response = await apiClient.get('/webinars');
      // Handle different response structures
      let webinars = [];
      
      if (response.data.data) {
        // If data is wrapped in ApiResponse
        if (response.data.data.content) {
          // If it's a Page object
          webinars = response.data.data.content;
        } else if (Array.isArray(response.data.data)) {
          // If it's a direct array
          webinars = response.data.data;
        }
      } else if (response.data.content) {
        // If it's a Page object at root
        webinars = response.data.content;
      } else if (Array.isArray(response.data)) {
        // If response is a direct array
        webinars = response.data;
      }
      
      return {
        total: webinars.length,
        upcoming: webinars.filter((w: Webinar) => w.status === 'UPCOMING' || w.status === 'SCHEDULED').length,
        totalRegistered: webinars.reduce((sum: number, w: Webinar) => sum + (w.registered || w.registeredCount || 0), 0),
        avgAttendance: webinars.length > 0 
          ? Math.round(webinars.reduce((sum: number, w: Webinar) => 
              sum + ((w.registered || w.registeredCount || 0) / w.maxAttendees * 100), 0) / webinars.length)
          : 0,
      };
    } catch (error) {
      console.error('Error fetching webinar stats:', error);
      return { total: 0, upcoming: 0, totalRegistered: 0, avgAttendance: 0 };
    }
  },
};
