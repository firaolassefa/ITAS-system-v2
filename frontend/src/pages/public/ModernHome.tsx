import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, AppBar, Toolbar, Fade, Grow, alpha, useScrollTrigger, Chip, Paper, IconButton, Tooltip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  School, MenuBook, VideoLibrary, PersonAdd, Login, TrendingUp, People,
  Security, Analytics, Notifications, ArrowForward, PlayArrow, CheckCircle,
  Brightness4, Brightness7, AutoAwesome, Rocket, EmojiEvents,
} from '@mui/icons-material';

const ModernHome: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setStatsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const bgColor = darkMode ? '#0A0F1E' : '#F8FAFC';
  const textPrimary = darkMode ? '#F8FAFC' : '#0A0F1E';
  const textSecondary = darkMode ? alpha('#F8FAFC', 0.7) : '#64748B';
  const cardBg = darkMode ? alpha('#1a1f3a', 0.5) : '#FFFFFF';
  const borderColor = darkMode ? alpha('#00E0FF', 0.2) : alpha('#000', 0.1);
  const accentColor = '#00E0FF';

  const features = [
    {
      icon: <School sx={{ fontSize: 48 }} />,
      title: 'Smart Learning Management',
      description: 'Enroll, track progress, complete modules, and earn certificates',
      color: '#667eea',
    },
    {
      icon: <MenuBook sx={{ fontSize: 48 }} />,
      title: 'Advanced Content Library',
      description: 'Searchable, filterable educational resources',
      color: '#8B5CF6',
    },
    {
      icon: <Analytics sx={{ fontSize: 48 }} />,
      title: 'Real-Time Analytics',
      description: 'Track performance and engagement trends',
      color: '#10B981',
    },
    {
      icon: <Notifications sx={{ fontSize: 48 }} />,
      title: 'Smart Notifications',
      description: 'Targeted communication via email and SMS',
      color: '#F59E0B',
    },
    {
      icon: <VideoLibrary sx={{ fontSize: 48 }} />,
      title: 'Webinar Management',
      description: 'Schedule and manage live training sessions',
      color: '#EF4444',
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Secure Access',
      description: 'SSO login with granular permissions',
      color: '#22D3EE',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users', color: accentColor },
    { value: '95%', label: 'Completion Rate', color: '#10B981' },
    { value: '50+', label: 'Resources', color: '#8B5CF6' },
    { value: '100+', label: 'Users Trained', color: '#F59E0B' },
  ];

  const roles = [
    { name: 'Taxpayer', icon: '👤', desc: 'Access courses & certificates', color: '#667eea' },
    { name: 'Content Admin', icon: '📚', desc: 'Manage resources', color: '#8B5CF6' },
    { name: 'Training Admin', icon: '🎓', desc: 'Schedule webinars', color: '#10B981' },
    { name: 'Comm Officer', icon: '📢', desc: 'Send notifications', color: '#F59E0B' },
    { name: 'Manager', icon: '📊', desc: 'View analytics', color: '#06B6D4' },
    { name: 'System Admin', icon: '⚙️', desc: 'Full control', color: '#EF4444' },
  ];

  return (
    <Box sx={{ bgcolor: bgColor, minHeight: '100vh', position: 'relative', overflow: 'hidden', transition: 'background-color 0.3s' }}>
      {/* Animated Grid Background */}
      {darkMode && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(${alpha('#00E0FF', 0.1)} 1px, transparent 1px),
              linear-gradient(90deg, ${alpha('#00E0FF', 0.1)} 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
            opacity: 0.3,
            zIndex: 0,
          }}
        />
      )}

      {/* Glowing Orbs */}
      <Box
        sx={{
          position: 'fixed',
          top: '10%',
          left: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: darkMode 
            ? `radial-gradient(circle, ${alpha('#00E0FF', 0.3)} 0%, transparent 70%)`
            : `radial-gradient(circle, ${alpha('#667eea', 0.15)} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          animation: 'pulse 8s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '10%',
          right: '10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: darkMode
            ? `radial-gradient(circle, ${alpha('#8B5CF6', 0.3)} 0%, transparent 70%)`
            : `radial-gradient(circle, ${alpha('#764ba2', 0.15)} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          animation: 'pulse 10s ease-in-out infinite 2s',
          zIndex: 0,
        }}
      />

      {/* Floating Particles with Glow */}
      {[...Array(30)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'fixed',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: darkMode 
              ? (i % 3 === 0 ? '#00E0FF' : i % 3 === 1 ? '#8B5CF6' : '#F59E0B')
              : alpha('#667eea', 0.4),
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particleFloat ${15 + Math.random() * 10}s infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0,
            boxShadow: darkMode 
              ? `0 0 20px ${i % 3 === 0 ? '#00E0FF' : i % 3 === 1 ? '#8B5CF6' : '#F59E0B'}`
              : '0 0 10px rgba(102, 126, 234, 0.3)',
          }}
        />
      ))}

      {/* Navigation */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: trigger 
            ? (darkMode ? alpha('#0A0F1E', 0.95) : alpha('#FFFFFF', 0.95))
            : 'transparent',
          backdropFilter: trigger ? 'blur(40px)' : 'none',
          borderBottom: trigger ? `1px solid ${borderColor}` : 'none',
          transition: 'all 0.3s',
          zIndex: 10,
          boxShadow: trigger && darkMode ? `0 0 30px ${alpha('#00E0FF', 0.1)}` : 'none',
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 1.5,
                borderRadius: 3,
                background: darkMode 
                  ? `linear-gradient(135deg, ${alpha('#00E0FF', 0.2)} 0%, ${alpha('#8B5CF6', 0.2)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#667eea', 0.15)} 0%, ${alpha('#764ba2', 0.15)} 100%)`,
                border: `1px solid ${darkMode ? alpha('#00E0FF', 0.3) : alpha('#667eea', 0.3)}`,
                mr: 2,
                boxShadow: darkMode ? `0 0 30px ${alpha('#00E0FF', 0.3)}` : 'none',
              }}
            >
              <School sx={{ fontSize: 28, color: darkMode ? '#00E0FF' : '#667eea' }} />
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 900,
                background: darkMode 
                  ? 'linear-gradient(135deg, #00E0FF 0%, #8B5CF6 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.05em',
                textShadow: darkMode ? `0 0 30px ${alpha('#00E0FF', 0.5)}` : 'none',
              }}
            >
              ITAS
            </Typography>
          </Box>
          
          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton 
              onClick={toggleDarkMode}
              sx={{ 
                mr: 2,
                color: textPrimary,
                background: darkMode ? alpha('#00E0FF', 0.1) : alpha('#667eea', 0.1),
                border: `1px solid ${darkMode ? alpha('#00E0FF', 0.3) : alpha('#667eea', 0.3)}`,
                '&:hover': {
                  background: darkMode ? alpha('#00E0FF', 0.2) : alpha('#667eea', 0.2),
                  boxShadow: darkMode ? `0 0 20px ${alpha('#00E0FF', 0.4)}` : 'none',
                },
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Button 
            variant="outlined"
            startIcon={<Login />}
            onClick={() => navigate('/login')}
            sx={{ 
              mr: 2,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 700,
              borderWidth: 2,
              borderColor: darkMode ? alpha('#00E0FF', 0.5) : alpha('#667eea', 0.5),
              color: textPrimary,
              '&:hover': {
                borderWidth: 2,
                borderColor: darkMode ? '#00E0FF' : '#667eea',
                background: darkMode ? alpha('#00E0FF', 0.1) : alpha('#667eea', 0.1),
                boxShadow: darkMode ? `0 0 20px ${alpha('#00E0FF', 0.3)}` : 'none',
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
              fontWeight: 700,
              background: darkMode 
                ? 'linear-gradient(135deg, #00E0FF 0%, #8B5CF6 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: darkMode ? `0 0 30px ${alpha('#00E0FF', 0.4)}` : '0 8px 25px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: darkMode
                  ? 'linear-gradient(135deg, #8B5CF6 0%, #00E0FF 100%)'
                  : 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: darkMode ? `0 0 40px ${alpha('#00E0FF', 0.6)}` : '0 8px 25px rgba(102, 126, 234, 0.4)',
              },
              transition: 'all 0.3s',
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section - Enhanced */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Side - Content */}
          <Grid item xs={12} md={6}>
            <Fade in={mounted} timeout={1000}>
              <Box>
                <Chip 
                  icon={<Rocket sx={{ fontSize: 18 }} />}
                  label="Transforming Tax Education" 
                  sx={{ 
                    mb: 3,
                    background: darkMode 
                      ? `linear-gradient(135deg, ${alpha('#667eea', 0.2)} 0%, ${alpha('#764ba2', 0.2)} 100%)`
                      : alpha('#667eea', 0.1),
                    color: '#667eea',
                    border: `2px solid ${alpha('#667eea', 0.4)}`,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    py: 2.5,
                    px: 1,
                    boxShadow: darkMode ? `0 0 30px ${alpha('#667eea', 0.3)}` : 'none',
                    '&:hover': {
                      background: darkMode 
                        ? `linear-gradient(135deg, ${alpha('#667eea', 0.3)} 0%, ${alpha('#764ba2', 0.3)} 100%)`
                        : alpha('#667eea', 0.15),
                      transform: 'scale(1.05)',
                      boxShadow: darkMode ? `0 0 40px ${alpha('#667eea', 0.5)}` : 'none',
                    },
                    transition: 'all 0.3s',
                  }}
                />
                <Typography 
                  variant="h1" 
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: 900,
                    mb: 2,
                    color: textPrimary,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Master Tax Education
                </Typography>
                <Typography 
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 900,
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                  }}
                >
                  Through Innovation
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4,
                    color: textSecondary,
                    lineHeight: 1.8,
                    fontWeight: 400,
                    maxWidth: '500px',
                  }}
                >
                  ITAS empowers taxpayers and staff with modern learning tools, 
                  smart analytics, and seamless training management
                </Typography>
                
                {/* Feature Pills */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
                  {['Smart Learning', 'Real-time Analytics', 'Secure Access'].map((feature, index) => (
                    <Chip
                      key={index}
                      icon={<CheckCircle sx={{ fontSize: 16 }} />}
                      label={feature}
                      sx={{
                        background: darkMode 
                          ? alpha('#10B981', 0.15)
                          : alpha('#10B981', 0.1),
                        color: '#10B981',
                        border: `2px solid ${alpha('#10B981', 0.3)}`,
                        fontWeight: 700,
                        py: 2,
                        px: 1,
                        fontSize: '0.9rem',
                        boxShadow: darkMode ? `0 0 20px ${alpha('#10B981', 0.2)}` : 'none',
                        '&:hover': {
                          background: alpha('#10B981', 0.2),
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/register')}
                    sx={{ 
                      px: 4, 
                      py: 1.8,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      textTransform: 'none',
                      fontWeight: 700,
                      boxShadow: darkMode 
                        ? `0 10px 40px ${alpha('#667eea', 0.5)}`
                        : '0 8px 25px rgba(102, 126, 234, 0.35)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: darkMode 
                          ? `0 15px 50px ${alpha('#667eea', 0.7)}`
                          : '0 12px 35px rgba(102, 126, 234, 0.5)',
                      },
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{ 
                      px: 4,
                      py: 1.8,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      color: textPrimary, 
                      borderColor: borderColor,
                      textTransform: 'none',
                      fontWeight: 700,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: '#667eea',
                        background: alpha('#667eea', 0.1),
                        borderWidth: 2,
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Right Side - Dashboard Preview */}
          <Grid item xs={12} md={6}>
            <Fade in={mounted} timeout={1200}>
              <Box sx={{ position: 'relative' }}>
                {/* Main Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 5,
                    background: darkMode 
                      ? `linear-gradient(135deg, ${alpha('#667eea', 0.15)} 0%, ${alpha('#764ba2', 0.15)} 100%)`
                      : '#FFFFFF',
                    border: `3px solid ${darkMode ? alpha('#667eea', 0.3) : alpha('#667eea', 0.2)}`,
                    boxShadow: darkMode 
                      ? `0 25px 70px ${alpha('#667eea', 0.4)}`
                      : '0 20px 60px rgba(102, 126, 234, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        mr: 2,
                        boxShadow: darkMode ? `0 0 30px ${alpha('#667eea', 0.5)}` : 'none',
                      }}
                    >
                      <School sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: textPrimary }}>
                        ITAS Dashboard
                      </Typography>
                      <Typography variant="body2" sx={{ color: textSecondary }}>
                        Your Learning Hub
                      </Typography>
                    </Box>
                  </Box>

                  {/* Progress Bars */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: textPrimary }}>
                        Tax Filing Basics
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#667eea' }}>
                        85%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        background: darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05),
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: '85%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 5,
                          boxShadow: darkMode ? `0 0 15px ${alpha('#667eea', 0.6)}` : 'none',
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: textPrimary }}>
                        VAT Fundamentals
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#10B981' }}>
                        100%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        background: darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05),
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                          borderRadius: 5,
                          boxShadow: darkMode ? `0 0 15px ${alpha('#10B981', 0.6)}` : 'none',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Stats */}
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 3, background: alpha('#667eea', 0.1) }}>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#667eea' }}>
                          12
                        </Typography>
                        <Typography variant="caption" sx={{ color: textSecondary, fontWeight: 600 }}>
                          Courses
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 3, background: alpha('#10B981', 0.1) }}>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#10B981' }}>
                          8
                        </Typography>
                        <Typography variant="caption" sx={{ color: textSecondary, fontWeight: 600 }}>
                          Completed
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 3, background: alpha('#F59E0B', 0.1) }}>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#F59E0B' }}>
                          4
                        </Typography>
                        <Typography variant="caption" sx={{ color: textSecondary, fontWeight: 600 }}>
                          Certificates
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Floating Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    animation: 'floating 3s ease-in-out infinite',
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: darkMode 
                        ? alpha('#10B981', 0.2)
                        : '#FFFFFF',
                      border: `3px solid ${alpha('#10B981', 0.4)}`,
                      boxShadow: darkMode 
                        ? `0 10px 40px ${alpha('#10B981', 0.4)}`
                        : '0 8px 25px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <EmojiEvents sx={{ fontSize: 36, color: '#10B981' }} />
                  </Paper>
                </Box>

                {/* Floating Notification */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -15,
                    left: -15,
                    animation: 'floating 3s ease-in-out infinite 1s',
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      pr: 3,
                      borderRadius: 3,
                      background: darkMode 
                        ? alpha('#667eea', 0.2)
                        : '#FFFFFF',
                      border: `3px solid ${alpha('#667eea', 0.4)}`,
                      boxShadow: darkMode 
                        ? `0 10px 40px ${alpha('#667eea', 0.4)}`
                        : '0 8px 25px rgba(102, 126, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 22, color: '#667eea' }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: textPrimary }}>
                      New course available!
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 6 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Fade in={statsVisible} timeout={600 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: darkMode 
                      ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                      : cardBg,
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${alpha(stat.color, 0.3)}`,
                    borderRadius: 4,
                    transition: 'all 0.4s',
                    boxShadow: darkMode ? `0 0 30px ${alpha(stat.color, 0.2)}` : '0 4px 20px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${stat.color}, ${alpha(stat.color, 0.5)})`,
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.05)',
                      boxShadow: `0 25px 50px ${alpha(stat.color, 0.4)}`,
                      border: `2px solid ${stat.color}`,
                    },
                  }}
                >
                  <Typography variant="h2" sx={{ fontWeight: 900, color: stat.color, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: textSecondary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900,
              mb: 2,
              color: textPrimary,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Everything You Need in One Platform
          </Typography>
          <Typography variant="body1" sx={{ color: textSecondary, maxWidth: '600px', mx: 'auto' }}>
            Comprehensive tools and resources for modern tax education
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {features.slice(0, 3).map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Grow in={mounted} timeout={800 + index * 100}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    background: darkMode 
                      ? `linear-gradient(135deg, ${alpha(feature.color, 0.1)} 0%, ${alpha(feature.color, 0.05)} 100%)`
                      : cardBg,
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${alpha(feature.color, 0.2)}`,
                    borderRadius: 4,
                    transition: 'all 0.4s',
                    boxShadow: darkMode ? `0 0 30px ${alpha(feature.color, 0.1)}` : '0 4px 20px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${feature.color}, ${alpha(feature.color, 0.5)})`,
                    },
                    '&:hover': {
                      transform: 'translateY(-15px) scale(1.03)',
                      boxShadow: `0 25px 60px ${alpha(feature.color, 0.4)}`,
                      border: `2px solid ${feature.color}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box 
                      sx={{ 
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 3,
                        background: alpha(feature.color, 0.15),
                        color: feature.color,
                        mb: 2,
                        boxShadow: darkMode ? `0 0 20px ${alpha(feature.color, 0.3)}` : 'none',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: textPrimary }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: textSecondary, lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {features.slice(3).map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index + 3}>
              <Grow in={mounted} timeout={1100 + index * 100}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    background: darkMode 
                      ? `linear-gradient(135deg, ${alpha(feature.color, 0.1)} 0%, ${alpha(feature.color, 0.05)} 100%)`
                      : cardBg,
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${alpha(feature.color, 0.2)}`,
                    borderRadius: 4,
                    transition: 'all 0.4s',
                    boxShadow: darkMode ? `0 0 30px ${alpha(feature.color, 0.1)}` : '0 4px 20px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${feature.color}, ${alpha(feature.color, 0.5)})`,
                    },
                    '&:hover': {
                      transform: 'translateY(-15px) scale(1.03)',
                      boxShadow: `0 25px 60px ${alpha(feature.color, 0.4)}`,
                      border: `2px solid ${feature.color}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box 
                      sx={{ 
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 3,
                        background: alpha(feature.color, 0.15),
                        color: feature.color,
                        mb: 2,
                        boxShadow: darkMode ? `0 0 20px ${alpha(feature.color, 0.3)}` : 'none',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: textPrimary }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: textSecondary, lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Roles Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, color: textPrimary, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Designed for Every Role
          </Typography>
          <Typography variant="body1" sx={{ color: textSecondary }}>
            Role-based access with tailored dashboards
          </Typography>
        </Box>
        
        {/* First Row - 3 Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {roles.slice(0, 3).map((role, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Fade in={mounted} timeout={1000 + index * 100}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    background: darkMode 
                      ? `linear-gradient(135deg, ${alpha(role.color, 0.15)} 0%, ${alpha(role.color, 0.05)} 100%)`
                      : cardBg,
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${alpha(role.color, 0.3)}`,
                    borderRadius: 4,
                    transition: 'all 0.4s',
                    cursor: 'pointer',
                    boxShadow: darkMode ? `0 0 30px ${alpha(role.color, 0.2)}` : '0 4px 20px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${role.color}, ${alpha(role.color, 0.5)})`,
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.05)',
                      background: darkMode 
                        ? `linear-gradient(135deg, ${alpha(role.color, 0.25)} 0%, ${alpha(role.color, 0.15)} 100%)`
                        : alpha(role.color, 0.05),
                      border: `2px solid ${role.color}`,
                      boxShadow: `0 20px 50px ${alpha(role.color, 0.4)}`,
                    },
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2, fontSize: '3rem' }}>{role.icon}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: textPrimary, mb: 1 }}>
                    {role.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: textSecondary, fontWeight: 600 }}>
                    {role.desc}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Second Row - 3 Cards */}
        <Grid container spacing={3}>
          {roles.slice(3).map((role, index) => (
            <Grid item xs={12} sm={4} key={index + 3}>
              <Fade in={mounted} timeout={1300 + index * 100}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    background: darkMode 
                      ? `linear-gradient(135deg, ${alpha(role.color, 0.15)} 0%, ${alpha(role.color, 0.05)} 100%)`
                      : cardBg,
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${alpha(role.color, 0.3)}`,
                    borderRadius: 4,
                    transition: 'all 0.4s',
                    cursor: 'pointer',
                    boxShadow: darkMode ? `0 0 30px ${alpha(role.color, 0.2)}` : '0 4px 20px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${role.color}, ${alpha(role.color, 0.5)})`,
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.05)',
                      background: darkMode 
                        ? `linear-gradient(135deg, ${alpha(role.color, 0.25)} 0%, ${alpha(role.color, 0.15)} 100%)`
                        : alpha(role.color, 0.05),
                      border: `2px solid ${role.color}`,
                      boxShadow: `0 20px 50px ${alpha(role.color, 0.4)}`,
                    },
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2, fontSize: '3rem' }}>{role.icon}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: textPrimary, mb: 1 }}>
                    {role.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: textSecondary, fontWeight: 600 }}>
                    {role.desc}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: 8, textAlign: 'center' }}>
        <Box
          sx={{
            p: 5,
            borderRadius: 6,
            background: darkMode 
              ? `linear-gradient(135deg, ${alpha('#667eea', 0.2)} 0%, ${alpha('#764ba2', 0.2)} 100%)`
              : `linear-gradient(135deg, ${alpha('#667eea', 0.1)} 0%, ${alpha('#764ba2', 0.1)} 100%)`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#667eea', 0.3)}`,
            boxShadow: darkMode ? 'none' : '0 20px 60px rgba(102, 126, 234, 0.15)',
          }}
        >
          <CheckCircle sx={{ fontSize: 60, color: '#10B981', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, color: textPrimary }}>
            Ready to Modernize Tax Education?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: textSecondary, maxWidth: '600px', mx: 'auto' }}>
            Experience a secure, scalable, and intelligent education management system
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/register')}
              sx={{ 
                px: 5, 
                py: 1.8,
                fontSize: '1.05rem',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ 
                px: 5,
                py: 1.8,
                fontSize: '1.05rem',
                borderRadius: 3,
                color: textPrimary, 
                borderColor: borderColor,
                textTransform: 'none',
                fontWeight: 700,
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#667eea',
                  background: alpha('#667eea', 0.05),
                  borderWidth: 2,
                },
              }}
            >
              Request Demo
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ position: 'relative', zIndex: 1, borderTop: `1px solid ${borderColor}`, py: 4, mt: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <School sx={{ fontSize: 32, color: '#667eea', mr: 1 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ITAS
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ModernHome;
