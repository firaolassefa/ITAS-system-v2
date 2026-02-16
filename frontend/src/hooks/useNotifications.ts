import { useState, useEffect } from 'react';
import { notificationAPI, Notification } from '../api/notifications';

export const useNotifications = (userRole?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getUnread(userRole);
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount(userRole);
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
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
    if (userRole) {
      fetchNotifications();
      fetchUnreadCount();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userRole]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
};
