import React from 'react';
import {
  Container, Typography, Button, Box, Grid, Card,
  AppBar, Toolbar, Stack, Chip, alpha, IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Login, PersonAdd, Security,
  EmojiEvents, CheckCircle, ArrowForward, MenuBook,
  VideoLibrary, Assessment, Verified, Brightness4, Brightness7,
  School,
} from '@mui/icons-material';
import { useThemeMode } from '../../theme/ThemeContext';
import MORLogo from '../../assets/MORLogo';

const ModernHome: React.FC = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  const features = [
    {
      icon: <School sx={{ fontSize: 48, color: '#339af0' }} />,
      title: 'Comprehensive Courses',
      description: 'Expert-designed tax education courses covering all aspects of Ethiopian tax law',
    },
    {
      icon: <VideoLibrary sx={{ fontSize: 48, color: '#339af0' }} />,
      title: 'Interactive Learning',
      description: 'Video tutorials, PDFs, and interactive quizzes for effective learning',
    },
    {
      icon: <Assessment sx={{ fontSize: 48, color: '#339af0' }} />,
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
    <Box sx={{ minHeight: '100vh', bgcolor: mode === 'light' ? '#f8f9fa' : '#0f172a' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: mode === 'light' ? 'white' : '#1e293b',
          borderBottom: `1px solid ${mode === 'light' ? '#e0e0e0' : '#334155'}`,
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Box
              onClick={() => navigate('/')}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
                '&:hover': { opacity: 0.85 },
                userSelect: 'none',
              }}
            >
              <MORLogo width={40} height={40} style={{ pointerEvents: 'none' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: mode === 'light' ? '#339af0' : 'white', pointerEvents: 'none' }}>
                MOR Ethiopia
              </Typography>
            </Box>
            <Chip 
              label="Tax Education" 
              size="small" 
              sx={{ 
                ml: 1,
                bgcolor: mode === 'light' ? alpha('#339af0', 0.1) : alpha('#339af0', 0.2),
                color: mode === 'light' ? '#339af0' : '#339af0',
              }} 
            />
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
                  bgcolor: alpha(mode === 'light' ? '#339af0' : '#339af0', 0.1),
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
              Tax Agent Login
            </Button>
            <Button
              variant="contained"
              startIcon={<MenuBook />}
              onClick={() => navigate('/public/resources')}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)'
                  : 'linear-gradient(135deg, #339af0 0%, #339af0 100%)',
              }}
            >
              Taxpayer Resources
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1c7ed6 0%, #339af0 60%, #74c0fc 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box sx={{
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.06)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -60, left: -60,
          width: 300, height: 300, borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.04)',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Left: Text + Buttons */}
            <Grid item xs={12} md={7}>
              <Chip
                icon={<Verified />}
                label="Ministry of Revenue — Official Platform"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.18)',
                  color: 'white',
                  mb: 3,
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              />
              <Typography
                variant="h2"
                sx={{ fontWeight: 800, mb: 2, lineHeight: 1.15, fontSize: { xs: '2rem', md: '2.75rem' } }}
              >
                Master Ethiopian<br />Tax Law
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.92, fontWeight: 400, lineHeight: 1.6, maxWidth: 520 }}
              >
                Professional tax education and certification for taxpayers and MOR staff.
                Learn, practice, and get certified.
              </Typography>

              {/* Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  size="medium"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                  sx={{
                    background: 'white !important',
                    color: '#1c7ed6',
                    px: 3,
                    py: 1,
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    '&:hover': {
                      background: '#f0f7ff !important',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Start Learning
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<MenuBook />}
                  onClick={() => navigate('/public/resources')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.7)',
                    borderWidth: 2,
                    color: 'white',
                    px: 3,
                    py: 1,
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.12)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Browse Resources
                </Button>
              </Stack>

              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                ✓ Free to join &nbsp;•&nbsp; ✓ No credit card &nbsp;•&nbsp; ✓ Certified courses
              </Typography>
            </Grid>

            {/* Right: Logo + text only */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <MORLogo width={200} height={200} style={{ borderRadius: '50%' }} />
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 2, color: 'white', letterSpacing: 1 }}>
                  ITAS
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400, mt: 0.5 }}>
                  Tax Education Platform
                </Typography>
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
                  border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#334155'}`,
                  bgcolor: mode === 'light' ? 'white' : '#1e293b',
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800, 
                    color: mode === 'light' ? '#339af0' : '#339af0', 
                    mb: 1 
                  }}
                >
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
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
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
                  border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#334155'}`,
                  bgcolor: mode === 'light' ? 'white' : '#1e293b',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: mode === 'light'
                      ? '0 12px 40px rgba(102, 126, 234, 0.2)'
                      : '0 12px 40px rgba(59, 130, 246, 0.3)',
                    borderColor: mode === 'light' ? '#339af0' : '#339af0',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
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
      <Box sx={{ bgcolor: mode === 'light' ? 'white' : '#1e293b', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: 'text.primary' }}>
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
                    <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
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
                  background: mode === 'light'
                    ? 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)'
                    : 'linear-gradient(135deg, #1c7ed6 0%, #339af0 100%)',
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
                    background: 'white !important',
                    color: '#1c7ed6',
                    py: 1.8,
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    '&:hover': {
                      background: '#f0f7ff !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
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
                <MORLogo width={40} height={40} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  MOR Ethiopia
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


