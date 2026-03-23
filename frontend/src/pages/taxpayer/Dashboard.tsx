import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  Button, LinearProgress, Avatar, Skeleton, Stack, Chip,
} from '@mui/material';
import {
  School, EmojiEvents, TrendingUp, CheckCircle, PlayArrow,
  MenuBook, ArrowForward, Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';

interface DashboardData {
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  averageProgress: number;
  activeCourses: any[];
}

const TaxpayerDashboard: React.FC<{ user?: any }> = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    averageProgress: 0,
    activeCourses: [],
  });

  useEffect(() => {
    if (user?.id) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      // Try cache first
      const cacheKey = `dashboard_taxpayer_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        const cacheTime = cachedData.timestamp || 0;
        const now = Date.now();
        
        // Use cache if less than 5 minutes old
        if (now - cacheTime < 5 * 60 * 1000) {
          const d = cachedData.data || {};
          setData({
            enrolledCourses: d.enrolledCourses || 0,
            completedCourses: d.completedCourses || 0,
            certificates: d.certificates || 0,
            averageProgress: Math.round(d.averageProgress || 0),
            activeCourses: Array.isArray(d.activeCourses) ? d.activeCourses : [],
          });
          setLoading(false);
        }
      }

      // Fetch fresh data
      const response = await apiClient.get(`/dashboard/user/${user.id}`);
      const freshData = response.data.data || response.data;
      
      const normalized = {
        enrolledCourses: freshData.enrolledCourses || 0,
        completedCourses: freshData.completedCourses || 0,
        certificates: freshData.certificates || 0,
        averageProgress: Math.round(freshData.averageProgress || 0),
        activeCourses: Array.isArray(freshData.activeCourses) ? freshData.activeCourses : [],
      };

      setData(normalized);

      // Update cache
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
    { label: 'Enrolled', value: data.enrolledCourses, icon: <School />, color: '#667eea' },
    { label: 'Completed', value: data.completedCourses, icon: <CheckCircle />, color: '#10B981' },
    { label: 'Certificates', value: data.certificates, icon: <EmojiEvents />, color: '#F59E0B' },
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.fullName || 'Learner'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Continue your learning journey
          </Typography>
        </Box>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: '#667eea',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          {user?.fullName?.charAt(0) || 'U'}
        </Avatar>
      </Box>

      {/* Stats Cards */}
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

      {/* Continue Learning */}
      {data.activeCourses.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Continue Learning
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
                      {course.title || 'Course'}
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
                            bgcolor: '#667eea',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.completedModules || 0} of {course.totalModules || 0} modules completed
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<PlayArrow />}
                      onClick={() => navigate(`/taxpayer/courses/${course.id}`)}
                      sx={{
                        bgcolor: '#667eea',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#5568d3',
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

      {/* Quick Actions */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<MenuBook />}
              onClick={() => navigate('/taxpayer/courses')}
              sx={{
                py: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#e0e0e0',
                '&:hover': {
                  borderColor: '#667eea',
                  bgcolor: '#667eea05',
                },
              }}
            >
              Browse Courses
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<EmojiEvents />}
              onClick={() => navigate('/taxpayer/certificates')}
              sx={{
                py: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#e0e0e0',
                '&:hover': {
                  borderColor: '#F59E0B',
                  bgcolor: '#F59E0B05',
                },
              }}
            >
              My Certificates
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Assessment />}
              onClick={() => navigate('/taxpayer/resources')}
              sx={{
                py: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#e0e0e0',
                '&:hover': {
                  borderColor: '#10B981',
                  bgcolor: '#10B98105',
                },
              }}
            >
              Resources
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/taxpayer/courses')}
              sx={{
                py: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: '#667eea',
                '&:hover': {
                  bgcolor: '#5568d3',
                },
              }}
            >
              Start Learning
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TaxpayerDashboard;
