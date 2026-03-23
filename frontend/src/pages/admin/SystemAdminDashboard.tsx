import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Avatar, Paper, LinearProgress, Chip, alpha,
} from '@mui/material';
import {
  People, TrendingUp, School, CloudUpload, Security,
  Speed, CheckCircle, Warning,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';
import { useThemeMode } from '../../theme/ThemeContext';

const SystemAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const { mode } = useThemeMode();
  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const cacheKey = `dashboard_SYSTEM_ADMIN_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          setData(cachedData.data || {});
          setLoading(false);
        }
      }

      const response = await apiClient.get('/dashboard/system-admin');
      const freshData = response.data.data || response.data;
      
      setData(freshData);
      localStorage.setItem(cacheKey, JSON.stringify({
        data: freshData,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  const stats = [
    { 
      label: 'Total Users', 
      value: data.totalUsers || 0, 
      icon: <People />, 
      color: mode === 'light' ? '#667eea' : '#3b82f6', 
      bg: mode === 'light' 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
    },
    { label: 'Active Users', value: data.activeUsers || 0, icon: <TrendingUp />, color: '#10B981', bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
    { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: '#F59E0B', bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
    { label: 'Resources', value: data.totalResources || 0, icon: <CloudUpload />, color: '#8B5CF6', bg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' },
  ];

  const systemHealth = [
    { label: 'System Uptime', value: '99.9%', icon: <Speed />, color: '#10B981' },
    { label: 'Active Sessions', value: data.activeUsers || 0, icon: <People />, color: mode === 'light' ? '#667eea' : '#3b82f6' },
    { label: 'Security Status', value: 'Secure', icon: <Security />, color: '#10B981' },
    { label: 'Pending Tasks', value: data.pendingTasks || 0, icon: <Warning />, color: '#F59E0B' },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              System Control Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user?.fullName || 'Administrator'} • Full system access
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: mode === 'light'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            }}
          >
            {user?.fullName?.charAt(0) || 'A'}
          </Avatar>
        </Box>
      </Box>

      {/* Main Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                background: mode === 'light' ? 'white' : '#1e293b',
                border: `1px solid ${mode === 'light' ? '#e5e7eb' : '#334155'}`,
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px ${alpha(stat.color, 0.2)}`,
                  borderColor: stat.color,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: stat.bg,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background: stat.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: `0 8px 24px ${alpha(stat.color, 0.3)}`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* System Health */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: mode === 'light'
            ? 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
            : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          border: `1px solid ${mode === 'light' ? '#e5e7eb' : '#334155'}`,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
          System Health Monitor
        </Typography>
        <Grid container spacing={3}>
          {systemHealth.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: mode === 'light' ? 'white' : '#1e293b',
                  border: `2px solid ${alpha(item.color, 0.2)}`,
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: item.color,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: alpha(item.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: item.color }}>
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default SystemAdminDashboard;
