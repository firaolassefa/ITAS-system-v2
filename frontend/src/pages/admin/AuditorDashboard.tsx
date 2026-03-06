import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Avatar, Paper, Chip, alpha, List, ListItem, ListItemText,
} from '@mui/material';
import {
  People, School, CloudUpload, Assessment,
  VerifiedUser, Security, CheckCircle, Warning,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';

const AuditorDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const cacheKey = `dashboard_AUDITOR_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          setData(cachedData.data);
          setLoading(false);
        }
      }

      const response = await apiClient.get('/dashboard/auditor');
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
    { label: 'Total Users', value: data.totalUsers || 0, icon: <People />, color: '#667eea', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: '#10B981', bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
    { label: 'Total Resources', value: data.totalResources || 0, icon: <CloudUpload />, color: '#F59E0B', bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
    { label: 'Compliance Score', value: `${data.complianceScore || 0}%`, icon: <VerifiedUser />, color: '#8B5CF6', bg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' },
  ];

  const auditItems = [
    { category: 'User Management', status: 'compliant', score: 98, icon: <People />, color: '#10B981' },
    { category: 'Content Security', status: 'compliant', score: 95, icon: <Security />, color: '#10B981' },
    { category: 'Data Integrity', status: 'review', score: 87, icon: <Assessment />, color: '#F59E0B' },
    { category: 'Access Control', status: 'compliant', score: 100, icon: <VerifiedUser />, color: '#10B981' },
  ];

  const recentAudits = [
    { item: 'User Registration Audit', date: 'Dec 15, 2024', status: 'Completed', result: 'Pass' },
    { item: 'Content Upload Review', date: 'Dec 14, 2024', status: 'Completed', result: 'Pass' },
    { item: 'System Access Logs', date: 'Dec 13, 2024', status: 'In Progress', result: 'Pending' },
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
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Audit & Compliance Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user?.fullName || 'Auditor'} • Monitor compliance and system integrity
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
            }}
          >
            {user?.fullName?.charAt(0) || 'A'}
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
                background: 'white',
                border: '1px solid #e5e7eb',
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

      <Grid container spacing={3}>
        {/* Compliance Status */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
              border: '1px solid #ddd6fe',
              height: '100%',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Compliance Status
            </Typography>
            <Grid container spacing={2}>
              {auditItems.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: 'white',
                      border: `2px solid ${alpha(item.color, 0.2)}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: item.color,
                        transform: 'translateX(8px)',
                        boxShadow: `0 8px 24px ${alpha(item.color, 0.2)}`,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: alpha(item.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: item.color,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {item.category}
                          </Typography>
                          <Chip 
                            icon={item.status === 'compliant' ? <CheckCircle /> : <Warning />}
                            label={item.status === 'compliant' ? 'Compliant' : 'Needs Review'}
                            size="small"
                            sx={{
                              background: alpha(item.color, 0.1),
                              color: item.color,
                              fontWeight: 600,
                              border: `1px solid ${alpha(item.color, 0.3)}`,
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: item.color }}>
                        {item.score}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Audits */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
              border: '1px solid #e5e7eb',
              height: '100%',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Recent Audit Activities
            </Typography>
            <List sx={{ p: 0 }}>
              {recentAudits.map((audit, index) => (
                <ListItem
                  key={index}
                  sx={{
                    mb: 2,
                    p: 3,
                    borderRadius: 2,
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      borderColor: audit.result === 'Pass' ? '#10B981' : '#F59E0B',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
                        {audit.item}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip 
                          label={audit.status}
                          size="small"
                          sx={{
                            background: audit.status === 'Completed' 
                              ? alpha('#10B981', 0.1)
                              : alpha('#F59E0B', 0.1),
                            color: audit.status === 'Completed' ? '#10B981' : '#F59E0B',
                            fontWeight: 600,
                          }}
                        />
                        <Chip 
                          label={audit.result}
                          size="small"
                          sx={{
                            background: audit.result === 'Pass'
                              ? alpha('#10B981', 0.1)
                              : alpha('#6B7280', 0.1),
                            color: audit.result === 'Pass' ? '#10B981' : '#6B7280',
                            fontWeight: 600,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, alignSelf: 'center' }}>
                          {audit.date}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuditorDashboard;
