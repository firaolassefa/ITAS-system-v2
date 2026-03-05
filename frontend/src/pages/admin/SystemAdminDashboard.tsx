import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  alpha,
  useTheme,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  People,
  Speed,
  AdminPanelSettings,
  Upload,
  VideoCall,
  Assessment,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info,
  School,
  EmojiEvents,
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
      icon: <People />, 
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    { 
      title: 'Active Users', 
      value: (dashboardData.activeUsers || 0).toString(), 
      icon: <Speed />, 
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
    { 
      title: 'Total Courses', 
      value: (dashboardData.totalCourses || 0).toString(), 
      icon: <Assessment />, 
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    },
    { 
      title: 'Total Resources', 
      value: (dashboardData.totalResources || 0).toString(), 
      icon: <Upload />, 
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
  ];

  const quickStats = [
    { label: 'Enrollments', value: dashboardData.totalEnrollments || 0, icon: <School />, color: '#667eea' },
    { label: 'Completed', value: dashboardData.completedCourses || 0, icon: <CheckCircle />, color: '#10B981' },
    { label: 'Active Webinars', value: dashboardData.activeWebinars || 0, icon: <VideoCall />, color: '#8B5CF6' },
    { label: 'Certificates', value: dashboardData.totalCertificates || 0, icon: <EmojiEvents />, color: '#3B82F6' },
  ];

  const recentActivities = dashboardData.recentActivities || [];

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
        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Recent Activity
            </Typography>
            {recentActivities.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Info sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No recent activity to display
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity: any, index: number) => (
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
                          background: `${activity.color || '#667eea'}20`,
                          color: activity.color || '#667eea',
                        }}
                      >
                        {activity.icon || <Info />}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {activity.action || 'Activity'}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {activity.user || 'System'} • {activity.time || 'Recently'}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider sx={{ borderColor: alpha('#fff', 0.05) }} />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemAdminDashboard;
