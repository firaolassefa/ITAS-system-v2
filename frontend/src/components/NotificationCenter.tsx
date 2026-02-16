import { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  MarkEmailRead as ReadIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationsAPI, Notification } from '../api/notifications';

interface NotificationCenterProps {
  userId: number;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ userId }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsAPI.getUserNotifications(userId);
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <SuccessIcon sx={{ color: theme.palette.success.main }} />;
      case 'warning': return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'error': return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      default: return <InfoIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconButton
          onClick={handleClick}
          sx={{
            color: 'inherit',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationIcon />
          </Badge>
        </IconButton>
      </motion.div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            mt: 1,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                startIcon={<ReadIcon />}
                sx={{ textTransform: 'none' }}
              >
                Mark all read
              </Button>
            )}
          </Box>
          {unreadCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
          <AnimatePresence>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No notifications"
                  secondary="You're all caught up!"
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItem
                    sx={{
                      backgroundColor: notification.read 
                        ? 'transparent' 
                        : alpha(theme.palette.primary.main, 0.05),
                      borderLeft: notification.read 
                        ? 'none' 
                        : `3px solid ${theme.palette.primary.main}`,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.action.hover, 0.5),
                      },
                    }}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {notification.title}
                          </Typography>
                          {!notification.read && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.primary.main,
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getTimeAgo(notification.createdAt)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </List>

        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button
              fullWidth
              variant="text"
              onClick={() => {
                handleClose();
                // Navigate to notifications page if exists
              }}
              sx={{ textTransform: 'none' }}
            >
              View All Notifications
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationCenter;