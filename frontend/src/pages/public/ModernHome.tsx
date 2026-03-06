import React from 'react';
import {
  Container, Typography, Button, Box, Grid, Card, CardContent,
  AppBar, Toolbar, Stack, Chip, alpha, IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School, Login, PersonAdd, TrendingUp, Security,
  EmojiEvents, CheckCircle, ArrowForward, MenuBook,
  VideoLibrary, Assessment, Verified, Brightness4, Brightness7,
} from '@mui/icons-material';
import { useThemeMode } from '../../theme/ThemeContext';

const ModernHome: React.FC = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  const features = [
    {
      icon: <School sx={{ fontSize: 48, color: '#667eea' }} />,
      title: 'Comprehensive Courses',
      description: 'Expert-designed tax education courses covering all aspects of Ethiopian tax law',
    },
    {
      icon: <VideoLibrary sx={{ fontSize: 48, color: '#764ba2' }} />,
      title: 'Interactive Learning',
      description: 'Video tutorials, PDFs, and interactive quizzes for effective learning',
    },
    {
      icon: <Assessment sx={{ fontSize: 48, color: '#f093fb' }} />,
      title: 'Practice & Assessments',
      description: 'Test your knowledge with practice questions and final exams',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 48, color: '#F59E0B' }} />,
      title: 'Earn Certificates',
      description: 'Get certified upon course completion to validate your expertise',
    },
  ];

  const stats = [
    { value: '1000+', label: 'Active Learners' },
    { value: '50+', label: 'Expert Courses' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <School sx={{ fontSize: 32, color: '#667eea' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
              ITAS
            </Typography>
            <Chip label="Tax Education" size="small" sx={{ ml: 1 }} />
          </Box>
          <Stack direction="row" spacing={2}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: 'text.primary',
                border: '2px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(180deg)',
                  borderColor: 'primary.main',
                  bgcolor: alpha('#667eea', 0.1),
                },
              }}
            >
              {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<Login />}
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/register')}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                icon={<Verified />}
                label="Ministry of Revenue Approved"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  mb: 3,
                  fontWeight: 600,
                }}
              />
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                Master Ethiopian Tax Law
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.95, fontWeight: 400 }}>
                Professional tax education and certification platform for taxpayers and MOR staff
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: '#f8f9fa',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Start Learning
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<MenuBook />}
                  onClick={() => navigate('/public/resources')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Browse Resources
                </Button>
              </Stack>
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                ✓ Free access to resources • No login required
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    aspectRatio: '1',
                    borderRadius: '24px',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <School sx={{ fontSize: 120, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ITAS
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Tax Education Platform
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  textAlign: 'center',
                  py: 3,
                  borderRadius: '16px',
                  border: '1px solid #e0e0e0',
                  bgcolor: 'white',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#667eea', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Why Choose ITAS?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Everything you need to master Ethiopian tax law and advance your career
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: '16px',
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
                Learn at Your Own Pace
              </Typography>
              <Stack spacing={2}>
                {[
                  'Access courses anytime, anywhere',
                  'Track your progress in real-time',
                  'Practice with unlimited quizzes',
                  'Earn recognized certificates',
                  'Get expert support 24/7',
                ].map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <CheckCircle sx={{ color: '#10B981', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                  Ready to Get Started?
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.95 }}>
                  Join thousands of professionals who have advanced their careers with ITAS
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    py: 2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: '#f8f9fa',
                    },
                  }}
                >
                  Create Free Account
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1a1a1a', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <School sx={{ fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ITAS
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Integrated Tax Administration System - Professional tax education platform
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Button
                  sx={{ justifyContent: 'flex-start', color: 'white', textTransform: 'none' }}
                  onClick={() => navigate('/public/resources')}
                  startIcon={<MenuBook />}
                >
                  Browse Resources (Free)
                </Button>
                <Button
                  sx={{ justifyContent: 'flex-start', color: 'white', textTransform: 'none' }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  sx={{ justifyContent: 'flex-start', color: 'white', textTransform: 'none' }}
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Ministry of Revenue<br />
                Addis Ababa, Ethiopia<br />
                support@itas.gov.et
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2026 ITAS - Integrated Tax Administration System. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ModernHome;
