import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  School as CourseIcon,
  CheckCircle as CompletedIcon,
  Description as ResourceIcon,
  Assignment as CertificateIcon,
  TrendingUp as TrendingIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../api/courses';
import { certificatesAPI } from '../../api/certificates';
import CourseCard from '../../components/CourseCard';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    averageProgress: 0,
  });
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [enrollmentsRes, certificatesRes] = await Promise.all([
        coursesAPI.getUserEnrollments(user.id),
        certificatesAPI.getUserCertificates(user.id),
      ]);

      const enrollments = enrollmentsRes.data || [];
      const completed = enrollments.filter(e => e.status === 'COMPLETED').length;
      const averageProgress = enrollments.length > 0
        ? enrollments.reduce((acc: number, e: any) => acc + e.progress, 0) / enrollments.length
        : 0;

      setEnrolledCourses(enrollments.slice(0, 2));
      setStats({
        enrolledCourses: enrollments.length,
        completedCourses: completed,
        certificates: certificatesRes.data?.length || 0,
        averageProgress: Math.round(averageProgress),
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color, mr: 2 }}>
            {icon}
          </Box>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Typography color="text.secondary">{title}</Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user.fullName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Continue your tax education journey
          </Typography>
        </Box>
        <Chip label={user.userType} color="primary" />
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Enrolled Courses"
            value={stats.enrolledCourses}
            icon={<CourseIcon fontSize="large" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Courses"
            value={stats.completedCourses}
            icon={<CompletedIcon fontSize="large" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Certificates"
            value={stats.certificates}
            icon={<CertificateIcon fontSize="large" />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Progress"
            value={`${stats.averageProgress}%`}
            icon={<TrendingIcon fontSize="large" />}
            color="info.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* My Courses */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">My Courses</Typography>
              <Button
                endIcon={<ArrowIcon />}
                onClick={() => navigate('/taxpayer/courses')}
              >
                View All
              </Button>
            </Box>
            
            {enrolledCourses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CourseIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  You haven't enrolled in any courses yet
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/taxpayer/courses')}
                >
                  Browse Courses
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {enrolledCourses.map((enrollment: any) => (
                  <Grid item xs={12} key={enrollment.id}>
                    <CourseCard
                      course={enrollment.course}
                      onEnroll={() => {}}
                      isEnrolled
                      progress={enrollment.progress}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity & Quick Links */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Enrolled in VAT Fundamentals"
                  secondary="2 days ago"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Completed Module 1"
                  secondary="1 day ago"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Downloaded VAT Guide"
                  secondary="Today"
                />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/taxpayer/courses')}
                >
                  Browse Courses
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/taxpayer/resources')}
                >
                  View Resources
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                >
                  My Profile
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/taxpayer/courses')}
                >
                  Continue Learning
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
