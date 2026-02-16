import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Button, Chip, List, ListItem, ListItemText, Divider, CircularProgress, Container } from '@mui/material';
import { Assessment, Visibility, VerifiedUser, Description, TrendingUp, BarChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../api/dashboard';

const AuditorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getAuditorDashboard();
      setDashboardData(response.data || response);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  const stats = {
    totalAudits: dashboardData.totalAudits || 0,
    pendingReviews: 12,
    completedThisMonth: 28,
    complianceRate: dashboardData.complianceScore || 0,
    totalUsers: dashboardData.totalUsers || 0,
    totalCourses: dashboardData.totalCourses || 0,
    totalResources: dashboardData.totalResources || 0,
    systemHealth: dashboardData.systemHealth || 0,
  };

  const recentAudits = [
    { item: 'User Registration Audit', status: 'Completed', date: '2 hours ago' },
    { item: 'Course Content Review', status: 'In Progress', date: '5 hours ago' },
    { item: 'Resource Access Audit', status: 'Completed', date: '1 day ago' },
    { item: 'System Security Check', status: 'Pending', date: '2 days ago' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <VerifiedUser sx={{ mr: 2, fontSize: 40 }} />
          Auditor Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor system compliance, review activities, and generate audit reports
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4">{stats.totalAudits}</Typography>
                  <Typography>Total Audits</Typography>
                </Box>
                <Assessment sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4">{stats.pendingReviews}</Typography>
                  <Typography>Pending Reviews</Typography>
                </Box>
                <Visibility sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4">{stats.completedThisMonth}</Typography>
                  <Typography>Completed This Month</Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4">{stats.complianceRate}%</Typography>
                  <Typography>Compliance Rate</Typography>
                </Box>
                <VerifiedUser sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary">{stats.totalUsers}</Typography>
              <Typography color="text.secondary">Total Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary">{stats.totalCourses}</Typography>
              <Typography color="text.secondary">Total Courses</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary">{stats.totalResources}</Typography>
              <Typography color="text.secondary">Total Resources</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary">{stats.systemHealth}%</Typography>
              <Typography color="text.secondary">System Health</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Permissions & Info */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Auditor Permissions
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip label="VIEW_ANALYTICS" color="primary" />
              <Chip label="EXPORT_REPORTS" color="primary" />
              <Chip label="AUDIT_LOGS" color="primary" />
              <Chip label="COMPLIANCE_REVIEW" color="primary" />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              As Auditor, you have read-only access to view analytics, monitor system activities, 
              review compliance, audit user actions, and generate comprehensive audit reports. 
              You can track all system operations and ensure regulatory compliance.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Example Tasks:
            </Typography>
            <ul>
              <li>Review user registration and activity logs</li>
              <li>Audit course content and resource access</li>
              <li>Generate compliance reports</li>
              <li>Monitor system security and data integrity</li>
              <li>Track administrative actions and changes</li>
            </ul>
          </Paper>

          {/* Recent Audits */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Audit Activities
            </Typography>
            <List>
              {recentAudits.map((audit, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={audit.item}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={audit.status} 
                            size="small" 
                            color={
                              audit.status === 'Completed' ? 'success' : 
                              audit.status === 'In Progress' ? 'warning' : 
                              'default'
                            }
                          />
                          <Typography variant="caption" color="text.secondary">
                            {audit.date}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentAudits.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Assessment />}
                  onClick={() => navigate('/admin/analytics')}
                  sx={{ py: 1.5 }}
                >
                  View Analytics
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Description />}
                  onClick={() => navigate('/admin/analytics')}
                  sx={{ py: 1.5 }}
                >
                  Generate Audit Report
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Visibility />}
                  sx={{ py: 1.5 }}
                >
                  View Activity Logs
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<VerifiedUser />}
                  sx={{ py: 1.5 }}
                >
                  Compliance Dashboard
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BarChart />}
                  sx={{ py: 1.5 }}
                >
                  Export Reports
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuditorDashboard;
