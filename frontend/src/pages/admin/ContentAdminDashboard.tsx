import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Avatar, Paper, Chip, alpha, LinearProgress,
} from '@mui/material';
import {
  CloudUpload, TrendingUp, Assessment, School,
  Folder, CheckCircle, Schedule, Visibility,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';
import { useThemeMode } from '../../theme/ThemeContext';

const ContentAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const { mode } = useThemeMode();
  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const cacheKey = `dashboard_CONTENT_ADMIN_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          setData(cachedData.data);
          setLoading(false);
        }
      }

      const response = await apiClient.get('/dashboard/content-admin');
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
      label: 'Total Resources', 
      value: data.totalResources || 0, 
      icon: <Folder />, 
      color: mode === 'light' ? '#F59E0B' : '#fbbf24', 
      bg: mode === 'light' 
        ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
        : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' 
    },
    { label: 'Published Today', value: data.publishedToday || 0, icon: <TrendingUp />, color: '#10B981', bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
    { label: 'Pending Approval', value: data.pendingApproval || 0, icon: <Schedule />, color: '#EF4444', bg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' },
    { label: 'Total Views', value: data.totalViews || 0, icon: <Visibility />, color: '#8B5CF6', bg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' },
  ];

  const contentStats = [
    { type: 'PDF Documents', count: data.pdfCount || 0, percentage: 45, color: '#EF4444' },
    { type: 'Video Content', count: data.videoCount || 0, percentage: 30, color: '#8B5CF6' },
    { type: 'Images', count: data.imageCount || 0, percentage: 15, color: '#10B981' },
    { type: 'Other Files', count: data.otherCount || 0, percentage: 10, color: '#F59E0B' },
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
                  ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                  : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Content Management Studio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user?.fullName || 'Content Admin'} • Manage all educational content
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: mode === 'light'
                ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
            }}
          >
            {user?.fullName?.charAt(0) || 'C'}
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

      {/* Content Distribution */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: mode === 'light'
            ? 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)'
            : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          border: `1px solid ${mode === 'light' ? '#fde68a' : '#334155'}`,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
          Content Distribution
        </Typography>
        <Grid container spacing={3}>
          {contentStats.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: mode === 'light' ? 'white' : '#1e293b',
                  border: `2px solid ${alpha(item.color, 0.2)}`,
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: item.color,
                    transform: 'translateX(8px)',
                    boxShadow: `0 8px 24px ${alpha(item.color, 0.2)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {item.type}
                  </Typography>
                  <Chip 
                    label={`${item.count} files`}
                    size="small"
                    sx={{
                      background: alpha(item.color, 0.1),
                      color: item.color,
                      fontWeight: 700,
                      border: `1px solid ${alpha(item.color, 0.3)}`,
                    }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.percentage}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    background: alpha(item.color, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      background: `linear-gradient(90deg, ${item.color} 0%, ${alpha(item.color, 0.7)} 100%)`,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {item.percentage}% of total content
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ContentAdminDashboard;
