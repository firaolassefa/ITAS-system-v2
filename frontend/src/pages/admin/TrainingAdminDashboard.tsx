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
  IconButton,
  alpha,
  useTheme,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  School,
  VideoCall,
  Assessment,
  People,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Event,
  PlayCircle,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../api/dashboard';

const TrainingAdminDashboard: React.FC = () => {
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
      const response = await dashboardAPI.getTrainingAdminDashboard();
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
      title: 'Total Courses', 
      value: (dashboardData.totalCourses || 0).toString(), 
      change: '+6', 
      trend: 'up', 
      icon: <School />, 
      color: theme.palette.primary.main,
    },
    { 
      title: 'Active Webinars', 
      value: (dashboardData.upcomingWebinars || 0).toString(), 
      change: '+2', 
      trend: 'up', 
      icon: <VideoCall />, 
      color: theme.palette.success.main,
    },
    { 
      title: 'Total Enrollments', 
      value: (dashboardData.totalEnrollments || 0).toString(), 
      change: '+156', 
      trend: 'up', 
      icon: <People />, 
      color: theme.palette.info.main,
    },
    { 
      title: 'Attendance Rate', 
      value: `${dashboardData.attendanceRate || 0}%`, 
      change: '+5%', 
      trend: 'up', 
      icon: <Assessment />, 
      color: theme.palette.warning.main,
    },
  ];

  const upcomingWebinars = (dashboardData.webinars || []).map((webinar: any) => ({
    title: webinar.title || 'Untitled Webinar',
    date: webinar.scheduleTime ? new Date(webinar.scheduleTime).toLocaleDateString() : 'TBD',
    time: webinar.scheduleTime ? new Date(webinar.scheduleTime).toLocaleTimeString() : 'TBD',
    attendees: webinar.maxAttendees || 0,
    status: webinar.status || 'SCHEDULED',
  }));

  const coursePerformance = [
    { name: 'Tax Filing Basics', enrolled: 245, completed: 198, rate: 81 },
    { name: 'VAT Fundamentals', enrolled: 189, completed: 142, rate: 75 },
    { name: 'Business Taxation', enrolled: 156, completed: 109, rate: 70 },
    { name: 'Income Tax Guide', enrolled: 203, completed: 167, rate: 82 },
  ];

  const quickActions = [
    { label: 'Schedule Webinar', icon: <VideoCall />, path: '/admin/webinar-management', color: 'primary' },
    { label: 'Create Course', icon: <School />, path: '/admin/course-management', color: 'secondary' },
    { label: 'View Reports', icon: <Assessment />, path: '/admin/analytics', color: 'success' },
    { label: 'Manage Enrollments', icon: <People />, path: '/admin/enrollments', color: 'info' },
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
            <School sx={{ fontSize: 40, color: 'primary.main' }} />
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
              Training Control Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage courses, webinars, and track learning progress
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                animation: `scaleIn 0.4s ease-out ${index * 0.1}s both`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      background: alpha(stat.color, 0.1),
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    icon={stat.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                    sx={{
                      background: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      fontWeight: 600,
                      border: 'none',
                    }}
                  />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Webinars */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Upcoming Webinars
              </Typography>
              <Button
                variant="contained"
                startIcon={<VideoCall />}
                onClick={() => navigate('/admin/webinar-management')}
              >
                Schedule New
              </Button>
            </Box>
            <List sx={{ p: 0 }}>
              {upcomingWebinars.map((webinar, index) => (
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
                        background: webinar.status === 'starting-soon' 
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.primary.main, 0.1),
                        color: webinar.status === 'starting-soon' ? 'error.main' : 'primary.main',
                      }}
                    >
                      {webinar.status === 'starting-soon' ? <PlayCircle /> : <Schedule />}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {webinar.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            <Event sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            {webinar.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <People sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            {webinar.attendees} registered
                          </Typography>
                        </Box>
                      }
                    />
                    {webinar.status === 'starting-soon' && (
                      <Chip
                        label="Starting Soon"
                        size="small"
                        color="error"
                        sx={{ animation: 'pulse 2s ease-in-out infinite' }}
                      />
                    )}
                  </ListItem>
                  {index < upcomingWebinars.length - 1 && <Divider sx={{ borderColor: alpha('#fff', 0.05) }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Course Performance */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Course Performance
            </Typography>
            <Grid container spacing={3}>
              {coursePerformance.map((course, index) => (
                <Grid item xs={12} key={index}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {course.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course.completed} of {course.enrolled} completed
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {course.rate}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={course.rate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        background: alpha('#fff', 0.05),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Quick Actions & Stats */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 4, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} key={index}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={action.icon}
                    onClick={() => navigate(action.path)}
                    sx={{
                      py: 2,
                      justifyContent: 'flex-start',
                      borderWidth: 2,
                      borderColor: alpha(theme.palette[action.color as keyof typeof theme.palette].main as string, 0.3),
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: `${action.color}.main`,
                        background: alpha(theme.palette[action.color as keyof typeof theme.palette].main as string, 0.1),
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Today's Schedule */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Today's Schedule
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  2:00 PM - Tax Filing Basics
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  45 attendees registered
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: alpha('#fff', 0.02),
                  border: `1px solid ${alpha('#fff', 0.1)}`,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No more webinars today
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrainingAdminDashboard;
