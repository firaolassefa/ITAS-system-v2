import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Avatar, Paper, Chip, alpha, IconButton,
} from '@mui/material';
import {
  Campaign, Send, TrendingUp, People,
  Email, Sms, CheckCircle, Visibility, MoreVert,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';
import { useThemeMode } from '../../theme/ThemeContext';

const CommOfficerDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const { mode } = useThemeMode();
  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const cacheKey = `dashboard_COMM_OFFICER_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          setData(cachedData.data);
          setLoading(false);
        }
      }

      const response = await apiClient.get('/dashboard/comm-officer');
      const freshData = response.data.data || response.data;
      
      setData(freshData);
      localStorage.setItem(cacheKey, JSON.stringify({
        data: freshData,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  const stats = [
    { 
      label: 'Total Campaigns', 
      value: data.totalCampaigns || 0, 
      icon: <Campaign />, 
      color: mode === 'light' ? '#10B981' : '#34d399', 
      bg: mode === 'light' 
        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
        : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' 
    },
    { label: 'Messages Sent', value: data.sentToday || 0, icon: <Send />, color: '#06B6D4', bg: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' },
    { 
      label: 'Open Rate', 
      value: `${data.openRate || 0}%`, 
      icon: <Visibility />, 
      color: mode === 'light' ? '#F59E0B' : '#fbbf24', 
      bg: mode === 'light' 
        ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
        : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' 
    },
    { label: 'Active Recipients', value: data.activeRecipients || 0, icon: <People />, color: '#8B5CF6', bg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' },
  ];

  const recentCampaigns = [
    { title: 'Tax Season Reminder', type: 'email', sent: 1250, opened: 875, status: 'sent' },
    { title: 'New Course Launch', type: 'both', sent: 980, opened: 720, status: 'sent' },
    { title: 'Webinar Invitation', type: 'email', sent: 650, opened: 520, status: 'sent' },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Communication Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user?.fullName || 'Communication Officer'} • Engage with your audience
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: mode === 'light'
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
            }}
          >
            {user?.fullName?.charAt(0) || 'C'}
          </Avatar>
        </Box>
      </Box>

      {/* Main Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                background: mode === 'light' ? 'white' : '#1e293b',
                border: `1px solid ${mode === 'light' ? '#e5e7eb' : '#334155'}`,
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 20px 40px ${alpha(stat.color, 0.25)}`,
                  borderColor: stat.color,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: stat.bg,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background: stat.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: `0 8px 24px ${alpha(stat.color, 0.3)}`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Campaigns */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
          border: '1px solid #a7f3d0',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
          Recent Campaigns
        </Typography>
        <Grid container spacing={3}>
          {recentCampaigns.map((campaign, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: mode === 'light' ? 'white' : '#1e293b',
                  border: `1px solid ${mode === 'light' ? '#e5e7eb' : '#334155'}`,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateX(8px)',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
                    borderColor: '#10B981',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        background: campaign.type === 'email' 
                          ? 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'
                          : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        boxShadow: campaign.type === 'email'
                          ? '0 4px 16px rgba(6, 182, 212, 0.3)'
                          : '0 4px 16px rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      {campaign.type === 'email' ? <Email /> : <Campaign />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        {campaign.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Chip 
                          label={campaign.type === 'email' ? 'Email' : 'Email & SMS'}
                          size="small"
                          sx={{ 
                            background: alpha('#06B6D4', 0.1), 
                            color: '#06B6D4', 
                            fontWeight: 600,
                            border: `1px solid ${alpha('#06B6D4', 0.3)}`,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Sent to {campaign.sent.toLocaleString()} recipients
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 700 }}>
                          {Math.round((campaign.opened / campaign.sent) * 100)}% opened
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                      icon={<CheckCircle />}
                      label="Sent"
                      sx={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    />
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default CommOfficerDashboard;
