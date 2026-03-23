import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Button, LinearProgress, Avatar, Skeleton, Chip,
} from '@mui/material';
import {
  School, CheckCircle, TrendingUp, Security, PlayArrow,
  MenuBook, Assessment, ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';

interface DashboardData {
  enrolledCourses: number;
  completedCourses: number;
  complianceScore: number;
  averageProgress: number;
  activeCourses: any[];
}

const StaffDashboard: React.FC<{ user?: any }> = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    enrolledCourses: 0,
    completedCourses: 0,
    complianceScore: 0,
    averageProgress: 0,
    activeCourses: [],
  });

  useEffect(() => {
    const currentUser = user || JSON.parse(localStorage.getItem('itas_user') || '{}');
    if (currentUser?.id) {
      loadDashboard(currentUser);
    }
  }, [user]);

  const loadDashboard = async (currentUser: any) => {
    try {
      const cacheKey = `dashboard_staff_${currentUser.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          const d = cachedData.data || {};
          setData({
            enrolledCourses: d.enrolledCourses || 0,
            completedCourses: d.completedCourses || 0,
            complianceScore: Math.round(d.complianceScore || 0),
            averageProgress: Math.round(d.averageProgress || 0),
            activeCourses: Array.isArray(d.activeCourses) ? d.activeCourses : [],
          });
          setLoading(false);
        }
      }

      const response = await apiClient.get(`/dashboard/staff/${currentUser.id}`);
      const freshData = response.data.data || response.data;
      
      const normalized = {
        enrolledCourses: freshData.enrolledCourses || 0,
        completedCourses: freshData.completedCourses || 0,
        complianceScore: Math.round(freshData.complianceScore || 0),
        averageProgress: Math.round(freshData.averageProgress || 0),
        activeCourses: Array.isArray(freshData.activeCourses) ? freshData.activeCourses : [],
      };

      setData(normalized);

      localStorage.setItem(cacheKey, JSON.stringify({
        data: normalized,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Training Courses', value: data.enrolledCourses, icon: <School />, color: '#667eea' },
    { label: 'Completed', value: data.completedCourses, icon: <CheckCircle />, color: '#10B981' },
    { label: 'Compliance', value: `${data.complianceScore}%`, icon: <Security />, color: '#F59E0B' },
    { label: 'Progress', value: `${data.averageProgress}%`, icon: <TrendingUp />, color: '#8B5CF6' },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map(i => (
            <Grid item xs={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  const currentUser = user || JSON.parse(localStorage.getItem('itas_user') || '{}');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome, {currentUser?.fullName || 'Staff Member'}!
          </Typography>
          <Chip label="MOR Staff" color="primary" sx={{ fontWeight: 600 }} />
        </Box>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: '#10B981',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          {currentUser?.fullName?.charAt(0) || 'S'}
        </Avatar>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {data.activeCourses.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Internal Training
          </Typography>
          <Grid container spacing={3}>
            {data.activeCourses.slice(0, 3).map((course: any, index: number) => (
              <Grid item xs={12} md={4} key={course.id || index}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      {course.title || 'Training Course'}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {course.progress || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress || 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#10B981',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<PlayArrow />}
                      onClick={() => navigate(`/staff/training/${course.id}`)}
                      sx={{
                        bgcolor: '#10B981',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#059669',
                        },
                      }}
                    >
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default StaffDashboard;
