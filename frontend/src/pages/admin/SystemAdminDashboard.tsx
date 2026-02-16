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
  IconButton,
  alpha,
  useTheme,
  CircularProgress,
  Container,
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
import { dashboardAPI } from '../../api/dashboard';

const SystemAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({});

  useEffect(() => {
    setMounted(true);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getSystemAdminDashboard();
      setDashboardData(response.data || response);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  const stats = [
    { 
      title: 'Total Users', 
      value: (dashboardData.totalUsers || 0).toString(), 
      change: '+12.5%', 
      trend: 'up', 
      icon: <People />, 
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    { 
      title: 'Active Users', 
      value: (dashboardData.activeUsers || 0).toString(), 
      change: '+8.2%', 
      trend: 'up', 
      icon: <Speed />, 
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
    { 
      title: 'System Health', 
      value: '99.8%', 
      change: '+0.3%', 
      trend: 'up', 
      icon: <Security />, 
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    },
    { 
      title: 'Storage Used', 
      value: '65%', 
      change: '+5.1%', 
      trend: 'up', 
      icon: <Storage />, 
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
  ];

  const quickStats = [
    { label: 'Total Courses', value: 42, icon: <Assessment />, color: '#667eea' },
    { label: 'Resources', value: 156, icon: <Upload />, color: '#8B5CF6' },
    { label: 'Active Webinars', value: 5, icon: <VideoCall />, color: '#10B981' },
    { label: 'Notifications', value: 3, icon: <Notifications />, color: '#3B82F6' },
  ];

  const recentActivities = [
    { action: 'New user registered', user: 'john.doe@example.com', time: '5 minutes ago', type: 'success', icon: <CheckCircle />, color: '#10B981' },
    { action: 'Course published', user: 'contentadmin', time: '1 hour ago', type: 'info', icon: <Info />, color: '#3B82F6' },
    { action: 'System warning', user: 'System', time: '2 hours ago', type: 'warning', icon: <Warning />, color: '#F59E0B' },
    { action: 'Webinar scheduled', user: 'trainingadmin', time: '3 hours ago', type: 'success', icon: <CheckCircle />, color: '#10B981' },
    { action: 'Failed login attempt', user: 'unknown', time: '4 hours ago', type: 'error', icon: <ErrorIcon />, color: '#EF4444' },
  ];

  const systemMetrics = [
    { label: 'CPU Usage', value: 45, color: '#667eea' },
    { label: 'Memory', value: 68, color: '#8B5CF6' },
    { label: 'Disk I/O', value: 32, color: '#10B981' },
    { label: 'Network', value: 78, color: '#3B82F6' },
  ];

  const quickActions = [
    { label: 'Manage Users', icon: <People />, path: '/admin/user-role-management', color: '#667eea' },
    { label: 'Analytics', icon: <Assessment />, path: '/admin/analytics', color: '#8B5CF6' },
    { label: 'Upload Resource', icon: <Upload />, path: '/admin/upload-resource', color: '#10B981' },
    { label: 'Webinars', icon: <VideoCall />, path: '/admin/webinar-management', color: '#3B82F6' },
    { label: 'Notifications', icon: <Notifications />, path: '/admin/notification-center', color: '#F59E0B' },
    { label: 'Settings', icon: <Settings />, path: '/admin/system-settings', color: '#EF4444' },
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
                overflow: 'visible',
                background: 'white',
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `scaleIn 0.4s ease-out ${index * 0.1}s both`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: stat.gradient,
                  borderRadius: '16px 16px 0 0',
                },
                '&:hover': {
                  transform: 'translateY(-12px) scale(1.02)',
                  boxShadow: `0 20px 40px ${stat.color}40`,
                  '& .stat-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                  '& .stat-value': {
                    transform: 'scale(1.05)',
                  },
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    className="stat-icon"
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      background: stat.gradient,
                      color: 'white',
                      boxShadow: `0 6px 20px ${stat.color}40`,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { fontSize: 24 } })}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    icon={stat.trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                    sx={{
                      background: stat.trend === 'up' 
                        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      border: 'none',
                      height: 24,
                      boxShadow: stat.trend === 'up'
                        ? '0 3px 10px rgba(16, 185, 129, 0.3)'
                        : '0 3px 10px rgba(239, 68, 68, 0.3)',
                      '& .MuiChip-icon': {
                        color: 'white',
                      },
                    }}
                  />
                </Box>
                <Typography 
                  className="stat-value"
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 0.5,
                    background: stat.gradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
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
                background: `${stat.color}10`,
                border: `1px solid ${stat.color}30`,
                borderRadius: '16px',
                transition: 'all 0.3s',
                animation: `scaleIn 0.4s ease-out ${index * 0.1}s both`,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px ${stat.color}40`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 3,
                  background: `${stat.color}20`,
                  color: stat.color,
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
                        background: `${metric.color}20`,
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}CC 100%)`,
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
                        background: `${activity.color}20`,
                        color: activity.color,
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
          <Paper sx={{ p: 4 }}>
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
                      borderColor: `${action.color}50`,
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: action.color,
                        background: `${action.color}10`,
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${action.color}40`,
                      },
                    }}
                  >
                    <Box sx={{ color: action.color }}>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemAdminDashboard;
