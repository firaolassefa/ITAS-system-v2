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

const Login: React.FC<LoginProps> = ({ onLogin }) => {
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Animated Background Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.12) 0%, transparent 50%)
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
            width: 3,
            height: 3,
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${15 + Math.random() * 10}s infinite`,
            animationDelay: `${Math.random() * 5}s`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
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
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    mb: 4,
                    animation: 'floating 3s ease-in-out infinite',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 60, color: '#fff' }} />
                </Box>
                
                <Typography 
                  variant="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 50%, #fff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    textShadow: '0 2px 20px rgba(255, 255, 255, 0.5)',
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                      borderRadius: '2px',
                    },
                  }}
                >
                  <Box component="span" sx={{ 
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B6B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
                    filter: 'drop-shadow(0 2px 8px rgba(255, 215, 0, 0.3))',
                  }}>
                    ITAS
                  </Box>
                  {' '}
                  <Box component="span" sx={{ color: '#fff' }}>
                    Portal
                  </Box>
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.95)',
                    mb: 4,
                    fontWeight: 400,
                  }}
                >
                  Tax & Education Support System
                </Typography>

                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
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
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid rgba(255, 255, 255, 0.4)',
                            textAlign: 'center',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                              transition: 'left 0.6s',
                            },
                            '&:hover': {
                              transform: 'translateY(-12px) scale(1.05)',
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 100%)',
                              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                              border: '2px solid rgba(255, 255, 255, 0.6)',
                              '&::before': {
                                left: '100%',
                              },
                            },
                          }}
                        >
                          <Box 
                            sx={{ 
                              display: 'inline-flex',
                              p: 1.5,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
                              color: '#fff',
                              mb: 1.5,
                              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              transition: 'all 0.3s',
                              '&:hover': {
                                transform: 'rotate(360deg) scale(1.1)',
                                boxShadow: '0 6px 30px rgba(255, 255, 255, 0.4)',
                              },
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#fff', 
                              mb: 0.5,
                              fontSize: '0.95rem',
                              textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.95)',
                              fontWeight: 500,
                              lineHeight: 1.4,
                              fontSize: '0.8rem',
                            }}
                          >
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
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      color: '#1a1a1a',
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
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
                          <PersonIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                          borderWidth: 2,
                        },
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666',
                        '&.Mui-focused': {
                          color: '#667eea',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#1a1a1a',
                      },
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
                          <LockIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#666' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                          borderWidth: 2,
                        },
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666',
                        '&.Mui-focused': {
                          color: '#667eea',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#1a1a1a',
                      },
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
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>
                </form>

                <Divider sx={{ my: 3, borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                  <Chip 
                    label="Quick Login" 
                    size="small" 
                    sx={{ 
                      background: '#f5f5f5',
                      color: '#666',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </Divider>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[
                    { label: 'Taxpayer', user: 'taxpayer', pass: 'Taxpayer@123', color: 'primary' },
                    { label: 'MOR Staff', user: 'morstaff', pass: 'Staff@123', color: 'info' },
                    { label: 'Content Admin', user: 'contentadmin', pass: 'Content@123', color: 'success' },
                    { label: 'Training Admin', user: 'trainingadmin', pass: 'Training@123', color: 'warning' },
                    { label: 'Comm Officer', user: 'commoffice', pass: 'Notification@123', color: 'error' },
                    { label: 'Manager', user: 'manager', pass: 'Manager@123', color: 'secondary' },
                    { label: 'System Admin', user: 'systemadmin', pass: 'Admin@123', color: 'primary' },
                    { label: 'Auditor', user: 'auditor', pass: 'Auditor@123', color: 'info' },
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
                        background: '#fff',
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

export default Login;
