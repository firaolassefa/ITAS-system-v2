import React, { useState, useEffect } from 'react';
import {
  Container, Box, TextField, Button, Typography, Paper,
  InputAdornment, IconButton, Alert, Fade, Slide, Grid, alpha, CircularProgress,
} from '@mui/material';
import {
  Person, Email, Lock, Visibility, VisibilityOff,
  ArrowForward, AccountBalance, Security, Speed, Verified,
  School, EmojiEvents, Rocket, TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import { useThemeMode } from '../../theme/ThemeContext';

const BLUE = '#339af0';
const GOLD = '#f59e0b';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.email || !form.username || !form.password) {
      setError('All fields are required'); return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      await authAPI.register({
        fullName: form.fullName,
        email: form.email,
        username: form.username,
        password: form.password,
        userType: 'TAXPAYER',
      });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (e: any) {
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Security />, title: 'Secure', desc: 'Government-grade security' },
    { icon: <Speed />, title: 'Fast', desc: 'Quick access to resources' },
    { icon: <Verified />, title: 'Official', desc: 'Ministry approved' },
  ];

  const benefits = [
    { icon: <School />, text: 'Access 50+ courses' },
    { icon: <EmojiEvents />, text: 'Earn certificates' },
    { icon: <Rocket />, text: 'Join live webinars' },
    { icon: <TrendingUp />, text: 'Track progress' },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: mode === 'light'
        ? `linear-gradient(135deg, ${BLUE} 0%, #1c7ed6 100%)`
        : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', py: 4,
    }}>
      <Box sx={{ position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, ${alpha(GOLD, 0.1)} 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, ${alpha(GOLD, 0.08)} 0%, transparent 50%)`,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left branding */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Fade in={mounted} timeout={800}>
              <Box>
                <Box sx={{ display: 'inline-flex', p: 3, borderRadius: '24px',
                  bgcolor: alpha('#fff', 0.1), border: `2px solid ${alpha(GOLD, 0.3)}`, mb: 4 }}>
                  <AccountBalance sx={{ fontSize: 60, color: GOLD }} />
                </Box>
                <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 2 }}>
                  Join ITAS
                </Typography>
                <Typography variant="h5" sx={{ color: '#fbbf24', mb: 3, fontWeight: 600 }}>
                  Start Your Learning Journey
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#fff', 0.9), mb: 4, lineHeight: 1.8 }}>
                  Register now to access comprehensive tax education courses, resources,
                  and training materials from the Ministry of Revenue.
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {features.map((f, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                      <Fade in={mounted} timeout={1000 + i * 200}>
                        <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: alpha('#fff', 0.1),
                          border: `1px solid ${alpha(GOLD, 0.2)}`, textAlign: 'center',
                          transition: 'all 0.3s',
                          '&:hover': { transform: 'translateY(-8px)', bgcolor: alpha('#fff', 0.15) } }}>
                          <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '50%',
                            bgcolor: alpha(GOLD, 0.2), color: '#fbbf24', mb: 1.5 }}>
                            {f.icon}
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                            {f.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                            {f.desc}
                          </Typography>
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={2}>
                  {benefits.map((b, i) => (
                    <Grid item xs={6} key={i}>
                      <Fade in={mounted} timeout={1200 + i * 150}>
                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha('#fff', 0.1),
                          border: `1px solid ${alpha(GOLD, 0.2)}`,
                          display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(GOLD, 0.2), color: '#fbbf24', display: 'flex' }}>
                            {b.icon}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                            {b.text}
                          </Typography>
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>

          {/* Right — form */}
          <Grid item xs={12} md={6}>
            <Slide direction="left" in={mounted} timeout={600}>
              <Paper elevation={0} sx={{
                p: { xs: 3, sm: 5 }, borderRadius: 4,
                bgcolor: mode === 'light' ? 'white' : '#1e293b',
                border: `1px solid ${mode === 'light' ? alpha('#000', 0.08) : alpha(GOLD, 0.2)}`,
              }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: BLUE, mb: 1 }}>
                    Create Account
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Join thousands of learners today
                  </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField fullWidth label="Full Name" required disabled={loading}
                      value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Person color="primary" /></InputAdornment> }} />

                    <TextField fullWidth label="Username" required disabled={loading}
                      value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Person color="primary" /></InputAdornment> }} />

                    <TextField fullWidth label="Email Address" type="email" required disabled={loading}
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Email color="primary" /></InputAdornment> }} />

                    <TextField fullWidth label="Password" required disabled={loading}
                      type={showPassword ? 'text' : 'password'}
                      value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
                        endAdornment: <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>,
                      }} />

                    <TextField fullWidth label="Confirm Password" required disabled={loading}
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
                        endAdornment: <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirm(v => !v)} edge="end">
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>,
                      }} />

                    <Button type="submit" variant="contained" size="large" fullWidth
                      disabled={loading} endIcon={!loading && <ArrowForward />}
                      sx={{ mt: 1, py: 1.8, fontSize: '1.1rem', fontWeight: 600,
                        bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
                      {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
                    </Button>

                    <Button variant="outlined" size="large" fullWidth
                      onClick={() => navigate('/login')} disabled={loading}
                      sx={{ py: 1.8, fontSize: '1.05rem', fontWeight: 600, borderColor: BLUE, color: BLUE }}>
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
