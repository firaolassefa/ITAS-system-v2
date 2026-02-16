import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  SelectChangeEvent, Chip, Button, Fade, Zoom, CircularProgress, Alert, Card, CardContent,
} from '@mui/material';
import {
  TrendingUp as TrendIcon,
  People as UsersIcon,
  School as CourseIcon,
  Download as DownloadIcon,
  BarChart as ChartIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { analyticsApi } from '../../api/analytics';

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [startDate, setStartDate] = useState<Date | null>(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [overviewStats, setOverviewStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    courseEnrollments: 0,
    completionRate: 0,
  });
  
  const [topCourses, setTopCourses] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load overview stats
      const stats = await analyticsApi.getOverviewStats();
      setOverviewStats({
        totalUsers: stats.totalUsers || 0,
        activeUsers: stats.activeUsers || 0,
        courseEnrollments: stats.courseEnrollments || 0,
        completionRate: stats.completionRate || 0,
      });
      
      // Load top courses
      const courses = await analyticsApi.getTopCourses();
      setTopCourses(courses);
      
    } catch (err: any) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const userEngagement = [
    { category: 'VAT', activeUsers: 456, avgTime: '45 min', completionRate: 72 },
    { category: 'Income Tax', activeUsers: 389, avgTime: '38 min', completionRate: 65 },
    { category: 'Corporate Tax', activeUsers: 234, avgTime: '52 min', completionRate: 82 },
    { category: 'TCC', activeUsers: 187, avgTime: '41 min', completionRate: 76 },
  ];

  const resourceStats = [
    { type: 'PDF', count: 28, downloads: 2345, avgRating: 4.5, color: '#EF4444' },
    { type: 'Video', count: 12, downloads: 1567, avgRating: 4.7, color: '#8B5CF6' },
    { type: 'Article', count: 8, downloads: 876, avgRating: 4.3, color: '#10B981' },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minHeight: '100vh', background: '#ffffff', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Fade in timeout={800}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                    Analytics Dashboard
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Comprehensive insights and performance metrics
                  </Typography>
                </Box>
                <Button variant="contained" startIcon={<DownloadIcon />}
                  sx={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', px: 3, py: 1.5, fontWeight: 600,
                    '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }
                  }}>
                  Export Report
                </Button>
              </Box>

              {/* Filters */}
              <Paper sx={{ p: 3, mb: 3, background: 'white', border: '1px solid #e5e7eb', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Date Range</InputLabel>
                      <Select value={dateRange} label="Date Range" onChange={(e: SelectChangeEvent) => setDateRange(e.target.value as any)}>
                        <MenuItem value="week">Last 7 Days</MenuItem>
                        <MenuItem value="month">Last 30 Days</MenuItem>
                        <MenuItem value="quarter">Last Quarter</MenuItem>
                        <MenuItem value="year">Last Year</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DatePicker label="Start Date" value={startDate} onChange={setStartDate} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DatePicker label="End Date" value={endDate} onChange={setEndDate} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button variant="contained" fullWidth onClick={loadAnalytics}
                      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 600,
                        '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' }
                      }}>
                      Apply Filters
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Fade>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
          ) : (
            <>
              {/* Overview Stats - Enhanced with Animations */}
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {[
                  { label: 'Total Users', value: overviewStats.totalUsers, change: '+12%', icon: <UsersIcon />, color: '#667eea', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                  { label: 'Active Users', value: overviewStats.activeUsers, change: '72% rate', icon: <CheckIcon />, color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
                  { label: 'Enrollments', value: overviewStats.courseEnrollments, change: '+8%', icon: <CourseIcon />, color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
                  { label: 'Completion', value: `${overviewStats.completionRate}%`, change: '+5%', icon: <TrendIcon />, color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' },
                ].map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Zoom in timeout={600 + index * 100}>
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
                          animation: `cardFloat 3s ease-in-out ${index * 0.3}s infinite`,
                          '@keyframes cardFloat': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-10px)' },
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: stat.gradient,
                            borderRadius: '12px 12px 0 0',
                          },
                          '&:hover': {
                            transform: 'translateY(-15px) scale(1.03)',
                            boxShadow: `0 25px 50px ${stat.color}30`,
                            borderColor: stat.color,
                            '& .stat-icon': {
                              transform: 'scale(1.2) rotate(10deg)',
                              background: stat.gradient,
                            },
                            '& .stat-value': {
                              transform: 'scale(1.1)',
                            },
                            '& .stat-glow': {
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        <Box
                          className="stat-glow"
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '200%',
                            height: '200%',
                            background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
                            opacity: 0,
                            transition: 'opacity 0.4s ease',
                            pointerEvents: 'none',
                          }}
                        />
                        <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
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
                              label={stat.change}
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                background: stat.gradient,
                                color: 'white',
                                border: 'none',
                                boxShadow: `0 2px 8px ${stat.color}30`,
                                animation: 'pulse 2s ease-in-out infinite',
                                '@keyframes pulse': {
                                  '0%, 100%': { transform: 'scale(1)' },
                                  '50%': { transform: 'scale(1.05)' },
                                },
                              }}
                            />
                          </Box>
                          <Typography 
                            className="stat-value"
                            variant="h4" 
                            sx={{ 
                              fontWeight: 800, 
                              mb: 0.5,
                              background: stat.gradient,
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
                {/* Left Column - Course Performance */}
                <Grid item xs={12} lg={8}>
                  <Fade in timeout={1000}>
                    <Paper sx={{ 
                      p: 3, 
                      mb: 3, 
                      background: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: 3, 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
                        animation: 'shimmer 3s infinite',
                        '@keyframes shimmer': {
                          '0%': { left: '-100%' },
                          '100%': { left: '100%' },
                        },
                      },
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            display: 'flex',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            animation: 'iconBounce 2s ease-in-out infinite',
                            '@keyframes iconBounce': {
                              '0%, 100%': { transform: 'translateY(0)' },
                              '50%': { transform: 'translateY(-5px)' },
                            },
                          }}
                        >
                          <ChartIcon />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          Top Performing Courses
                        </Typography>
                      </Box>
                      {topCourses.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <CourseIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="body2" color="text.secondary">No course data available</Typography>
                        </Box>
                      ) : (
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ background: '#f9fafb' }}>
                                <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Course</TableCell>
                                <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 700 }}>Enrollments</TableCell>
                                <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 700 }}>Completions</TableCell>
                                <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 700 }}>Rate</TableCell>
                                <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 700 }}>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {topCourses.map((course, index) => (
                                <TableRow 
                                  key={course.id} 
                                  sx={{ 
                                    '&:hover': { 
                                      background: 'linear-gradient(90deg, #f9fafb 0%, white 100%)',
                                      transform: 'scale(1.01)',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    }, 
                                    animation: `slideInLeft 0.5s ease ${index * 0.1}s both`,
                                    '@keyframes slideInLeft': {
                                      from: { opacity: 0, transform: 'translateX(-30px)' },
                                      to: { opacity: 1, transform: 'translateX(0)' },
                                    },
                                    transition: 'all 0.3s ease',
                                  }}
                                >
                                  <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{course.title}</TableCell>
                                  <TableCell align="right" sx={{ color: 'text.secondary' }}>{course.enrollments}</TableCell>
                                  <TableCell align="right" sx={{ color: 'text.secondary' }}>{course.completions}</TableCell>
                                  <TableCell align="right">
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                      <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{course.completionRate}%</Typography>
                                      <Box sx={{ width: 60, height: 8, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                                        <Box
                                          sx={{
                                            width: `${course.completionRate}%`,
                                            height: '100%',
                                            background: course.completionRate >= 70 
                                              ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                                              : 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                                            borderRadius: 3,
                                            animation: 'progressGrow 1.5s ease-out',
                                            position: 'relative',
                                            '&::after': {
                                              content: '""',
                                              position: 'absolute',
                                              top: 0,
                                              left: 0,
                                              right: 0,
                                              bottom: 0,
                                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                              animation: 'progressShine 2s infinite',
                                            },
                                            '@keyframes progressGrow': {
                                              from: { width: 0 },
                                            },
                                            '@keyframes progressShine': {
                                              '0%': { transform: 'translateX(-100%)' },
                                              '100%': { transform: 'translateX(100%)' },
                                            },
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Chip label={course.completionRate >= 70 ? 'High' : 'Medium'} size="small"
                                      sx={{ background: course.completionRate >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: course.completionRate >= 70 ? '#10B981' : '#F59E0B', border: `1px solid ${course.completionRate >= 70 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`, fontWeight: 600 }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Paper>
                  </Fade>

                  {/* User Engagement */}
                  <Fade in timeout={1200}>
                    <Paper sx={{ p: 3, background: 'white', border: '1px solid #e5e7eb', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UsersIcon /> User Engagement by Tax Category
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ background: '#f9fafb' }}>
                              <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Category</TableCell>
                              <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 700 }}>Active Users</TableCell>
                              <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 700 }}>Avg. Time</TableCell>
                              <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 700 }}>Completion</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userEngagement.map((item, index) => (
                              <TableRow key={index} sx={{ '&:hover': { background: '#f9fafb' }, animation: `fadeIn 0.5s ease ${index * 0.1}s both` }}>
                                <TableCell>
                                  <Chip label={item.category} size="small" sx={{ background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.3)', fontWeight: 600 }} />
                                </TableCell>
                                <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 600 }}>{item.activeUsers}</TableCell>
                                <TableCell align="right" sx={{ color: 'text.secondary' }}>{item.avgTime}</TableCell>
                                <TableCell align="right">
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                    <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{item.completionRate}%</Typography>
                                    <Box sx={{ width: 60, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                                      <Box sx={{ width: `${item.completionRate}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)', borderRadius: 3 }} />
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

                {/* Right Column - Resource & System Stats */}
                <Grid item xs={12} lg={4}>
                  {/* Resource Statistics */}
                  <Fade in timeout={1000}>
                    <Paper sx={{ p: 3, mb: 3, background: 'white', border: '1px solid #e5e7eb', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DownloadIcon /> Resource Statistics
                      </Typography>
                      {resourceStats.map((resource, index) => (
                        <Zoom in timeout={800 + index * 100} key={index}>
                          <Paper sx={{ p: 2, mb: 2, background: '#f9fafb', border: '1px solid #e5e7eb', borderLeft: `3px solid ${resource.color}`, borderRadius: 2,
                            transition: 'all 0.3s ease', '&:hover': { transform: 'translateX(8px)', background: 'white' }
                          }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Chip label={resource.type} size="small" sx={{ background: `${resource.color}20`, color: resource.color, border: `1px solid ${resource.color}40`, fontWeight: 600 }} />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <StarIcon sx={{ color: '#F59E0B', fontSize: '1rem' }} />
                                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>{resource.avgRating}</Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Count: {resource.count}</Typography>
                              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>{resource.downloads.toLocaleString()} downloads</Typography>
                            </Box>
                          </Paper>
                        </Zoom>
                      ))}
                    </Paper>
                  </Fade>

                  {/* System Performance */}
                  <Fade in timeout={1200}>
                    <Paper sx={{ p: 3, mb: 3, background: 'white', border: '1px solid #e5e7eb', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SpeedIcon /> System Performance
                      </Typography>
                      {[
                        { label: 'Server Uptime', value: '99.8%', color: '#10B981' },
                        { label: 'Response Time', value: '120ms', color: '#667eea' },
                        { label: 'Error Rate', value: '0.2%', color: '#F59E0B' },
                      ].map((metric, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{metric.label}</Typography>
                            <Typography variant="body2" sx={{ color: metric.color, fontWeight: 600 }}>{metric.value}</Typography>
                          </Box>
                          <Box sx={{ width: '100%', height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                            <Box sx={{ width: metric.label === 'Error Rate' ? '0.2%' : '95%', height: '100%', background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}dd 100%)`, borderRadius: 4 }} />
                          </Box>
                        </Box>
                      ))}
                    </Paper>
                  </Fade>

                  {/* Key Insights */}
                  <Fade in timeout={1400}>
                    <Paper sx={{ p: 3, background: 'white', border: '1px solid #e5e7eb', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendIcon /> Key Insights
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[
                          { text: 'VAT courses show 78% completion rate', icon: <CheckIcon />, color: '#10B981', label: 'High Performance' },
                          { text: '12% user growth this month', icon: <TrendIcon />, color: '#667eea', label: 'Growth Trend' },
                          { text: 'Income Tax courses have lowest completion', icon: <WarningIcon />, color: '#F59E0B', label: 'Attention Needed' },
                          { text: 'Add more video resources for complex topics', icon: <CourseIcon />, color: '#8B5CF6', label: 'Recommendation' },
                        ].map((insight, index) => (
                          <Paper key={index} sx={{ p: 2, background: `${insight.color}10`, border: `1px solid ${insight.color}30`, borderLeft: `3px solid ${insight.color}`, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <Box sx={{ color: insight.color, mt: 0.2 }}>{insight.icon}</Box>
                              <Box>
                                <Typography sx={{ color: insight.color, fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>{insight.label}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{insight.text}</Typography>
                              </Box>
                            </Box>
                          </Paper>
                        ))}
                      </Box>
                    </Paper>
                  </Fade>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default Analytics;
