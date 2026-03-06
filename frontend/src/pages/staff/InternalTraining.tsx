import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip,
  Avatar, List, ListItem, ListItemText, ListItemIcon,
  Divider, IconButton, Alert, CircularProgress, LinearProgress,
} from '@mui/material';
import {
  Business, PlayArrow, CheckCircle, Schedule, Lock,
  Download, Assignment, TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';

interface InternalCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  progress: number;
  mandatory: boolean;
  deadline?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'locked';
  duration: string;
  modules: number;
}

const InternalTraining: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<InternalCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem('itas_user') || '{}').id || 2;
      
      // Fetch all courses
      const coursesResponse = await apiClient.get('/courses');
      
      // Fetch user enrollments
      const enrollmentsResponse = await apiClient.get(`/courses/enrollments/${userId}`);
      
      const allCoursesData = coursesResponse.data;
      const enrollmentsData = enrollmentsResponse.data;
      
      const allCourses = allCoursesData.data || allCoursesData || [];
      const enrollments = enrollmentsData.data || enrollmentsData || [];
      
      // Create a map of enrollments by courseId
      const enrollmentMap = new Map();
      enrollments.forEach((enrollment: any) => {
        enrollmentMap.set(enrollment.course?.id || enrollment.courseId, enrollment);
      });
      
      // Map courses to internal training format
      const mappedCourses = allCourses.map((course: any) => {
        const enrollment = enrollmentMap.get(course.id);
        const progress = enrollment?.progress || 0;
        let status: 'not_started' | 'in_progress' | 'completed' | 'locked' = 'not_started';
        
        if (progress >= 100) status = 'completed';
        else if (progress > 0) status = 'in_progress';
        
        return {
          id: course.id,
          title: course.title || 'Untitled Course',
          description: course.description || 'No description available',
          category: course.category || 'General',
          progress: progress,
          mandatory: false, // Can be enhanced with course metadata
          status: status,
          duration: `${course.modules?.length || 0} modules`,
          modules: course.modules?.length || 0,
        };
      });
      
      setCourses(mappedCourses);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'not_started': return 'warning';
      case 'locked': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in_progress': return <PlayArrow />;
      case 'not_started': return <Schedule />;
      case 'locked': return <Lock />;
      default: return <Assignment />;
    }
  };

  const mandatoryCourses = courses.filter(c => c.mandatory);
  const optionalCourses = courses.filter(c => !c.mandatory);
  const completedCount = courses.filter(c => c.status === 'completed').length;
  const inProgressCount = courses.filter(c => c.status === 'in_progress').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Internal Training Programs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Staff-specific training materials and mandatory courses
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h4">{courses.length}</Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4">{completedCount}</Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4">{inProgressCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h4">{mandatoryCourses.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mandatory
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mandatory Courses */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Mandatory Training
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            These courses are required for all MOR staff members
          </Alert>
          <List>
            {mandatoryCourses.map((course, index) => (
              <React.Fragment key={course.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: `${getStatusColor(course.status)}.main` }}>
                      {getStatusIcon(course.status)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {course.title}
                        </Typography>
                        <Chip label="Mandatory" size="small" color="error" />
                        <Chip 
                          label={course.status.replace('_', ' ')} 
                          size="small" 
                          color={getStatusColor(course.status) as any}
                        />
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'block' }}>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mb: 1 }}>
                          {course.description}
                        </Typography>
                        <Box component="span" sx={{ display: 'flex', gap: 2, mb: 1 }}>
                          <Typography variant="caption" component="span">
                            Duration: {course.duration}
                          </Typography>
                          <Typography variant="caption" component="span">
                            Modules: {course.modules}
                          </Typography>
                          {course.deadline && (
                            <Typography variant="caption" component="span" color="error">
                              Deadline: {course.deadline}
                            </Typography>
                          )}
                        </Box>
                        {course.status !== 'locked' && (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={course.progress} 
                              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2" component="span">{course.progress}%</Typography>
                          </Box>
                        )}
                      </Box>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  <Box>
                    {course.status === 'completed' && (
                      <IconButton color="success">
                        <Download />
                      </IconButton>
                    )}
                    {course.status !== 'completed' && course.status !== 'locked' && (
                      <Button 
                        variant="contained" 
                        startIcon={<PlayArrow />}
                        onClick={() => navigate(`/staff/courses/${course.id}`)}
                      >
                        {course.status === 'in_progress' ? 'Continue' : 'Start'}
                      </Button>
                    )}
                  </Box>
                </ListItem>
                {index < mandatoryCourses.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Optional Courses */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Optional Training
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enhance your skills with these recommended courses
          </Typography>
          <List>
            {optionalCourses.map((course, index) => (
              <React.Fragment key={course.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: `${getStatusColor(course.status)}.main` }}>
                      {getStatusIcon(course.status)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {course.title}
                        </Typography>
                        <Chip 
                          label={course.status.replace('_', ' ')} 
                          size="small" 
                          color={getStatusColor(course.status) as any}
                        />
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'block' }}>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mb: 1 }}>
                          {course.description}
                        </Typography>
                        <Box component="span" sx={{ display: 'flex', gap: 2, mb: 1 }}>
                          <Typography variant="caption" component="span">
                            Duration: {course.duration}
                          </Typography>
                          <Typography variant="caption" component="span">
                            Modules: {course.modules}
                          </Typography>
                        </Box>
                        {course.status !== 'locked' && (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={course.progress} 
                              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2" component="span">{course.progress}%</Typography>
                          </Box>
                        )}
                      </Box>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  <Box>
                    {course.status === 'locked' ? (
                      <Chip label="Locked" icon={<Lock />} />
                    ) : course.status === 'completed' ? (
                      <IconButton color="success">
                        <Download />
                      </IconButton>
                    ) : (
                      <Button 
                        variant="outlined" 
                        startIcon={<PlayArrow />}
                        onClick={() => navigate(`/staff/courses/${course.id}`)}
                      >
                        {course.status === 'in_progress' ? 'Continue' : 'Start'}
                      </Button>
                    )}
                  </Box>
                </ListItem>
                {index < optionalCourses.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InternalTraining;
