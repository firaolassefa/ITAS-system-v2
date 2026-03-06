import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Avatar, Skeleton,
} from '@mui/material';
import {
  People, School, Assessment, TrendingUp, Notifications,
  CloudUpload, Quiz, BarChart, Settings,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';

interface AdminDashboardProps {
  user: any;
  role: 'SYSTEM_ADMIN' | 'CONTENT_ADMIN' | 'TRAINING_ADMIN' | 'COMM_OFFICER' | 'MANAGER' | 'AUDITOR';
}

const UniversalAdminDashboard: React.FC<AdminDashboardProps> = ({ user, role }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    loadDashboard();
  }, [role]);

  const loadDashboard = async () => {
    try {
      const cacheKey = `dashboard_${role}_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          setData(cachedData.data);
          setLoading(false);
        }
      }

      const endpoint = getEndpoint(role);
      const response = await apiClient.get(endpoint);
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

  const getEndpoint = (role: string) => {
    const endpoints: Record<string, string> = {
      'SYSTEM_ADMIN': '/dashboard/system-admin',
      'CONTENT_ADMIN': '/dashboard/content-admin',
      'TRAINING_ADMIN': '/dashboard/training-admin',
      'COMM_OFFICER': '/dashboard/comm-officer',
      'MANAGER': '/dashboard/manager',
      'AUDITOR': '/dashboard/auditor',
    };
    return endpoints[role] || '/dashboard/system-admin';
  };

  const getRoleConfig = () => {
    const configs: Record<string, any> = {
      'SYSTEM_ADMIN': {
        title: 'System Administration',
        color: '#EF4444',
        stats: [
          { label: 'Total Users', value: data.totalUsers || 0, icon: <People />, color: '#667eea' },
          { label: 'Active Users', value: data.activeUsers || 0, icon: <TrendingUp />, color: '#10B981' },
          { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: '#F59E0B' },
          { label: 'Resources', value: data.totalResources || 0, icon: <CloudUpload />, color: '#8B5CF6' },
        ],
      },
      'CONTENT_ADMIN': {
        title: 'Content Management',
        color: '#F59E0B',
        stats: [
          { label: 'Total Resources', value: data.totalResources || 0, icon: <CloudUpload />, color: '#667eea' },
          { label: 'Published Today', value: data.publishedToday || 0, icon: <TrendingUp />, color: '#10B981' },
          { label: 'Pending Approval', value: data.pendingApproval || 0, icon: <Assessment />, color: '#F59E0B' },
          { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: '#8B5CF6' },
        ],
      },
      'TRAINING_ADMIN': {
        title: 'Training Administration',
        color: '#8B5CF6',
        stats: [
          { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: '#667eea' },
          { label: 'Total Webinars', value: data.totalWebinars || 0, icon: <Assessment />, color: '#10B981' },
          { label: 'Upcoming', value: data.upcomingWebinars || 0, icon: <TrendingUp />, color: '#F59E0B' },
          { label: 'Enrollments', value: data.totalEnrollments || 0, icon: <People />, color: '#8B5CF6' },
        ],
      },
      'COMM_OFFICER': {
        title: 'Communication Center',
        color: '#10B981',
        stats: [
          { label: 'Total Campaigns', value: data.totalCampaigns || 0, icon: <Notifications />, color: '#667eea' },
          { label: 'Sent Today', value: data.sentToday || 0, icon: <TrendingUp />, color: '#10B981' },
          { label: 'Open Rate', value: `${data.openRate || 0}%`, icon: <Assessment />, color: '#F59E0B' },
          { label: 'Active Recipients', value: data.activeRecipients || 0, icon: <People />, color: '#8B5CF6' },
        ],
      },
      'MANAGER': {
        title: 'Management Dashboard',
        color: '#667eea',
        stats: [
          { label: 'Total Users', value: data.totalUsers || 0, icon: <People />, color: '#667eea' },
          { label: 'Active Users', value: data.activeUsers || 0, icon: <TrendingUp />, color: '#10B981' },
          { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: '#F59E0B' },
          { label: 'Completion Rate', value: `${data.completionRate || 0}%`, icon: <Assessment />, color: '#8B5CF6' },
        ],
      },
      'AUDITOR': {
        title: 'Audit Dashboard',
        color: '#8B5CF6',
        stats: [
          { label: 'Total Users', value: data.totalUsers || 0, icon: <People />, color: '#667eea' },
          { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: '#10B981' },
          { label: 'Total Resources', value: data.totalResources || 0, icon: <CloudUpload />, color: '#F59E0B' },
          { label: 'Compliance', value: `${data.complianceScore || 0}%`, icon: <Assessment />, color: '#8B5CF6' },
        ],
      },
    };
    return configs[role] || configs['SYSTEM_ADMIN'];
  };

  const config = getRoleConfig();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map(i => (
            <Grid item xs={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {config.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.fullName || 'Administrator'}
          </Typography>
        </Box>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: config.color,
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          {user?.fullName?.charAt(0) || 'A'}
        </Avatar>
      </Box>

      <Grid container spacing={3}>
        {config.stats.map((stat: any, index: number) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UniversalAdminDashboard;
