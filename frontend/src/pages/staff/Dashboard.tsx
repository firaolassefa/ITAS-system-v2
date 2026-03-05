import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import {
  School,
  Assignment,
  CardMembership,
  TrendingUp,
  PlayArrow,
  Download,
  Notifications,
  Business,
  Security,
  Assessment,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { dashboardAPI } from '../../api/dashboard';
import { useNavigate } from 'react-router-dom';

interface StaffStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  certificates: number;
  complianceScore: number;
  lastTrainingDate: string;
}

interface InternalCourse {
  id: number;
  title: string;
  category: string;
  progress: number;
  mandatory: boolean;
  deadline?: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface ComplianceItem {
  id: number;
  title: string;
  status: 'compliant' | 'warning' | 'overdue';
  dueDate: string;
  description: string;
}

const MORStaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StaffStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    certificates: 0,
    complianceScore: 0,
    lastTrainingDate: '',
  });
  const [internalCourses, setInternalCourses] = useState<InternalCourse[]>([]);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists before fetching data
    const token = localStorage.getItem('itas_token');
    if (!token) {
      console.error('No token found - redirecting to login');
      window.location.href = '/login';
      return;
    }
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStaffDashboard(user?.id || 1);
      const data = response.data || response;
      
      setStats({
        totalCourses: data.totalCourses || 0,
        completedCourses: data.completedCourses || 0,
        inProgressCourses: (data.enrolledCourses || 0) - (data.completedCourses || 0),
        certificates: data.certificates || 0,
        complianceScore: data.complianceScore || 0,
        lastTrainingDate: new Date().toLocaleDateString(),
      });

      // Fetch real enrollments from backend
      const enrollmentsResponse = await fetch(`http://localhost:8080/courses/enrollments/${user?.id || 1}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('itas_token')}`,
        },
      });
      
      if (enrollmentsResponse.ok) {
        const enrollmentsData = await enrollmentsResponse.json();
        const enrollments = enrollmentsData.data || enrollmentsData || [];
        
        // Map enrollments to internal courses format
        const mappedCourses = enrollments.map((enrollment: any) => {
          const progress = enrollment.progress || 0;
          let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
          if (progress >= 100) status = 'completed';
          else if (progress > 0) status = 'in_progress';
          
          return {
            id: enrollment.course?.id || enrollment.courseId,
            title: enrollment.course?.title || 'Course',
            category: enrollment.course?.category || 'General',
            progress: progress,
            mandatory: false, // Can be enhanced with course metadata
            status: status,
          };
        });
        
        setInternalCourses(mappedCourses);
      }

      // Calculate compliance based on course completion
      const completedCount = stats.completedCourses || 0;
      const totalCount = stats.totalCourses || 1;
      const calculatedCompliance = Math.round((completedCount / totalCount) * 100);
      
      setComplianceItems([
        {
          id: 1,
          title: 'Course Completion',
          status: calculatedCompliance >= 80 ? 'compliant' : calculatedCompliance >= 50 ? 'warning' : 'overdue',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: `${completedCount} of ${totalCount} courses completed`,
        },
      ]);
    } catch (error) {
      console.error('Failed to load staff dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'not_started': return 'default';
      case 'compliant': return 'success';
      case 'warning': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading staff dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          MOR Staff Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.fullName || 'Staff Member'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ministry of Revenue Internal Training Portal
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.totalCourses}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Courses
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.completedCourses}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <CardMembership />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.certificates}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Certificates
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: getComplianceColor(stats.complianceScore) + '.main', mr: 2 }}>
                  <Security />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.complianceScore}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compliance Score
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Internal Training Courses */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Internal Training Programs
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Staff-specific training materials and mandatory courses
              </Typography>
              
              <List>
                {internalCourses.map((course, index) => (
                  <React.Fragment key={course.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Business color={course.mandatory ? 'error' : 'primary'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {course.title}
                            </Typography>
                            {course.mandatory && (
                              <Chip label="Mandatory" size="small" color="error" />
                            )}
                            <Chip 
                              label={course.status.replace('_', ' ')} 
                              size="small" 
                              color={getStatusColor(course.status) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mt: 1 }}>
                              Category: {course.category}
                              {course.deadline && ` • Deadline: ${course.deadline}`}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={course.progress} 
                                sx={{ flexGrow: 1, mr: 1 }}
                              />
                              <Typography variant="body2" component="span">
                                {course.progress}%
                              </Typography>
                            </Box>
                          </React.Fragment>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                      <Box>
                        {course.status !== 'completed' && (
                          <IconButton 
                            color="primary"
                            onClick={() => navigate(`/courses/${course.id}`)}
                          >
                            <PlayArrow />
                          </IconButton>
                        )}
                        {course.status === 'completed' && (
                          <IconButton color="success">
                            <Download />
                          </IconButton>
                        )}
                      </Box>
                    </ListItem>
                    {index < internalCourses.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Compliance Tracking */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Compliance Tracking
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Monitor your compliance status
              </Typography>

              <List>
                {complianceItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Assessment color={getStatusColor(item.status) as any} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block' }}>
                              Due: {item.dueDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block' }}>
                              {item.description}
                            </Typography>
                          </React.Fragment>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                      <Chip 
                        label={item.status} 
                        size="small" 
                        color={getStatusColor(item.status) as any}
                      />
                    </ListItem>
                    {index < complianceItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MORStaffDashboard;