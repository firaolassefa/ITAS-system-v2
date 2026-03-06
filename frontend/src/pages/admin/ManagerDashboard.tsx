import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Avatar, Paper, Chip, alpha, LinearProgress,
} from '@mui/material';
import {
  People, TrendingUp, School, Assessment,
  BarChart, Speed, EmojiEvents, CheckCircle,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';

const ManagerDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const cacheKey = `dashboard_MANAGER_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          setData(cachedData.data);
          setLoading(false);
        }
      }

      const response = await apiClient.get('/dashboard/manager');
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
    { label: 'Total Users', value: data.totalUsers || 0, icon: <People />, color: '#667eea', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { label: 'Active Users', value: data.activeUsers || 0, icon: <TrendingUp />, color: '#10B981', bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
    { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: '#F59E0B', bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
    { label: 'Completion Rate', value: `${data.completionRate || 0}%`, icon: <CheckCircle />, color: '#06B6D4', bg: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' },
  ];

  const performanceMetrics = [
    { label: 'User Engagement', value: 85, color: '#10B981', icon: <Speed /> },
    { label: 'Course Quality', value: 92, color: '#667eea', icon: <EmojiEvents /> },
    { label: 'System Performance', value: 78, color: '#F59E0B', icon: <BarChart /> },
    { label: 'User Satisfaction', value: 88, color: '#8B5CF6', icon: <Assessment /> },
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Management Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user?.fullName || 'Manager'} • Monitor performance and track metrics
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            }}
          >
            {user?.fullName?.charAt(0) || 'M'}
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
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 20px 40px ${alpha(stat.color, 0.25)}`,
                  borderColor: stat.color,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
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

      {/* Performance Metrics */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          border: '1px solid #e5e7eb',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
          Performance Metrics
        </Typography>
        <Grid container spacing={3}>
          {performanceMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: 'white',
                  border: `2px solid ${alpha(metric.color, 0.2)}`,
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: metric.color,
                    transform: 'scale(1.03)',
                    boxShadow: `0 8px 24px ${alpha(metric.color, 0.2)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: alpha(metric.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: metric.color,
                      }}
                    >
                      {metric.icon}
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {metric.label}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${metric.value}%`}
                    sx={{
                      background: `linear-gradient(135deg, ${metric.color} 0%, ${alpha(metric.color, 0.8)} 100%)`,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      height: 36,
                      minWidth: 70,
                    }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={metric.value}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    background: alpha(metric.color, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: `linear-gradient(90deg, ${metric.color} 0%, ${alpha(metric.color, 0.7)} 100%)`,
                      boxShadow: `0 2px 8px ${alpha(metric.color, 0.3)}`,
                    },
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ManagerDashboard;
