import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip,
  LinearProgress, Avatar, List, ListItem, ListItemText, ListItemIcon,
  Divider, IconButton, Alert,
} from '@mui/material';
import {
  Business, PlayArrow, CheckCircle, Schedule, Lock,
  Download, Assignment, TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
  const [courses, setCourses] = useState<InternalCourse[]>([
    {
      id: 1,
      title: 'Tax Policy Updates 2026',
      description: 'Latest changes in tax policies and regulations for MOR staff',
      category: 'Policy',
      progress: 75,
      mandatory: true,
      deadline: '2026-03-15',
      status: 'in_progress',
      duration: '4 hours',
      modules: 8,
    },
    {
      id: 2,
      title: 'Internal Audit Procedures',
      description: 'Standard operating procedures for internal audits',
      category: 'Compliance',
      progress: 100,
      mandatory: true,
      status: 'completed',
      duration: '3 hours',
      modules: 6,
    },
    {
      id: 3,
      title: 'Customer Service Excellence',
      description: 'Improving taxpayer service and communication skills',
      category: 'Soft Skills',
      progress: 30,
      mandatory: false,
      status: 'in_progress',
      duration: '2 hours',
      modules: 4,
    },
    {
      id: 4,
      title: 'Data Security & Privacy',
      description: 'Protecting sensitive taxpayer information',
      category: 'Security',
      progress: 0,
      mandatory: true,
      deadline: '2026-04-01',
      status: 'not_started',
      duration: '5 hours',
      modules: 10,
    },
    {
      id: 5,
      title: 'Advanced Tax Assessment',
      description: 'Complex tax assessment techniques',
      category: 'Technical',
      progress: 0,
      mandatory: false,
      status: 'locked',
      duration: '6 hours',
      modules: 12,
    },
  ]);

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
