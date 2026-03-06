import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Avatar, Paper, Chip, alpha, List, ListItem, ListItemText, ListItemAvatar,
} from '@mui/material';
import {
  School, VideoCall, Assessment, People,
  Event, PlayCircle, CheckCircle, TrendingUp,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';

const TrainingAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const cacheKey = `dashboard_TRAINING_ADMIN_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          setData(cachedData.data);
          setLoading(false);
        }
      }

      const response = await apiClient.get('/dashboard/training-admin');
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
    { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: '#8B5CF6', bg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' },
    { label: 'Active Webinars', value: data.upcomingWebinars || 0, icon: <VideoCall />, color: '#10B981', bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
    { label: 'Total Enrollments', value: data.totalEnrollments || 0, icon: <People />, color: '#F59E0B', bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
    { label: 'Completion Rate', value: `${data.completionRate || 0}%`, icon: <CheckCircle />, color: '#06B6D4', bg: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' },
  ];

  const upcomingWebinars = [
    { title: 'Tax Filing Basics', date: 'Today, 2:00 PM', attendees: 45, status: 'starting-soon' },
    { title: 'Advanced Tax Strategies', date: 'Tomorrow, 10:00 AM', attendees: 32, status: 'scheduled' },
    { title: 'Compliance Workshop', date: 'Dec 20, 3:00 PM', attendees: 28, status: 'scheduled' },
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
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Training Control Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user?.fullName || 'Training Admin'} • Manage courses and webinars
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
            }}
          >
            {user?.fullName?.charAt(0) || 'T'}
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
                  transform: 'translateY(-8px) rotate(1deg)',
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

      {/* Upcoming Webinars */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
          border: '1px solid #ddd6fe',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Upcoming Webinars
          </Typography>
          <Chip 
            label={`${upcomingWebinars.length} Scheduled`}
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              fontWeight: 700,
            }}
          />
        </Box>
        <List sx={{ p: 0 }}>
          {upcomingWebinars.map((webinar, index) => (
            <ListItem
              key={index}
              sx={{
                mb: 2,
                p: 3,
                borderRadius: 2,
                background: 'white',
                border: webinar.status === 'starting-soon' ? '2px solid #10B981' : '1px solid #e5e7eb',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateX(8px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background: webinar.status === 'starting-soon' 
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    boxShadow: webinar.status === 'starting-soon'
                      ? '0 4px 16px rgba(16, 185, 129, 0.3)'
                      : '0 4px 16px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  {webinar.status === 'starting-soon' ? <PlayCircle /> : <VideoCall />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {webinar.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Chip 
                      icon={<Event sx={{ fontSize: 16 }} />}
                      label={webinar.date}
                      size="small"
                      sx={{ background: alpha('#8B5CF6', 0.1), color: '#8B5CF6', fontWeight: 600 }}
                    />
                    <Chip 
                      icon={<People sx={{ fontSize: 16 }} />}
                      label={`${webinar.attendees} registered`}
                      size="small"
                      sx={{ background: alpha('#10B981', 0.1), color: '#10B981', fontWeight: 600 }}
                    />
                    {webinar.status === 'starting-soon' && (
                      <Chip 
                        label="Starting Soon"
                        size="small"
                        sx={{ 
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: 'white',
                          fontWeight: 700,
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.7 },
                          },
                        }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default TrainingAdminDashboard;
