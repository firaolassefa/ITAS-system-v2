import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Avatar, Paper, Chip, LinearProgress,
} from '@mui/material';
import {
  CloudUpload, TrendingUp, Schedule, Visibility,
  Folder, PictureAsPdf, VideoLibrary, Image, InsertDriveFile,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';
import { useThemeMode } from '../../theme/ThemeContext';

const BLUE = '#339af0';
const GOLD = '#f59e0b';

const ContentAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const { mode } = useThemeMode();
  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  const bg = mode === 'light' ? '#ffffff' : '#1e293b';
  const border = mode === 'light' ? '#e2e8f0' : '#334155';
  const pageBg = mode === 'light' ? '#f8fafc' : '#0f172a';

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const cacheKey = `dashboard_CONTENT_ADMIN_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const c = JSON.parse(cached);
        if (Date.now() - c.timestamp < 5 * 60 * 1000) {
          setData(c.data || {});
          setLoading(false);
        }
      }
      const response = await apiClient.get('/dashboard/content-admin');
      const freshData = response.data.data || response.data;
      setData(freshData);
      localStorage.setItem(cacheKey, JSON.stringify({ data: freshData, timestamp: Date.now() }));
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
    { label: 'Total Resources', value: data.totalResources || 0, icon: <Folder />, accent: BLUE },
    { label: 'Published Today', value: data.publishedToday || 0, icon: <TrendingUp />, accent: GOLD },
    { label: 'Pending Approval', value: data.pendingApproval || 0, icon: <Schedule />, accent: BLUE },
    { label: 'Total Views', value: data.totalViews || 0, icon: <Visibility />, accent: GOLD },
  ];

  const contentTypes = [
    { type: 'PDF Documents', count: data.pdfCount || 0, percentage: 45, icon: <PictureAsPdf />, accent: BLUE },
    { type: 'Video Content', count: data.videoCount || 0, percentage: 30, icon: <VideoLibrary />, accent: GOLD },
    { type: 'Images', count: data.imageCount || 0, percentage: 15, icon: <Image />, accent: BLUE },
    { type: 'Other Files', count: data.otherCount || 0, percentage: 10, icon: <InsertDriveFile />, accent: GOLD },
  ];

  return (
    <Box sx={{ bgcolor: pageBg, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: BLUE, mb: 0.5 }}>
              Content Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome, {user?.fullName || 'Content Admin'} — Manage all educational content
            </Typography>
          </Box>
          <Avatar sx={{ width: 56, height: 56, bgcolor: BLUE, fontSize: '1.4rem', fontWeight: 700 }}>
            {user?.fullName?.charAt(0) || 'C'}
          </Avatar>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card elevation={0} sx={{
                bgcolor: bg, border: `1px solid ${border}`, borderRadius: 2,
                borderTop: `4px solid ${stat.accent}`,
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: `${stat.accent}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: stat.accent, mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: stat.accent, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Content Distribution */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: bg, border: `1px solid ${border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 4, height: 24, bgcolor: BLUE, borderRadius: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Content Distribution</Typography>
          </Box>
          <Grid container spacing={3}>
            {contentTypes.map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box sx={{ p: 3, borderRadius: 2, border: `1px solid ${border}`,
                  bgcolor: mode === 'light' ? '#f8fafc' : '#0f172a',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: item.accent, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ color: item.accent }}>{item.icon}</Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{item.type}</Typography>
                    </Box>
                    <Chip label={`${item.count} files`} size="small"
                      sx={{ bgcolor: `${item.accent}15`, color: item.accent, fontWeight: 700, border: `1px solid ${item.accent}30` }} />
                  </Box>
                  <LinearProgress variant="determinate" value={item.percentage}
                    sx={{ height: 8, borderRadius: 4, bgcolor: border,
                      '& .MuiLinearProgress-bar': { bgcolor: item.accent, borderRadius: 4 } }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {item.percentage}% of total content
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ContentAdminDashboard;

