import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  Button, Chip, alpha, Fade, Zoom, LinearProgress, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Avatar, CircularProgress,
} from '@mui/material';
import {
  TrendingUp, People, School, Assessment, CheckCircle,
  ArrowUpward, ArrowDownward, Timeline, Speed, EmojiEvents,
} from '@mui/icons-material';
import { dashboardAPI } from '../../api/dashboard';

const ManagerDashboard: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({});
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    setMounted(true);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getManagerDashboard();
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
    { label: 'Total Users', value: (dashboardData.totalUsers || 0).toString(), icon: <People />, color: '#667eea', change: '+18%', trend: 'up' },
    { label: 'Active Courses', value: (dashboardData.totalCourses || 0).toString(), icon: <School />, color: '#10B981', change: '+12%', trend: 'up' },
    { label: 'Completion Rate', value: `${dashboardData.completionRate || 0}%`, icon: <CheckCircle />, color: '#F59E0B', change: '+5%', trend: 'up' },
    { label: 'Active Users', value: (dashboardData.activeUsers || 0).toString(), icon: <Assessment />, color: '#8B5CF6', change: '+8%', trend: 'up' },
  ];

  const coursePerformance = (dashboardData.coursePerformance || []).map((course: any, index: number) => ({
    name: course.title || 'Untitled Course',
    enrolled: 100,
    completed: 80,
    avgScore: 85,
    completionRate: 80,
    color: ['#667eea', '#10B981', '#F59E0B', '#8B5CF6'][index % 4],
  }));

  const recentActivity = [
    { user: 'John Doe', action: 'Completed', course: 'Tax Filing Basics', time: '2 hours ago', color: '#10B981' },
    { user: 'Jane Smith', action: 'Enrolled', course: 'VAT Fundamentals', time: '3 hours ago', color: '#667eea' },
    { user: 'Mike Johnson', action: 'Passed Assessment', course: 'Income Tax Advanced', time: '5 hours ago', color: '#F59E0B' },
    { user: 'Sarah Williams', action: 'Started', course: 'Corporate Tax', time: '6 hours ago', color: '#8B5CF6' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in={mounted} timeout={600}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Manager Dashboard
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Monitor performance and track key metrics
              </Typography>
            </Box>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Fade>

      {/* Stats Cards - Smaller and More Compact */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Zoom in={mounted} timeout={600 + index * 100}>
              <Card
                elevation={0}
                sx={{
                  position: 'relative',
                  overflow: 'visible',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `cardFloat 3s ease-in-out ${index * 0.2}s infinite`,
                  '@keyframes cardFloat': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                  },
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: `0 20px 40px ${stat.color}30`,
                    borderColor: stat.color,
                    '& .stat-icon': {
                      transform: 'scale(1.15) rotate(5deg)',
                      background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                    },
                    '& .stat-value': {
                      transform: 'scale(1.08)',
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
                        background: `${stat.color}15`,
                        color: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: `0 4px 12px ${stat.color}20`,
                      }}
                    >
                      {React.cloneElement(stat.icon, { sx: { fontSize: 22 } })}
                    </Box>
                    <Chip
                      icon={stat.trend === 'up' ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
                      label={stat.change}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: stat.trend === 'up' 
                          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                        color: 'white',
                        border: 'none',
                        boxShadow: stat.trend === 'up'
                          ? '0 2px 8px rgba(16, 185, 129, 0.3)'
                          : '0 2px 8px rgba(239, 68, 68, 0.3)',
                        '& .MuiChip-icon': { color: 'white' },
                      }}
                    />
                  </Box>
                  <Typography 
                    className="stat-value"
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800, 
                      mb: 0.5,
                      background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Course Performance */}
        <Grid item xs={12} lg={8}>
          <Fade in={mounted} timeout={1000}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'white',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                animation: 'fadeInUp 0.8s ease-out',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(30px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <Timeline />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Course Performance
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f9fafb' }}>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Course</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>Enrolled</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>Completed</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>Avg Score</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coursePerformance.map((course, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:hover': { background: '#f9fafb' },
                          animation: `slideIn 0.5s ease ${index * 0.1}s both`,
                          '@keyframes slideIn': {
                            from: { opacity: 0, transform: 'translateX(-20px)' },
                            to: { opacity: 1, transform: 'translateX(0)' },
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 40,
                                borderRadius: 2,
                                background: `linear-gradient(180deg, ${course.color} 0%, ${course.color}dd 100%)`,
                              }}
                            />
                            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {course.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {course.enrolled.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 600, color: course.color }}>
                            {course.completed.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${course.avgScore}%`}
                            size="small"
                            sx={{
                              background: `${course.color}15`,
                              color: course.color,
                              fontWeight: 700,
                              border: `1px solid ${course.color}30`,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', minWidth: 40 }}>
                              {course.completionRate}%
                            </Typography>
                            <Box
                              sx={{
                                width: 80,
                                height: 8,
                                background: '#e5e7eb',
                                borderRadius: 4,
                                overflow: 'hidden',
                                position: 'relative',
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${course.completionRate}%`,
                                  height: '100%',
                                  background: `linear-gradient(90deg, ${course.color} 0%, ${course.color}dd 100%)`,
                                  borderRadius: 4,
                                  animation: 'progressFill 1.5s ease-out',
                                  '@keyframes progressFill': {
                                    from: { width: 0 },
                                  },
                                }}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Fade>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Fade in={mounted} timeout={1200}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'white',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                animation: 'fadeInRight 0.8s ease-out',
                '@keyframes fadeInRight': {
                  from: { opacity: 0, transform: 'translateX(30px)' },
                  to: { opacity: 1, transform: 'translateX(0)' },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    display: 'flex',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <Speed />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Recent Activity
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivity.map((activity, index) => (
                  <Zoom in={mounted} timeout={800 + index * 150} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderLeft: `4px solid ${activity.color}`,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateX(8px)',
                          background: 'white',
                          boxShadow: `0 8px 20px ${activity.color}20`,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            background: `linear-gradient(135deg, ${activity.color} 0%, ${activity.color}dd 100%)`,
                            fontSize: '0.9rem',
                            fontWeight: 700,
                          }}
                        >
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>
                            {activity.user}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ ml: 5.5 }}>
                        <Chip
                          label={activity.action}
                          size="small"
                          sx={{
                            background: `${activity.color}15`,
                            color: activity.color,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: 22,
                            mb: 0.5,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                          {activity.course}
                        </Typography>
                      </Box>
                    </Paper>
                  </Zoom>
                ))}
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManagerDashboard;
