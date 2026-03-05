import React, { useState } from 'react';
import {
  Container, Box, TextField, Button, Typography, Paper,
  InputAdornment, IconButton, Chip, alpha, Grid, Alert,
} from '@mui/material';
import {
  Person, Email, Lock, Visibility, VisibilityOff,
  School, CheckCircle, ArrowForward, EmojiEvents, Rocket, TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/auth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            borderRadius: '50%',
            background: alpha('#FFFFFF', 0.05),
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${15 + Math.random() * 10}s infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
            elevation={0}
            sx={{
              borderRadius: 6,
              overflow: 'hidden',
              background: '#FFFFFF',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', minHeight: '650px' }}>
              {/* Left Side - Form */}
              <Box sx={{ flex: 1, p: { xs: 4, md: 6 } }}>
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        mr: 2,
                      }}
                    >
                      <School sx={{ fontSize: 28, color: '#FFFFFF' }} />
                    </Box>
                    <Typography
                      variant="h5"
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
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    Create Account
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Join thousands of learners today
                  </Typography>
                </Box>

              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    {success}
                  </Alert>
                )}
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#667eea' }} />
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#667eea' }} />
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      endIcon={<ArrowForward />}
                      sx={{
                        flex: 1,
                        py: 1.8,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        textTransform: 'none',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
                        },
                        '&:disabled': {
                          background: '#ccc',
                        },
                      }}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      disabled={loading}
                      sx={{
                        flex: 1,
                        py: 1.8,
                        borderRadius: 3,
                        borderWidth: 2,
                        borderColor: '#667eea',
                        color: '#667eea',
                        textTransform: 'none',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        '&:hover': {
                          borderWidth: 2,
                          borderColor: '#764ba2',
                          background: alpha('#667eea', 0.05),
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>

            {/* Right Side - Benefits */}
            <Box
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: { xs: 4, md: 6 },
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                color: '#FFFFFF',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative Elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: alpha('#FFFFFF', 0.1),
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: alpha('#FFFFFF', 0.08),
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Chip
                  label="Start Your Journey"
                  sx={{
                    mb: 3,
                    background: alpha('#FFFFFF', 0.2),
                    color: '#FFFFFF',
                    fontWeight: 700,
                    border: `1px solid ${alpha('#FFFFFF', 0.3)}`,
                  }}
                />
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
                  Transform Your Tax Knowledge
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                  Join ITAS and unlock a world of learning opportunities
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {benefits.map((benefit, index) => (
                    <Grid item xs={6} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 3,
                          background: alpha('#FFFFFF', 0.1),
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${alpha('#FFFFFF', 0.2)}`,
                          transition: 'all 0.3s',
                          '&:hover': {
                            background: alpha('#FFFFFF', 0.15),
                            transform: 'translateY(-5px)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            background: alpha('#FFFFFF', 0.2),
                            mb: 1,
                          }}
                        >
                          {benefit.icon}
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'center' }}>
                          {benefit.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ p: 3, borderRadius: 3, background: alpha('#FFFFFF', 0.1) }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    10,000+
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Learners already joined
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
