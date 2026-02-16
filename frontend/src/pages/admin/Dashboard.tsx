import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  Button,
} from '@mui/material';
import {
  People as UsersIcon,
  School as CoursesIcon,
  Description as ResourcesIcon,
  TrendingUp as TrendingIcon,
  Download as DownloadIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = {
    totalUsers: 1245,
    activeUsers: 892,
    totalCourses: 15,
    publishedCourses: 12,
    totalResources: 48,
    newUsersThisMonth: 145,
  };

  const recentActivities = [
    { id: 1, user: 'John Taxpayer', action: 'Completed VAT Course', time: '2 hours ago' },
    { id: 2, user: 'Jane Business', action: 'Downloaded Tax Guide', time: '4 hours ago' },
    { id: 3, user: 'Mike Corporation', action: 'Enrolled in Advanced Tax', time: '1 day ago' },
    { id: 4, user: 'Sarah Individual', action: 'Generated Certificate', time: '2 days ago' },
  ];

  const topCourses = [
    { id: 1, title: 'VAT Fundamentals', enrollments: 342, completionRate: 78 },
    { id: 2, title: 'Income Tax Basics', enrollments: 289, completionRate: 65 },
    { id: 3, title: 'Corporate Tax', enrollments: 156, completionRate: 82 },
  ];

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4">{value}</Typography>
            <Typography color="text.secondary">{title}</Typography>
            {trend && (
              <Chip
                label={trend}
                size="small"
                color={trend.includes('+') ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Box sx={{ color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            System overview and analytics
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
        >
          Export Report
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<UsersIcon fontSize="large" />}
            color="primary.main"
            trend="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={<UsersIcon fontSize="large" />}
            color="success.main"
            trend="72% active rate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Published Courses"
            value={`${stats.publishedCourses}/${stats.totalCourses}`}
            icon={<CoursesIcon fontSize="large" />}
            color="warning.main"
            trend="3 new this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resources"
            value={stats.totalResources}
            icon={<ResourcesIcon fontSize="large" />}
            color="info.main"
            trend="+8 this month"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column - Analytics */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingIcon sx={{ mr: 1 }} /> Top Performing Courses
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Title</TableCell>
                    <TableCell align="right">Enrollments</TableCell>
                    <TableCell align="right">Completion Rate</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <Typography variant="body2">{course.title}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{course.enrollments}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {course.completionRate}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={course.completionRate}
                            sx={{ width: 60 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          endIcon={<ArrowIcon />}
                          onClick={() => navigate(`/admin/courses/${course.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent User Activity
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell align="right">Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <Typography variant="body2">{activity.user}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{activity.action}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right Column - Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/admin/upload-resource')}
                  sx={{ height: 80 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <ResourcesIcon sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="body2">Upload Resource</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/admin/analytics')}
                  sx={{ height: 80 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <TrendingIcon sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="body2">View Analytics</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/admin/courses')}
                  sx={{ height: 80 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <CoursesIcon sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="body2">Manage Courses</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/admin/users')}
                  sx={{ height: 80 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <UsersIcon sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="body2">Manage Users</Typography>
                  </Box>
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Server Uptime
              </Typography>
              <LinearProgress variant="determinate" value={99.8} color="success" />
              <Typography variant="caption" color="text.secondary">
                99.8% - 30 days
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Storage Usage
              </Typography>
              <LinearProgress variant="determinate" value={65} color="warning" />
              <Typography variant="caption" color="text.secondary">
                65% - 4.2GB used
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>
                Active Sessions
              </Typography>
              <LinearProgress variant="determinate" value={42} color="info" />
              <Typography variant="caption" color="text-secondary">
                42 active sessions
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
