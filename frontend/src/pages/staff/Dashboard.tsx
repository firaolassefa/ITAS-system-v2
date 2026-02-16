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

      // Set mock internal courses for now
      setInternalCourses([
        {
          id: 1,
          title: 'Tax Policy Updates 2024',
          category: 'Policy',
          progress: 75,
          mandatory: true,
          deadline: '2024-03-15',
          status: 'in_progress',
        },
        {
          id: 2,
          title: 'Internal Audit Procedures',
          category: 'Compliance',
          progress: 100,
          mandatory: true,
          status: 'completed',
        },
        {
          id: 3,
          title: 'Customer Service Excellence',
          category: 'Soft Skills',
          progress: 30,
          mandatory: false,
          status: 'in_progress',
        },
        {
          id: 4,
          title: 'Data Security & Privacy',
          category: 'Security',
          progress: 0,
          mandatory: true,
          deadline: '2024-04-01',
          status: 'not_started',
        },
      ]);

      setComplianceItems([
        {
          id: 1,
          title: 'Annual Ethics Training',
          status: 'compliant',
          dueDate: '2024-12-31',
          description: 'Completed on time',
        },
        {
          id: 2,
          title: 'Security Awareness Update',
          status: 'warning',
          dueDate: '2024-03-01',
          description: 'Due in 2 weeks',
        },
        {
          id: 3,
          title: 'Tax Law Certification',
          status: 'overdue',
          dueDate: '2024-01-31',
          description: 'Overdue by 11 days',
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
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Category: {course.category}
                              {course.deadline && ` • Deadline: ${course.deadline}`}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={course.progress} 
                                sx={{ flexGrow: 1, mr: 1 }}
                              />
                              <Typography variant="body2">
                                {course.progress}%
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <Box>
                        {course.status !== 'completed' && (
                          <IconButton color="primary">
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
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Due: {item.dueDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          </Box>
                        }
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

          {/* Quick Actions */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<School />}
                  fullWidth >
                  Browse All Courses
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<CardMembership />}
                  fullWidth
                >
                  View Certificates
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Assessment />}
                  fullWidth
                >
                  Compliance Report
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Notifications />}
                  fullWidth
                >
                  Training Notifications
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MORStaffDashboard;