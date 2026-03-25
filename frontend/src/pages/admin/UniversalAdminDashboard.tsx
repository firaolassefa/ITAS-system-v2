import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent,
  Avatar, Skeleton,
} from '@mui/material';
import {
  People, School, Assessment, TrendingUp, Notifications,
  CloudUpload,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';

const BLUE = '#339af0';
const GOLD = '#f59e0b';

interface AdminDashboardProps {
  user: any;
  role: 'SYSTEM_ADMIN' | 'CONTENT_ADMIN' | 'TRAINING_ADMIN' | 'COMM_OFFICER' | 'MANAGER' | 'AUDITOR';
}

const UniversalAdminDashboard: React.FC<AdminDashboardProps> = ({ user, role }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => { loadDashboard(); }, [role]);

  const loadDashboard = async () => {
    try {
      const cacheKey = `dashboard_${role}_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          setData(cachedData.data || {});
          setLoading(false);
        }
      }
      const endpoint = getEndpoint(role);
      const response = await apiClient.get(endpoint);
      const freshData = response.data.data || response.data;
      setData(freshData);
      localStorage.setItem(cacheKey, JSON.stringify({ data: freshData, timestamp: Date.now() }));
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
        color: BLUE,
        stats: [
          { label: 'Total Users', value: data.totalUsers || 0, icon: <People />, color: BLUE },
          { label: 'Active Users', value: data.activeUsers || 0, icon: <TrendingUp />, color: GOLD },
          { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: BLUE },
          { label: 'Resources', value: data.totalResources || 0, icon: <CloudUpload />, color: GOLD },
        ],
      },
      'CONTENT_ADMIN': {
        title: 'Content Management',
        color: BLUE,
        stats: [
          { label: 'Total Resources', value: data.totalResources || 0, icon: <CloudUpload />, color: BLUE },
          { label: 'Published Today', value: data.publishedToday || 0, icon: <TrendingUp />, color: GOLD },
          { label: 'Pending Approval', value: data.pendingApproval || 0, icon: <Assessment />, color: BLUE },
          { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: GOLD },
        ],
      },
      'TRAINING_ADMIN': {
        title: 'Training Administration',
        color: BLUE,
        stats: [
          { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: BLUE },
          { label: 'Total Webinars', value: data.totalWebinars || 0, icon: <Assessment />, color: GOLD },
          { label: 'Upcoming', value: data.upcomingWebinars || 0, icon: <TrendingUp />, color: BLUE },
          { label: 'Enrollments', value: data.totalEnrollments || 0, icon: <People />, color: GOLD },
        ],
      },
      'COMM_OFFICER': {
        title: 'Communication Center',
        color: BLUE,
        stats: [
          { label: 'Total Campaigns', value: data.totalCampaigns || 0, icon: <Notifications />, color: BLUE },
          { label: 'Sent Today', value: data.sentToday || 0, icon: <TrendingUp />, color: GOLD },
          { label: 'Open Rate', value: `${data.openRate || 0}%`, icon: <Assessment />, color: BLUE },
          { label: 'Active Recipients', value: data.activeRecipients || 0, icon: <People />, color: GOLD },
        ],
      },
      'MANAGER': {
        title: 'Management Dashboard',
        color: BLUE,
        stats: [
          { label: 'Total Users', value: data.totalUsers || 0, icon: <People />, color: BLUE },
          { label: 'Active Users', value: data.activeUsers || 0, icon: <TrendingUp />, color: GOLD },
          { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: BLUE },
          { label: 'Completion Rate', value: `${data.completionRate || 0}%`, icon: <Assessment />, color: GOLD },
        ],
      },
      'AUDITOR': {
        title: 'Audit Dashboard',
        color: BLUE,
        stats: [
          { label: 'Total Users', value: data.totalUsers || 0, icon: <People />, color: BLUE },
          { label: 'Total Courses', value: data.totalCourses || 0, icon: <School />, color: GOLD },
          { label: 'Total Resources', value: data.totalResources || 0, icon: <CloudUpload />, color: BLUE },
          { label: 'Compliance', value: `${data.complianceScore || 0}%`, icon: <Assessment />, color: GOLD },
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
  };

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
        <Avatar sx={{ width: 64, height: 64, bgcolor: config.color, fontSize: '1.5rem', fontWeight: 700 }}>
          {user?.fullName?.charAt(0) || 'A'}
        </Avatar>
      </Box>

      <Grid container spacing={3}>
        {config.stats.map((stat: any, index: number) => (
          <Grid item xs={6} md={3} key={index}>
            <Card elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                  {stat.icon}
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{stat.value}</Typography>
              <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UniversalAdminDashboard;

