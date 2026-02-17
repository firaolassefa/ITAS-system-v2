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

export interface Notification {
  id: number;
  title: string;
  message: string;
  link?: string;
  notificationType: 'EMAIL' | 'SMS' | 'IN_APP' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  targetAudience: string;
  role: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
  read: boolean;
  readAt?: string;
  sentCount: number;
  openedCount: number;
  createdAt: string;
}

export const notificationAPI = {
  // Get all notifications
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/notifications`, getAuthHeaders());
    return response.data;
  },

  // Get unread notifications by role
  getUnread: async (role?: string) => {
    const url = role 
      ? `${API_BASE_URL}/notifications/unread?role=${role}`
      : `${API_BASE_URL}/notifications/unread`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  },

  // Get unread count by role
  getUnreadCount: async (role?: string) => {
    const url = role 
      ? `${API_BASE_URL}/notifications/count?role=${role}`
      : `${API_BASE_URL}/notifications/count`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  },

  // Get notifications by role
  getByRole: async (role: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/notifications/by-role/${role}`, 
      getAuthHeaders()
    );
    return response.data;
  },

  // Mark as read
  markAsRead: async (id: number) => {
    const response = await axios.post(
      `${API_BASE_URL}/notifications/mark-as-read/${id}`,
      {},
      getAuthHeaders()
    );
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async (role?: string) => {
    const url = role 
      ? `${API_BASE_URL}/notifications/mark-all-read?role=${role}`
      : `${API_BASE_URL}/notifications/mark-all-read`;
    const response = await axios.post(url, {}, getAuthHeaders());
    return response.data;
  },

  // Send notification (Communication Officer only)
  send: async (notification: Partial<Notification>) => {
    const response = await axios.post(
      `${API_BASE_URL}/notifications/send`,
      notification,
      getAuthHeaders()
    );
    return response.data;
  },

  // Update notification (Communication Officer only)
  update: async (id: number, notification: Partial<Notification>) => {
    const response = await axios.put(
      `${API_BASE_URL}/notifications/${id}`,
      notification,
      getAuthHeaders()
    );
    return response.data;
  },

  // Delete notification (Communication Officer only)
  delete: async (id: number) => {
    const response = await axios.delete(
      `${API_BASE_URL}/notifications/${id}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get campaign statistics
  getCampaignStats: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/notifications/campaigns/stats`,
      getAuthHeaders()
    );
    return response.data;
  }
};
