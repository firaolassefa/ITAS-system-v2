import { useState, useEffect } from 'react';
import { notificationAPI, Notification } from '../api/notifications';

export const useNotifications = (userRole?: string, userId?: number) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!userId || userId <= 0) { setLoading(false); return; }
    try {
      setLoading(true);
      const response = await notificationAPI.getUnread(userRole, userId);
      const data = response.data || response || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId || userId <= 0) return;
    try {
      const response = await notificationAPI.getUnreadCount(userRole, userId);
      const count = response.data || response || 0;
      setUnreadCount(typeof count === 'number' ? count : 0);
    } catch (error: any) {
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
    if ((userRole || userId) && userId && userId > 0) {
      fetchNotifications();
      fetchUnreadCount();
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 120000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
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
