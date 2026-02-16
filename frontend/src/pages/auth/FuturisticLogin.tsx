import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Fade,
  Slide,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  School as SchoolIcon, 
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  ArrowForward,
  Security,
  Speed,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/auth';

interface LoginProps {
  onLogin: (user: any, token: string) => void;
}

const FuturisticLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response: any = await authAPI.login(username, password);
      const { user, token } = response;
      
      onLogin(user, token);
      
      // Role-based navigation
      const dashboardMap: Record<string, string> = {
        'SYSTEM_ADMIN': '/admin/system-dashboard',
        'CONTENT_ADMIN': '/admin/content-dashboard',
        'TRAINING_ADMIN': '/admin/training-dashboard',
        'COMM_OFFICER': '/admin/comm-dashboard',
        'MANAGER': '/admin/manager-dashboard',
        'TAXPAYER': '/taxpayer/dashboard',
        'MOR_STAFF': '/staff/dashboard',
        'AUDITOR': '/admin/auditor-dashboard',
      };
      
      navigate(dashboardMap[user.userType] || '/');
      
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  const features = [
    { icon: <Security />, title: 'Secure', desc: 'Bank-level encryption' },
    { icon: <Speed />, title: 'Fast', desc: 'Lightning quick access' },
    { icon: <TrendingUp />, title: 'Smart', desc: 'AI-powered learning' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0B1220',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, ${alpha(theme.palette.info.main, 0.1)} 0%, transparent 50%)
          `,
          animation: 'backgroundPulse 15s ease-in-out infinite',
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 2,
            height: 2,
            background: alpha(theme.palette.primary.main, 0.5),
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${15 + Math.random() * 10}s infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6}>
            <Fade in={mounted} timeout={800}>
              <Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 3,
                    borderRadius: '24px',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha('#fff', 0.1)}`,
                    mb: 4,
                    animation: 'floating 3s ease-in-out infinite',
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
                
                <Typography 
                  variant="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #2563EB 0%, #8B5CF6 50%, #22D3EE 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  ITAS Portal
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 4,
                    fontWeight: 400,
                  }}
                >
                  Tax & Education Support System
                </Typography>

                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 4,
                    lineHeight: 1.8,
                  }}
                >
                  Access your personalized learning dashboard, track your progress, 
                  and unlock your potential with our advanced tax education platform.
                </Typography>

                {/* Features */}
                <Grid container spacing={2}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Fade in={mounted} timeout={1000 + index * 200}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: alpha('#fff', 0.03),
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${alpha('#fff', 0.1)}`,
                            textAlign: 'center',
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              background: alpha('#fff', 0.05),
                              boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                            },
                          }}
                        >
                          <Box sx={{ color: 'primary.main', mb: 1 }}>
                            {feature.icon}
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {feature.desc}
                          </Typography>
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Slide direction="left" in={mounted} timeout={600}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 5, 
                  borderRadius: 6,
                  background: alpha('#fff', 0.05),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha('#fff', 0.1)}`,
                  boxShadow: `0 20px 60px ${alpha('#000', 0.3)}`,
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to continue your learning journey
                  </Typography>
                </Box>

                {error && (
                  <Fade in>
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 3,
                        background: alpha(theme.palette.error.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                      }}
                      onClose={() => setError('')}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={loading ? null : <ArrowForward />}
                    sx={{ 
                      mt: 4, 
                      mb: 2,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>
                </form>

                <Divider sx={{ my: 3, borderColor: alpha('#fff', 0.1) }}>
                  <Chip 
                    label="Quick Login" 
                    size="small" 
                    sx={{ 
                      background: alpha('#fff', 0.05),
                      color: 'text.secondary',
                      border: `1px solid ${alpha('#fff', 0.1)}`,
                    }}
                  />
                </Divider>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[
                    { label: 'Taxpayer', user: 'taxpayer', pass: 'Taxpayer@123', color: 'primary' },
                    { label: 'Admin', user: 'systemadmin', pass: 'Admin@123', color: 'secondary' },
                    { label: 'Manager', user: 'manager', pass: 'Manager@123', color: 'success' },
                    { label: 'Content', user: 'contentadmin', pass: 'Content@123', color: 'info' },
                  ].map((item, index) => (
                    <Chip
                      key={index}
                      label={item.label}
                      onClick={() => quickLogin(item.user, item.pass)}
                      clickable
                      color={item.color as any}
                      variant="outlined"
                      sx={{ 
                        borderRadius: 2,
                        borderWidth: 2,
                        fontWeight: 600,
                        '&:hover': { 
                          transform: 'scale(1.05)',
                          boxShadow: 4,
                        },
                        transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FuturisticLogin;
