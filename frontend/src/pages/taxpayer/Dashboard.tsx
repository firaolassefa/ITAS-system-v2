import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Button, LinearProgress, Avatar, Skeleton, Chip,
} from '@mui/material';
import {
  School, EmojiEvents, TrendingUp, CheckCircle, PlayArrow,
  MenuBook, ArrowForward, Assessment, Quiz,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';
import { useThemeMode } from '../../theme/ThemeContext';

const PRIMARY = '#339af0';
const PRIMARY_LIGHT = '#e0f2fe';

interface DashboardData {
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  averageProgress: number;
  activeCourses: any[];
}

const getCourseTypeLabel = (type: string) => {
  if (!type) return null;
  const t = type.toUpperCase();
  if (t === 'PRACTICE') return { label: 'Practice', color: '#10B981', bg: '#d1fae5' };
  if (t === 'EXAM') return { label: 'Exam', color: '#EF4444', bg: '#fee2e2' };
  if (t === 'FINAL_EXAM') return { label: 'Final Exam', color: '#7C3AED', bg: '#ede9fe' };
  return { label: type, color: '#339af0', bg: '#e0f2fe' };
};

const TaxpayerDashboard: React.FC<{ user?: any }> = ({ user }) => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    averageProgress: 0,
    activeCourses: [],
  });

  useEffect(() => {
    if (user?.id) loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      const cacheKey = `dashboard_taxpayer_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 2 * 60 * 1000) {
          setData({
            enrolledCourses: cachedData.enrolledCourses || 0,
            completedCourses: cachedData.completedCourses || 0,
            certificates: cachedData.certificates || 0,
            averageProgress: Math.round(cachedData.averageProgress || 0),
            activeCourses: Array.isArray(cachedData.activeCourses) ? cachedData.activeCourses : [],
          });
          setLoading(false);
          return;
        }
      }
      const response = await apiClient.get(`/dashboard/taxpayer/${user.id}`);
      const freshData = response.data.data || response.data;
      const normalized = {
        enrolledCourses: freshData.enrolledCourses || 0,
        completedCourses: freshData.completedCourses || 0,
        certificates: freshData.certificates || 0,
        averageProgress: Math.round(freshData.averageProgress || 0),
        activeCourses: Array.isArray(freshData.activeCourses) ? freshData.activeCourses : [],
      };
      setData(normalized);
      localStorage.setItem(cacheKey, JSON.stringify({ data: normalized, timestamp: Date.now() }));
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Enrolled Courses', value: data.enrolledCourses, icon: <School />, color: PRIMARY },
    { label: 'Completed', value: data.completedCourses, icon: <CheckCircle />, color: '#10B981' },
    { label: 'Certificates', value: data.certificates, icon: <EmojiEvents />, color: '#F59E0B' },
    { label: 'Avg. Progress', value: `${data.averageProgress}%`, icon: <TrendingUp />, color: '#8B5CF6' },
  ];

  const cardBg = mode === 'light' ? '#ffffff' : '#1e293b';
  const borderColor = mode === 'light' ? '#e2e8f0' : '#334155';

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
      {/* Welcome */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Welcome, {user?.fullName || 'Learner'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ministry of Revenue — Tax Education Platform
          </Typography>
        </Box>
        <Avatar sx={{ width: 56, height: 56, bgcolor: PRIMARY, fontSize: '1.4rem', fontWeight: 700 }}>
          {user?.fullName?.charAt(0) || 'U'}
        </Avatar>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card elevation={0} sx={{ p: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, borderRadius: 2,
              transition: 'all 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' } }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: `${stat.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, mb: 2 }}>
                {stat.icon}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{stat.value}</Typography>
              <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Active Courses */}
      {data.activeCourses.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Continue Learning</Typography>
          <Grid container spacing={3}>
            {data.activeCourses.slice(0, 3).map((course: any, index: number) => {
              const typeInfo = getCourseTypeLabel(course.courseType || course.type);
              return (
                <Grid item xs={12} md={4} key={course.id || index}>
                  <Card elevation={0} sx={{ bgcolor: cardBg, border: `1px solid ${borderColor}`, borderRadius: 2,
                    transition: 'all 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' } }}>
                    <CardContent sx={{ p: 3 }}>
                      {/* Course type badge */}
                      {typeInfo && (
                        <Chip label={typeInfo.label} size="small"
                          sx={{ mb: 1.5, bgcolor: typeInfo.bg, color: typeInfo.color, fontWeight: 700, fontSize: '0.7rem' }} />
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.3 }}>
                        {course.title || 'Course'}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">Progress</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: PRIMARY }}>
                            {course.progress || 0}%
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={course.progress || 0}
                          sx={{ height: 7, borderRadius: 4, bgcolor: borderColor,
                            '& .MuiLinearProgress-bar': { bgcolor: PRIMARY, borderRadius: 4 } }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {course.completedModules || 0} of {course.totalModules || 0} modules completed
                      </Typography>
                      <Button fullWidth variant="contained" endIcon={<PlayArrow />}
                        onClick={() => navigate(`/taxpayer/courses/${course.id}`)}
                        sx={{ bgcolor: PRIMARY, textTransform: 'none', fontWeight: 600, borderRadius: 1.5,
                          '&:hover': { bgcolor: '#1c7ed6' } }}>
                        Continue
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Quick Actions */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Quick Actions</Typography>
        <Grid container spacing={2}>
          {[
            { label: 'Browse Courses', icon: <MenuBook />, path: '/taxpayer/courses', variant: 'outlined' as const },
            { label: 'My Certificates', icon: <EmojiEvents />, path: '/taxpayer/certificates', variant: 'outlined' as const },
            { label: 'Resources', icon: <Assessment />, path: '/taxpayer/resources', variant: 'outlined' as const },
            { label: 'Start Learning', icon: <ArrowForward />, path: '/taxpayer/courses', variant: 'contained' as const },
          ].map((action, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Button fullWidth variant={action.variant}
                startIcon={action.variant === 'outlined' ? action.icon : undefined}
                endIcon={action.variant === 'contained' ? action.icon : undefined}
                onClick={() => navigate(action.path)}
                sx={{ py: 1.8, borderRadius: 2, textTransform: 'none', fontWeight: 600,
                  ...(action.variant === 'contained'
                    ? { bgcolor: PRIMARY, '&:hover': { bgcolor: '#1c7ed6' } }
                    : { borderColor, color: 'text.primary', '&:hover': { borderColor: PRIMARY, bgcolor: PRIMARY_LIGHT } }) }}>
                {action.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default TaxpayerDashboard;

