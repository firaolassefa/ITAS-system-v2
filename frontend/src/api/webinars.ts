import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Webinar {
  id: number;
  title: string;
  description: string;
  scheduleTime: string;
  durationMinutes: number;
  presenters: string[];
  maxAttendees: number;
  registered?: number;
  status: string;
  targetAudience?: string;
}

export const webinarApi = {
  // Get all webinars
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/webinars`);
    return response.data;
  },

  // Get upcoming webinars
  getUpcoming: async () => {
    const response = await axios.get(`${API_BASE_URL}/webinars/upcoming`);
    return response.data;
  },

  // Create new webinar
  create: async (webinarData: Partial<Webinar>) => {
    const response = await axios.post(`${API_BASE_URL}/webinars`, webinarData);
    return response.data;
  },

  // Get webinar statistics
  getStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/webinars`);
      const webinars = response.data.data || response.data.content || [];
      
      return {
        total: webinars.length,
        upcoming: webinars.filter((w: Webinar) => w.status === 'UPCOMING').length,
        totalRegistered: webinars.reduce((sum: number, w: Webinar) => sum + (w.registered || 0), 0),
        avgAttendance: webinars.length > 0 
          ? Math.round(webinars.reduce((sum: number, w: Webinar) => 
              sum + ((w.registered || 0) / w.maxAttendees * 100), 0) / webinars.length)
          : 0,
      };
    } catch (error) {
      console.error('Error fetching webinar stats:', error);
      return { total: 0, upcoming: 0, totalRegistered: 0, avgAttendance: 0 };
    }
  },
};
