import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  Button, Chip, LinearProgress, alpha, Fade, Avatar, CircularProgress,
} from '@mui/material';
import {
  School, EmojiEvents, TrendingUp, Schedule, PlayArrow,
  CheckCircle, MenuBook, VideoLibrary, ArrowForward,
  AutoAwesome, Notifications,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../api/dashboard';

interface Course {
  id: number;
  title: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  thumbnail: string;
  color: string;
}

interface DashboardData {
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  averageProgress: number;
  activeCourses: any[];
  upcomingWebinars: any[];
}

const TaxpayerDashboard: React.FC<{ user?: any }> = ({ user }) => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    averageProgress: 0,
    activeCourses: [],
    upcomingWebinars: [],
  });

  useEffect(() => {
    setMounted(true);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getTaxpayerDashboard(user?.id || 1);
      const data = response.data || response;
      setDashboardData({
        enrolledCourses: data.enrolledCourses || 0,
        completedCourses: data.completedCourses || 0,
        certificates: data.certificates || 0,
        averageProgress: data.averageProgress || 0,
        activeCourses: data.activeCourses || [],
        upcomingWebinars: data.upcomingWebinars || [],
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Courses Enrolled', value: dashboardData.enrolledCourses.toString(), icon: <School />, color: '#667eea' },
    { label: 'Completed', value: dashboardData.completedCourses.toString(), icon: <CheckCircle />, color: '#10B981' },
    { label: 'Certificates', value: dashboardData.certificates.toString(), icon: <EmojiEvents />, color: '#F59E0B' },
    { label: 'Avg Progress', value: `${dashboardData.averageProgress}%`, icon: <TrendingUp />, color: '#8B5CF6' },
  ];

  const activeCourses: Course[] = dashboardData.activeCourses.map((course, index) => ({
    id: course.id || index,
    title: course.title || 'Untitled Course',
    progress: course.progress || 0,
    totalModules: course.totalModules || 0,
    completedModules: course.completedModules || 0,
    thumbnail: ['📊', '💰', '📈', '📚', '💼'][index % 5],
    color: ['#667eea', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5],
  }));

  const upcomingWebinars = dashboardData.upcomingWebinars.map((webinar, index) => ({
    title: webinar.title || 'Untitled Webinar',
    date: webinar.scheduleTime ? new Date(webinar.scheduleTime).toLocaleDateString() : 'TBD',
    time: webinar.scheduleTime ? new Date(webinar.scheduleTime).toLocaleTimeString() : 'TBD',
    color: ['#667eea', '#10B981', '#F59E0B'][index % 3],
  }));

  const recentAchievements = [
    { title: 'Course Completed', desc: 'VAT Fundamentals', icon: '🎓', color: '#10B981' },
    { title: 'Perfect Score', desc: 'Tax Filing Quiz', icon: '⭐', color: '#F59E0B' },
    { title: 'Certificate Earned', desc: 'Basic Taxation', icon: '🏆', color: '#667eea' },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Fade in={mounted} timeout={600}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: alpha('#FFFFFF', 0.1),
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              right: 100,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: alpha('#FFFFFF', 0.08),
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mr: 2,
                  background: alpha('#FFFFFF', 0.2),
                  fontSize: '2rem',
                }}
              >
                👤
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Welcome back, Taxpayer!
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Continue your learning journey
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => navigate('/taxpayer/courses')}
                sx={{
                  background: '#FFFFFF',
                  color: '#667eea',
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  borderRadius: 3,
                  '&:hover': {
                    background: alpha('#FFFFFF', 0.9),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Continue Learning
              </Button>
              <Button
                variant="outlined"
                startIcon={<MenuBook />}
                onClick={() => navigate('/taxpayer/resources')}
                sx={{
                  borderColor: alpha('#FFFFFF', 0.5),
                  color: '#FFFFFF',
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#FFFFFF',
                    background: alpha('#FFFFFF', 0.1),
                  },
                }}
              >
                Browse Resources
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Fade in={mounted} timeout={800 + index * 100}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                  border: '1px solid',
                  borderColor: alpha(stat.color, 0.2),
                  borderRadius: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${alpha(stat.color, 0.2)}`,
                    borderColor: alpha(stat.color, 0.4),
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: 3,
                      background: alpha(stat.color, 0.1),
                      color: stat.color,
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Active Courses */}
        <Grid item xs={12} md={8}>
          <Fade in={mounted} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: '#FFFFFF',
                border: '1px solid',
                borderColor: alpha('#000', 0.08),
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Continue Learning
                </Typography>
                <Button
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/taxpayer/courses')}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              <Grid container spacing={2}>
                {activeCourses.map((course, index) => (
                  <Grid item xs={12} key={course.id}>
                    <Fade in={mounted} timeout={1200 + index * 100}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background: alpha(course.color, 0.05),
                          border: '1px solid',
                          borderColor: alpha(course.color, 0.15),
                          transition: 'all 0.3s',
                          cursor: 'pointer',
                          '&:hover': {
                            background: alpha(course.color, 0.1),
                            borderColor: alpha(course.color, 0.3),
                            transform: 'translateX(8px)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 3,
                              background: alpha(course.color, 0.15),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '2rem',
                              mr: 2,
                            }}
                          >
                            {course.thumbnail}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                              {course.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {course.completedModules} of {course.totalModules} modules completed
                            </Typography>
                          </Box>
                          <Chip
                            label={`${course.progress}%`}
                            sx={{
                              background: alpha(course.color, 0.15),
                              color: course.color,
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            background: alpha(course.color, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: `linear-gradient(90deg, ${course.color} 0%, ${alpha(course.color, 0.7)} 100%)`,
                            },
                          }}
                        />
                      </Paper>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Fade>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Upcoming Webinars */}
          <Fade in={mounted} timeout={1200}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 4,
                background: '#FFFFFF',
                border: '1px solid',
                borderColor: alpha('#000', 0.08),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VideoLibrary sx={{ color: '#667eea', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Upcoming Webinars
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingWebinars.map((webinar, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: alpha(webinar.color, 0.05),
                      border: '1px solid',
                      borderColor: alpha(webinar.color, 0.15),
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        background: alpha(webinar.color, 0.1),
                        borderColor: alpha(webinar.color, 0.3),
                      },
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {webinar.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        icon={<Schedule sx={{ fontSize: 14 }} />}
                        label={webinar.date}
                        size="small"
                        sx={{
                          background: alpha(webinar.color, 0.1),
                          color: webinar.color,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {webinar.time}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Fade>

          {/* Recent Achievements */}
          <Fade in={mounted} timeout={1400}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: '#FFFFFF',
                border: '1px solid',
                borderColor: alpha('#000', 0.08),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AutoAwesome sx={{ color: '#F59E0B', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Achievements
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentAchievements.map((achievement, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      background: alpha(achievement.color, 0.05),
                      border: '1px solid',
                      borderColor: alpha(achievement.color, 0.15),
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: alpha(achievement.color, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        mr: 2,
                      }}
                    >
                      {achievement.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {achievement.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {achievement.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TaxpayerDashboard;
