import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Avatar,
  AvatarGroup,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Settings,
  People,
  Security,
  Storage,
  Speed,
  AdminPanelSettings,
  Upload,
  Notifications,
  VideoCall,
  Assessment,
  TrendingUp,
  TrendingDown,
  MoreVert,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EnhancedSystemAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { 
      title: 'Total Users', 
      value: '1,245', 
      change: '+12.5%', 
      trend: 'up', 
      icon: <People />, 
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    },
    { 
      title: 'Active Sessions', 
      value: '892', 
      change: '+8.2%', 
      trend: 'up', 
      icon: <Speed />, 
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    },
    { 
      title: 'System Health', 
      value: '99.8%', 
      change: '+0.3%', 
      trend: 'up', 
      icon: <Security />, 
      color: theme.palette.info.main,
      gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
    },
    { 
      title: 'Storage Used', 
      value: '65%', 
      change: '+5.1%', 
      trend: 'up', 
      icon: <Storage />, 
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
    },
  ];

  const quickStats = [
    { label: 'Total Courses', value: 42, icon: <Assessment />, color: 'primary' },
    { label: 'Resources', value: 156, icon: <Upload />, color: 'secondary' },
    { label: 'Active Webinars', value: 5, icon: <VideoCall />, color: 'success' },
    { label: 'Notifications', value: 3, icon: <Notifications />, color: 'info' },
  ];

  const recentActivities = [
    { action: 'New user registered', user: 'john.doe@example.com', time: '5 minutes ago', type: 'success', icon: <CheckCircle /> },
    { action: 'Course published', user: 'contentadmin', time: '1 hour ago', type: 'info', icon: <Info /> },
    { action: 'System warning', user: 'System', time: '2 hours ago', type: 'warning', icon: <Warning /> },
    { action: 'Webinar scheduled', user: 'trainingadmin', time: '3 hours ago', type: 'success', icon: <CheckCircle /> },
    { action: 'Failed login attempt', user: 'unknown', time: '4 hours ago', type: 'error', icon: <ErrorIcon /> },
  ];

  const systemMetrics = [
    { label: 'CPU Usage', value: 45, color: 'primary' },
    { label: 'Memory', value: 68, color: 'secondary' },
    { label: 'Disk I/O', value: 32, color: 'success' },
    { label: 'Network', value: 78, color: 'info' },
  ];

  const quickActions = [
    { label: 'Manage Users', icon: <People />, path: '/admin/user-role-management', color: 'primary' },
    { label: 'Analytics', icon: <Assessment />, path: '/admin/analytics', color: 'secondary' },
    { label: 'Upload Resource', icon: <Upload />, path: '/admin/upload-resource', color: 'success' },
    { label: 'Webinars', icon: <VideoCall />, path: '/admin/webinar-management', color: 'info' },
    { label: 'Notifications', icon: <Notifications />, path: '/admin/notification-center', color: 'warning' },
    { label: 'Settings', icon: <Settings />, path: '/admin/system-settings', color: 'error' },
  ];

  return (
    <Box sx={{ animation: 'fadeIn 0.6s ease-out' }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
              mr: 3,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <AdminPanelSettings sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2563EB 0%, #8B5CF6 50%, #22D3EE 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              System Control Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Full system access and monitoring • Real-time insights
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                animation: `scaleIn 0.4s ease-out ${index * 0.1}s both`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: stat.gradient,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      background: alpha(stat.color, 0.1),
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    icon={stat.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                    sx={{
                      background: alpha(stat.trend === 'up' ? theme.palette.success.main : theme.palette.error.main, 0.1),
                      color: stat.trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
                      fontWeight: 600,
                      border: 'none',
                    }}
                  />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                background: alpha('#fff', 0.03),
                border: `1px solid ${alpha('#fff', 0.1)}`,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px ${alpha(theme.palette[stat.color as keyof typeof theme.palette].main as string, 0.2)}`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 3,
                  background: alpha(theme.palette[stat.color as keyof typeof theme.palette].main as string, 0.1),
                  color: `${stat.color}.main`,
                  mb: 2,
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* System Metrics */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                System Performance
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>
            
            <Grid container spacing={3}>
              {systemMetrics.map((metric, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {metric.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {metric.value}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={metric.value}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        background: alpha('#fff', 0.05),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${theme.palette[metric.color as keyof typeof theme.palette].main} 0%, ${theme.palette[metric.color as keyof typeof theme.palette].light} 100%)`,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Recent Activity */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Recent Activity
            </Typography>
            <List sx={{ p: 0 }}>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 2,
                      '&:hover': {
                        background: alpha('#fff', 0.02),
                        borderRadius: 2,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        mr: 2,
                        background: alpha(
                          theme.palette[activity.type as keyof typeof theme.palette].main as string,
                          0.1
                        ),
                        color: `${activity.type}.main`,
                      }}
                    >
                      {activity.icon}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {activity.action}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {activity.user} • {activity.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider sx={{ borderColor: alpha('#fff', 0.05) }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 4, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(action.path)}
                    sx={{
                      py: 3,
                      flexDirection: 'column',
                      gap: 1,
                      borderWidth: 2,
                      borderColor: alpha(theme.palette[action.color as keyof typeof theme.palette].main as string, 0.3),
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: `${action.color}.main`,
                        background: alpha(theme.palette[action.color as keyof typeof theme.palette].main as string, 0.1),
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box sx={{ color: `${action.color}.main` }}>
                      {action.icon}
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {action.label}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Team */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Active Administrators
            </Typography>
            <AvatarGroup max={5} sx={{ justifyContent: 'flex-start', mb: 2 }}>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((letter, index) => (
                <Avatar
                  key={index}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  }}
                >
                  {letter}
                </Avatar>
              ))}
            </AvatarGroup>
            <Typography variant="body2" color="text.secondary">
              6 administrators online
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedSystemAdminDashboard;
