import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, AppBar, Toolbar, Fade, Grow, Zoom, useScrollTrigger, alpha, useTheme, Chip, Avatar, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  School, 
  MenuBook, 
  VideoLibrary, 
  EmojiEvents, 
  PersonAdd, 
  Login, 
  TrendingUp, 
  People, 
  CheckCircle,
  Security,
  Speed,
  Analytics,
  Notifications,
  CloudUpload,
  Assessment,
  ArrowForward,
  PlayArrow,
  PictureAsPdf,
  Description,
} from '@mui/icons-material';
import { resourcesAPI } from '../../api/resources';

const PublicHome: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [statsVisible, setStatsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setStatsVisible(true), 500);
    loadResources();
    return () => clearTimeout(timer);
  }, []);

  const loadResources = async () => {
    try {
      const response = await resourcesAPI.getAllResources();
      // Get first 6 resources for preview
      setResources((response.data || []).slice(0, 6));
    } catch (error) {
      console.error('Failed to load resources:', error);
    }
  };

  // Auto-refresh resources every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadResources();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <PictureAsPdf sx={{ fontSize: 40, color: '#EF4444' }} />;
      case 'VIDEO':
        return <VideoLibrary sx={{ fontSize: 40, color: '#8B5CF6' }} />;
      default:
        return <Description sx={{ fontSize: 40, color: '#10B981' }} />;
    }
  };

  const features = [
    {
      icon: <School sx={{ fontSize: 48 }} />,
      title: 'Smart Learning Management',
      description: 'Enroll, track progress, complete modules, and earn certificates with our intelligent learning system',
      color: '#1c7ed6',
      gradient: 'linear-gradient(135deg, #1c7ed6 0%, #1c7ed6 100%)',
    },
    {
      icon: <MenuBook sx={{ fontSize: 48 }} />,
      title: 'Advanced Content Library',
      description: 'Searchable, filterable educational resources with version control and smart categorization',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    },
    {
      icon: <Analytics sx={{ fontSize: 48 }} />,
      title: 'Real-Time Analytics',
      description: 'Track performance, completion rates, and engagement trends with powerful analytics dashboard',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
    {
      icon: <Notifications sx={{ fontSize: 48 }} />,
      title: 'Smart Notification System',
      description: 'Targeted communication via email and SMS with campaign tracking and analytics',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
    {
      icon: <VideoLibrary sx={{ fontSize: 48 }} />,
      title: 'Webinar Management',
      description: 'Schedule, manage, and track live training sessions with automated registration and reminders',
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Secure Role-Based Access',
      description: 'SSO login with granular permissions and comprehensive audit trails for compliance',
      color: '#22D3EE',
      gradient: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Users Trained', icon: <People sx={{ fontSize: 40 }} />, color: '#1c7ed6' },
    { value: '95%', label: 'Course Completion', icon: <TrendingUp sx={{ fontSize: 40 }} />, color: '#10B981' },
    { value: '50+', label: 'Educational Resources', icon: <MenuBook sx={{ fontSize: 40 }} />, color: '#8B5CF6' },
    { value: '100+', label: 'Webinars Hosted', icon: <VideoLibrary sx={{ fontSize: 40 }} />, color: '#F59E0B' },
  ];

  const roles = [
    { name: 'Tax Agent', icon: '👤', desc: 'Access courses, earn certificates' },
    { name: 'Content Admin', icon: '📚', desc: 'Manage educational resources' },
    { name: 'Training Admin', icon: '🎓', desc: 'Schedule webinars & courses' },
    { name: 'Comm Officer', icon: '📢', desc: 'Send targeted notifications' },
    { name: 'Manager', icon: '📊', desc: 'View analytics & reports' },
    { name: 'System Admin', icon: '⚙️', desc: 'Full system control' },
  ];

  return (
    <Box sx={{ bgcolor: '#f5f7fa' }}>
      {/* Navigation Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: trigger ? alpha('#0B1220', 0.95) : 'transparent',
          backdropFilter: trigger ? 'blur(20px)' : 'none',
          borderBottom: trigger ? `1px solid ${alpha('#fff', 0.1)}` : 'none',
          transition: 'all 0.3s',
          zIndex: 10,
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 1,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha('#1c7ed6', 0.2)} 0%, ${alpha('#8B5CF6', 0.2)} 100%)`,
                mr: 2,
              }}
            >
              <School sx={{ fontSize: 28, color: '#1c7ed6' }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1c7ed6 0%, #8B5CF6 50%, #22D3EE 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ITAS
            </Typography>
          </Box>
          <Button 
            color="inherit" 
            onClick={() => navigate('/public/courses')}
            sx={{ 
              mr: 2,
              color: '#F8FAFC',
              '&:hover': { color: '#1c7ed6' },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Courses
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/public/resources')}
            sx={{ 
              mr: 3,
              color: '#F8FAFC',
              '&:hover': { color: '#1c7ed6' },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Resources
          </Button>
          <Button 
            variant="outlined"
            startIcon={<Login />}
            onClick={() => navigate('/login')}
            sx={{ 
              mr: 2,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              borderWidth: 2,
              borderColor: alpha('#1c7ed6', 0.5),
              color: '#F8FAFC',
              '&:hover': {
                borderWidth: 2,
                borderColor: '#1c7ed6',
                background: alpha('#1c7ed6', 0.1),
              },
            }}
          >
            Login
          </Button>
          <Button 
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/register')}
            sx={{ 
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #1c7ed6 0%, #8B5CF6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1c7ed6 0%, #7C3AED 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
              },
              transition: 'all 0.3s',
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 3,
                }}
              >
                Master Tax Compliance
              </Typography>
              <Typography 
                variant="h5" 
                paragraph 
                sx={{ 
                  mb: 5,
                  opacity: 0.95,
                  maxWidth: '800px',
                  mx: 'auto',
                }}
              >
                Learn about tax regulations, compliance, and best practices from industry experts
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/public/courses')}
                  sx={{ 
                    px: 5, 
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    bgcolor: 'white',
                    color: 'primary.main',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Explore Courses
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    color: 'white', 
                    borderColor: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Get Started Free
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Fade in timeout={1200}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h3" 
              gutterBottom 
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Everything You Need
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Comprehensive tools and resources to master tax compliance
            </Typography>
          </Box>
        </Fade>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in timeout={800 + index * 200}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    textAlign: 'center',
                    borderRadius: 4,
                    transition: 'all 0.3s',
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: `0 12px 40px ${feature.color}40`,
                      borderColor: feature.color,
                    },
                  }}
                >
                  <CardContent sx={{ py: 5, px: 3 }}>
                    <Box 
                      sx={{ 
                        color: feature.color,
                        mb: 3,
                        display: 'inline-block',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: `${feature.color}15`,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'white', py: 8, boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            {stats.map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Zoom in={statsVisible} timeout={600 + index * 200}>
                  <Box>
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      mb: 2,
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h2" 
                      color="primary" 
                      fontWeight="bold"
                      sx={{ mb: 1 }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Public Resources Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Fade in timeout={1200}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              gutterBottom 
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Resources for Use
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
              Access our library of tax education materials including videos, guides, and documents - no login required
            </Typography>
          </Box>
        </Fade>

        {resources.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {resources.map((resource, index) => (
                <Grid item xs={12} md={6} lg={4} key={resource.id}>
                  <Grow in timeout={800 + index * 100}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        transition: 'all 0.3s',
                        border: '2px solid transparent',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {getResourceIcon(resource.type)}
                          <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                            {resource.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {resource.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip label={resource.type} size="small" color="primary" />
                          {resource.category && (
                            <Chip label={resource.category} size="small" variant="outlined" />
                          )}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Login />}
                          onClick={() => navigate('/login')}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              transform: 'scale(1.02)',
                            },
                          }}
                        >
                          Sign in to Access
                        </Button>
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<MenuBook />}
                onClick={() => navigate('/public/resources')}
                sx={{ 
                  px: 5, 
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                View All Resources
              </Button>
            </Box>
          </>
        ) : (
          <Grid container spacing={3}>
            {[
              {
                icon: <VideoLibrary sx={{ fontSize: 48, color: '#EF4444' }} />,
                title: 'Video Tutorials',
                description: 'Step-by-step video guides on tax compliance, filing procedures, and best practices',
                color: '#EF4444',
              },
              {
                icon: <MenuBook sx={{ fontSize: 48, color: '#8B5CF6' }} />,
                title: 'PDF Guides',
                description: 'Comprehensive handbooks, manuals, and reference materials for tax agents',
                color: '#8B5CF6',
              },
              {
                icon: <School sx={{ fontSize: 48, color: '#10B981' }} />,
                title: 'Learning Materials',
                description: 'Articles, presentations, and documents covering various tax topics',
                color: '#10B981',
              },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Grow in timeout={1000 + index * 200}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: 4,
                      transition: 'all 0.3s',
                      border: '2px solid transparent',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 40px ${item.color}40`,
                        borderColor: item.color,
                      },
                    }}
                    onClick={() => navigate('/public/resources')}
                  >
                    <CardContent sx={{ py: 5, px: 3 }}>
                      <Box 
                        sx={{ 
                          mb: 3,
                          display: 'inline-block',
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: `${item.color}15`,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white', 
          py: 10,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Fade in timeout={1000}>
            <Box>
              <CheckCircle sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Ready to Start Learning?
              </Typography>
              <Typography variant="h6" sx={{ mb: 5, opacity: 0.95 }}>
                Join thousands of tax agents improving their tax knowledge. Sign up now - it's free!
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/register')}
                sx={{ 
                  px: 6, 
                  py: 2.5, 
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  bgcolor: 'white',
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'scale(1.05)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Create Free Account
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  ITAS Tax Education Portal
                </Typography>
              </Box>
              <Typography variant="body2" color="grey.400">
                Empowering tax agents with knowledge and skills for better tax compliance.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} textAlign={{ xs: 'left', md: 'right' }}>
              <Typography variant="body2" color="grey.400" sx={{ mb: 1 }}>
                © 2024 ITAS. All rights reserved.
              </Typography>
              <Typography variant="body2" color="grey.500">
                Built with ❤️ for better tax education
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicHome;

