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
  LinearProgress,
  Avatar,
  Container,
  Fade,
  Zoom,
} from '@mui/material';
import {
  CloudUpload,
  Folder,
  Image,
  VideoLibrary,
  PictureAsPdf,
  TrendingUp,
  TrendingDown,
  MoreVert,
  CheckCircle,
  Schedule,
  Archive,
  Edit,
  ArrowUpward,
  InsertDriveFile,
  Visibility,
  Download,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../api/dashboard';
import CircularProgress from '@mui/material/CircularProgress';

const ContentAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({});

  useEffect(() => {
    setMounted(true);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getContentAdminDashboard();
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
      title: 'Total Resources', 
      value: (dashboardData.totalResources || 0).toString(), 
      change: '+18', 
      trend: 'up', 
      icon: <Folder />, 
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    { 
      title: 'Pending Approval', 
      value: (dashboardData.pendingApproval || 0).toString(), 
      change: '+5', 
      trend: 'up', 
      icon: <Schedule />, 
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
    { 
      title: 'Published Today', 
      value: '8', 
      change: '+3', 
      trend: 'up', 
      icon: <CheckCircle />, 
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
    { 
      title: 'Storage Used', 
      value: '4.2 GB', 
      change: '+0.5 GB', 
      trend: 'up', 
      icon: <CloudUpload />, 
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    },
  ];

  const resourceTypes = [
    { type: 'Videos', count: 45, icon: <VideoLibrary />, color: '#EF4444', percentage: 65, gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' },
    { type: 'PDFs', count: 78, icon: <PictureAsPdf />, color: '#667eea', percentage: 85, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { type: 'Images', count: 33, icon: <Image />, color: '#10B981', percentage: 45, gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
  ];

  const recentUploads = [
    { title: 'Tax Filing Guide 2026', type: 'PDF', size: '2.4 MB', status: 'published', time: '2 hours ago', views: 1245, downloads: 342 },
    { title: 'VAT Calculation Tutorial', type: 'Video', size: '45 MB', status: 'pending', time: '5 hours ago', views: 0, downloads: 0 },
    { title: 'Income Tax Infographic', type: 'Image', size: '1.2 MB', status: 'published', time: '1 day ago', views: 856, downloads: 234 },
    { title: 'Business Tax Workshop', type: 'Video', size: '120 MB', status: 'draft', time: '2 days ago', views: 0, downloads: 0 },
  ];

  const quickActions = [
    { label: 'Upload Resource', icon: <CloudUpload />, path: '/admin/upload-resource', color: '#667eea', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { label: 'Manage Content', icon: <Edit />, path: '/admin/content-management', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
    { label: 'Archive Old', icon: <Archive />, path: '/admin/archive', color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
    { label: 'Version Control', icon: <Folder />, path: '/admin/resource-version', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in={mounted} timeout={600}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mr: 3,
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                animation: 'iconPulse 2s ease-in-out infinite',
                '@keyframes iconPulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                },
              }}
            >
              <CloudUpload sx={{ fontSize: 40, color: 'white' }} />
            </Box>
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
                Content Management Studio
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Upload, manage, and organize educational resources
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Stats Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
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
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: `0 20px 40px ${stat.color}30`,
                    borderColor: stat.color,
                    '& .stat-icon': {
                      transform: 'scale(1.15) rotate(5deg)',
                      background: stat.gradient,
                    },
                    '& .stat-value': {
                      transform: 'scale(1.08)',
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
                      icon={<ArrowUpward sx={{ fontSize: 14 }} />}
                      label={stat.change}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                        '& .MuiChip-icon': { color: 'white' },
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
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Resource Types */}
        <Grid item xs={12} lg={8}>
          <Fade in={mounted} timeout={1000}>
            <Paper 
              sx={{ 
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
                    animation: 'iconBounce 2s ease-in-out infinite',
                    '@keyframes iconBounce': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-5px)' },
                    },
                  }}
                >
                  <InsertDriveFile />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Resource Distribution
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {resourceTypes.map((resource, index) => (
                  <Grid item xs={12} key={index}>
                    <Zoom in={mounted} timeout={800 + index * 100}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(8px)',
                            background: 'white',
                            boxShadow: `0 8px 20px ${resource.color}20`,
                            borderColor: resource.color,
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                background: `${resource.color}15`,
                                color: resource.color,
                              }}
                            >
                              {resource.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                {resource.type}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {resource.count} files uploaded
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={`${resource.percentage}%`}
                            sx={{
                              background: resource.gradient,
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              height: 32,
                              boxShadow: `0 4px 12px ${resource.color}30`,
                            }}
                          />
                        </Box>
                        <Box sx={{ position: 'relative' }}>
                          <LinearProgress
                            variant="determinate"
                            value={resource.percentage}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              background: '#e5e7eb',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                background: resource.gradient,
                                position: 'relative',
                                animation: 'progressGrow 1.5s ease-out',
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
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Fade>

          {/* Recent Uploads */}
          <Fade in={mounted} timeout={1200}>
            <Paper 
              sx={{ 
                p: 3, 
                background: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                    <CloudUpload />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Recent Uploads
                  </Typography>
                </Box>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <MoreVert />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                {recentUploads.map((upload, index) => (
                  <Grid item xs={12} key={index}>
                    <Zoom in={mounted} timeout={1000 + index * 100}>
                      <Paper
                        sx={{
                          p: 2.5,
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          animation: `slideIn 0.5s ease ${index * 0.1}s both`,
                          '@keyframes slideIn': {
                            from: { opacity: 0, transform: 'translateX(-20px)' },
                            to: { opacity: 1, transform: 'translateX(0)' },
                          },
                          '&:hover': {
                            background: 'white',
                            transform: 'translateX(8px)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                            borderColor: '#667eea',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                background: upload.type === 'PDF' 
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  : upload.type === 'Video'
                                  ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                                  : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                boxShadow: upload.type === 'PDF'
                                  ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                                  : upload.type === 'Video'
                                  ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                                  : '0 4px 12px rgba(16, 185, 129, 0.3)',
                              }}
                            >
                              {upload.type === 'PDF' ? <PictureAsPdf /> : upload.type === 'Video' ? <VideoLibrary /> : <Image />}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                                {upload.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {upload.size} • {upload.time}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={upload.status}
                            size="small"
                            sx={{
                              background: upload.status === 'published' 
                                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                                : upload.status === 'pending'
                                ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                                : 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                              color: 'white',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              boxShadow: upload.status === 'published'
                                ? '0 2px 8px rgba(16, 185, 129, 0.3)'
                                : upload.status === 'pending'
                                ? '0 2px 8px rgba(245, 158, 11, 0.3)'
                                : '0 2px 8px rgba(107, 114, 128, 0.3)',
                            }}
                          />
                        </Box>
                        {upload.status === 'published' && (
                          <Box sx={{ display: 'flex', gap: 3, mt: 1.5, pt: 1.5, borderTop: '1px solid #e5e7eb' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Visibility sx={{ fontSize: 16, color: '#667eea' }} />
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                {upload.views} views
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Download sx={{ fontSize: 16, color: '#10B981' }} />
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                {upload.downloads} downloads
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Paper>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Fade>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Fade in={mounted} timeout={1000}>
            <Paper 
              sx={{ 
                p: 3, 
                mb: 3, 
                background: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: 'white',
                    display: 'flex',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <Edit />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Quick Actions
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} key={index}>
                    <Zoom in={mounted} timeout={800 + index * 100}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={action.icon}
                        onClick={() => navigate(action.path)}
                        sx={{
                          py: 2,
                          px: 2.5,
                          justifyContent: 'flex-start',
                          borderWidth: 2,
                          borderColor: '#e5e7eb',
                          color: 'text.primary',
                          fontWeight: 600,
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderWidth: 2,
                            borderColor: action.color,
                            background: `${action.color}10`,
                            transform: 'translateX(8px)',
                            boxShadow: `0 8px 20px ${action.color}30`,
                            '& .MuiButton-startIcon': {
                              transform: 'scale(1.2) rotate(5deg)',
                            },
                          },
                          '& .MuiButton-startIcon': {
                            transition: 'all 0.3s ease',
                            color: action.color,
                          },
                        }}
                      >
                        {action.label}
                      </Button>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Fade>

          {/* Upload Zone */}
          <Fade in={mounted} timeout={1400}>
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed #667eea',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent)',
                  animation: 'shimmer 3s infinite',
                },
                '&:hover': {
                  borderColor: '#764ba2',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  transform: 'scale(1.02)',
                  boxShadow: '0 12px 30px rgba(102, 126, 234, 0.2)',
                  '& .upload-icon': {
                    transform: 'translateY(-10px) scale(1.1)',
                  },
                },
              }}
              onClick={() => navigate('/admin/upload-resource')}
            >
              <Box
                className="upload-icon"
                sx={{
                  display: 'inline-flex',
                  p: 2.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.4s ease',
                }}
              >
                <CloudUpload sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Drag & Drop Files
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                or click to browse
              </Typography>
              <Chip
                label="Supports PDF, MP4, JPG, PNG (Max 100MB)"
                size="small"
                sx={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  fontWeight: 600,
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                }}
              />
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContentAdminDashboard;
