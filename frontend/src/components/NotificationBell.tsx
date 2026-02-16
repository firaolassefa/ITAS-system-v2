import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationBellProps {
  userRole?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(userRole);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: any) => {
    await markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    handleClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: { 
            maxHeight: 500, 
            width: 400,
            maxWidth: '90vw'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </Box>
        <Divider />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <MenuItem 
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{ 
                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                whiteSpace: 'normal',
                py: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.selected'
                }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    {!notification.read && (
                      <CircleIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                    )}
                    <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                      {notification.title}
                    </Typography>
                  </Box>
                  <Chip 
                    label={notification.priority} 
                    size="small" 
                    color={getPriorityColor(notification.priority) as any}
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(notification.createdAt)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
        
        {notifications.length > 10 && (
          <>
            <Divider />
            <MenuItem onClick={() => { navigate('/notifications'); handleClose(); }}>
              <Typography variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%' }}>
                View all notifications
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
