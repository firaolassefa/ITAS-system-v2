import { apiClient } from '../utils/axiosConfig';

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
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  // Get unread notifications by role or userId
  getUnread: async (role?: string, userId?: number) => {
    let url = '/notifications/unread';
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (userId) params.append('userId', userId.toString());
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get unread count by role or userId
  getUnreadCount: async (role?: string, userId?: number) => {
    let url = '/notifications/count';
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (userId) params.append('userId', userId.toString());
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get notifications by role
  getByRole: async (role: string) => {
    const response = await apiClient.get(`/notifications/by-role/${role}`);
    return response.data;
  },

  // Mark as read
  markAsRead: async (id: number) => {
    const response = await apiClient.post(`/notifications/mark-as-read/${id}`, {});
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async (role?: string) => {
    const url = role 
      ? `/notifications/mark-all-read?role=${role}`
      : '/notifications/mark-all-read';
    const response = await apiClient.post(url, {});
    return response.data;
  },

  // Send notification (Communication Officer only)
  send: async (notification: Partial<Notification>) => {
    const response = await apiClient.post('/notifications/send', notification);
    return response.data;
  },

  // Update notification (Communication Officer only)
  update: async (id: number, notification: Partial<Notification>) => {
    const response = await apiClient.put(`/notifications/${id}`, notification);
    return response.data;
  },

  // Delete notification (Communication Officer only)
  delete: async (id: number) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },

  // Get campaign statistics
  getCampaignStats: async () => {
    const response = await apiClient.get('/notifications/campaigns/stats');
    return response.data;
  }
};
