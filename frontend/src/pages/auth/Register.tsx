import React, { useState, useEffect } from 'react';
import {
  Container, Box, TextField, Button, Typography, Paper,
  InputAdornment, IconButton, Chip, alpha, Grid, Alert, Fade, Slide,
} from '@mui/material';
import {
  Person, Email, Lock, Visibility, VisibilityOff,
  School, CheckCircle, ArrowForward, EmojiEvents, Rocket, TrendingUp,
  AccountBalance, Security, Speed, Verified,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import { useThemeMode } from '../../theme/ThemeContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.username || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        userType: 'TAXPAYER', // Default user type
      };

      const response = await authAPI.register(userData);
      setSuccess('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: <School />, text: 'Access 50+ courses' },
    { icon: <EmojiEvents />, text: 'Earn certificates' },
    { icon: <Rocket />, text: 'Join live webinars' },
    { icon: <TrendingUp />, text: 'Track progress' },
  ];

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
        py: 4,
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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
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
                  Join ITAS
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#fbbf24',
                    mb: 3,
                    fontWeight: 600,
                  }}
                >
                  Start Your Learning Journey
                </Typography>

                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: alpha('#fff', 0.9),
                    mb: 4,
                    lineHeight: 1.8,
                  }}
                >
                  Register now to access comprehensive tax education courses, resources, 
                  and training materials from the Ministry of Revenue.
                </Typography>

                {/* Features */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
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

                {/* Stats */}
                <Grid container spacing={2}>
                  {benefits.map((benefit, index) => (
                    <Grid item xs={6} key={index}>
                      <Fade in={mounted} timeout={1200 + index * 150}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            bgcolor: alpha('#fff', 0.1),
                            border: '1px solid',
                            borderColor: alpha('#f59e0b', 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: alpha('#f59e0b', 0.2),
                              color: '#fbbf24',
                              display: 'flex',
                            }}
                          >
                            {benefit.icon}
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: '#fff',
                            }}
                          >
                            {benefit.text}
                          </Typography>
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>

          {/* Right Side - Registration Form */}
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
                    Create Account
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Join thousands of learners today
                  </Typography>
                </Box>

              <form onSubmit={handleSubmit}>
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
                {success && (
                  <Fade in>
                    <Alert 
                      severity="success" 
                      sx={{ mb: 3, borderRadius: 2 }}
                      onClose={() => setSuccess('')}
                    >
                      {success}
                    </Alert>
                  </Fade>
                )}
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    required
                    disabled={loading}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    required
                    disabled={loading}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    required
                    disabled={loading}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    required
                    disabled={loading}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
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

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    required
                    disabled={loading}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    endIcon={<ArrowForward />}
                    sx={{
                      mt: 2,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/login')}
                    disabled={loading}
                    sx={{
                      py: 1.8,
                      fontSize: '1.05rem',
                      fontWeight: 600,
                    }}
                  >
                    Already have an account? Sign In
                  </Button>
                </Box>
              </form>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Register;
