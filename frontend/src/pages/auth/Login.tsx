import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Box, TextField, Button, Typography, Alert,
  CircularProgress, InputAdornment, IconButton, Divider, Chip,
  Fade, Slide, Grid, alpha,
} from '@mui/material';
import { 
  AccountBalance, Lock as LockIcon, Person as PersonIcon,
  Visibility, VisibilityOff, ArrowForward, Security, Speed, Verified,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import { useThemeMode } from '../../theme/ThemeContext';

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
  const { mode } = useThemeMode();

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

  const features = [
    { icon: <Security />, title: 'Secure', desc: 'Government-grade security' },
    { icon: <Speed />, title: 'Fast', desc: 'Quick access to resources' },
    { icon: <Verified />, title: 'Official', desc: 'Ministry approved' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: mode === 'light'
          ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, ${alpha('#f59e0b', 0.1)} 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, ${alpha('#f59e0b', 0.08)} 0%, transparent 50%)`,
        }}
      />

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
                    bgcolor: alpha('#fff', 0.1),
                    border: '2px solid',
                    borderColor: alpha('#f59e0b', 0.3),
                    mb: 4,
                  }}
                >
                  <AccountBalance sx={{ fontSize: 60, color: '#f59e0b' }} />
                </Box>
                
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 800,
                    color: 'white',
                    mb: 2,
                  }}
                >
                  ITAS Portal
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#fbbf24',
                    mb: 3,
                    fontWeight: 600,
                  }}
                >
                  Integrated Tax Administration System
                </Typography>

                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: alpha('#fff', 0.9),
                    mb: 4,
                    lineHeight: 1.8,
                  }}
                >
                  Official tax education and training platform by the Ministry of Revenue.
                  Access courses, resources, and track your learning progress.
                </Typography>

                {/* Features */}
                <Grid container spacing={2}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Fade in={mounted} timeout={1000 + index * 200}>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            bgcolor: alpha('#fff', 0.1),
                            border: '1px solid',
                            borderColor: alpha('#f59e0b', 0.2),
                            textAlign: 'center',
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              bgcolor: alpha('#fff', 0.15),
                              borderColor: alpha('#f59e0b', 0.4),
                            },
                          }}
                        >
                          <Box 
                            sx={{ 
                              display: 'inline-flex',
                              p: 1.5,
                              borderRadius: '50%',
                              bgcolor: alpha('#f59e0b', 0.2),
                              color: '#fbbf24',
                              mb: 1.5,
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
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: alpha('#fff', 0.8),
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
                  borderRadius: 4,
                  bgcolor: mode === 'light' ? 'white' : '#1e293b',
                  border: '1px solid',
                  borderColor: mode === 'light' ? alpha('#000', 0.1) : alpha('#f59e0b', 0.2),
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: mode === 'light' ? '#1e3a8a' : '#fff',
                      mb: 1,
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to access your account
                  </Typography>
                </Box>

                {error && (
                  <Fade in>
                    <Alert 
                      severity="error" 
                      sx={{ mb: 3, borderRadius: 2 }}
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
                          <PersonIcon color="primary" />
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
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
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

                <Divider sx={{ my: 3 }}>
                  <Chip label="OR" size="small" />
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    onClick={() => navigate('/')}
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: alpha('#1e3a8a', 0.05),
                      },
                    }}
                  >
                    ← Back to Home
                  </Button>
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
