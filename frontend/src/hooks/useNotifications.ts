import { useState, useEffect } from 'react';
import { notificationAPI, Notification } from '../api/notifications';

export const useNotifications = (userRole?: string, userId?: number) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log('Fetching notifications with role:', userRole, 'userId:', userId);
      const response = await notificationAPI.getUnread(userRole, userId);
      console.log('Notifications response:', response);
      const data = response.data || response || [];
      console.log('Parsed notifications data:', data);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      console.error('Error response:', error.response?.data);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      console.log('Fetching unread count with role:', userRole, 'userId:', userId);
      const response = await notificationAPI.getUnreadCount(userRole, userId);
      console.log('Unread count response:', response);
      const count = response.data || response || 0;
      console.log('Parsed count:', count);
      setUnreadCount(typeof count === 'number' ? count : 0);
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      console.error('Error response:', error.response?.data);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationAPI.markAsRead(id);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead(userRole);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  useEffect(() => {
    if (userRole || userId) {
      fetchNotifications();
      fetchUnreadCount();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userRole, userId]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
};
