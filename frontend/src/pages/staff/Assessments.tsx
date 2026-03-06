import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip,
  Avatar, CircularProgress, Alert, LinearProgress, Divider,
  List, ListItem, ListItemText, ListItemIcon,
} from '@mui/material';
import {
  Assignment, PlayArrow, CheckCircle, Schedule, Lock,
  TrendingUp, Timer, EmojiEvents, Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';
import { useAuth } from '../../hooks/useAuth';

interface Assessment {
  id: number;
  title: string;
  description: string;
  type: 'QUIZ' | 'PRACTICE' | 'FINAL_EXAM' | 'MODULE_QUIZ';
  courseTitle?: string;
  moduleTitle?: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  attempts: number;
  maxAttempts: number;
  bestScore?: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'locked';
  dueDate?: string;
}

const Assessments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      
      // Fetch user enrollments
      const enrollmentsResponse = await apiClient.get(`/courses/enrollments/${user?.id || 2}`);
      const enrollments = enrollmentsResponse.data?.data || enrollmentsResponse.data || [];
      
      // Fetch all courses to get assessment details
      const coursesResponse = await apiClient.get('/courses');
      const courses = coursesResponse.data?.data || coursesResponse.data || [];
      
      // Fetch assessment attempts
      let attempts: any[] = [];
      try {
        const attemptsResponse = await apiClient.get(`/assessments/attempts/user/${user?.id || 2}`);
        attempts = attemptsResponse.data?.data || attemptsResponse.data || [];
      } catch (error) {
        console.log('No attempts found');
      }
      
      const assessmentsList: Assessment[] = [];
      
      // Process each enrollment to extract assessments
      enrollments.forEach((enrollment: any) => {
        const course = courses.find((c: any) => c.id === (enrollment.course?.id || enrollment.courseId));
        if (!course) return;
        
        const modules = course.modules || [];
        
        // Add module quizzes
        modules.forEach((module: any, index: number) => {
          const moduleAttempts = attempts.filter((a: any) => 
            a.assessmentDefinition?.moduleId === module.id
          );
          
          const bestScore = moduleAttempts.length > 0
            ? Math.max(...moduleAttempts.map((a: any) => a.score || 0))
            : undefined;
          
          let status: 'not_started' | 'in_progress' | 'completed' | 'locked' = 'not_started';
          if (bestScore && bestScore >= 70) status = 'completed';
          else if (moduleAttempts.length > 0) status = 'in_progress';
          else if (index > 0 && enrollment.progress < (index * 100 / modules.length)) status = 'locked';
          
          assessmentsList.push({
            id: module.id * 1000 + 1, // Unique ID for module quiz
            title: `${module.title} - Quiz`,
            description: `Test your knowledge of ${module.title}`,
            type: 'MODULE_QUIZ',
            courseTitle: course.title,
            moduleTitle: module.title,
            duration: 30,
            totalQuestions: 10,
            passingScore: 70,
            attempts: moduleAttempts.length,
            maxAttempts: 3,
            bestScore: bestScore,
            status: status,
          });
        });
        
        // Add final exam
        const examAttempts = attempts.filter((a: any) => 
          a.assessmentDefinition?.courseId === course.id && 
          a.assessmentDefinition?.type === 'FINAL_EXAM'
        );
        
        const examBestScore = examAttempts.length > 0
          ? Math.max(...examAttempts.map((a: any) => a.score || 0))
          : undefined;
        
        let examStatus: 'not_started' | 'in_progress' | 'completed' | 'locked' = 'locked';
        if (enrollment.progress >= 100) {
          examStatus = 'not_started';
          if (examBestScore && examBestScore >= 70) examStatus = 'completed';
          else if (examAttempts.length > 0) examStatus = 'in_progress';
        }
        
        assessmentsList.push({
          id: course.id * 10000, // Unique ID for final exam
          title: `${course.title} - Final Exam`,
          description: `Comprehensive assessment for ${course.title}`,
          type: 'FINAL_EXAM',
          courseTitle: course.title,
          duration: 60,
          totalQuestions: 30,
          passingScore: 70,
          attempts: examAttempts.length,
          maxAttempts: 3,
          bestScore: examBestScore,
          status: examStatus,
        });
      });
      
      setAssessments(assessmentsList);
    } catch (error) {
      console.error('Failed to load assessments:', error);
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

  const handleStartAssessment = (assessment: Assessment) => {
    if (assessment.status === 'locked') {
      alert('Complete previous modules to unlock this assessment');
      return;
    }
    
    if (assessment.attempts >= assessment.maxAttempts) {
      alert('Maximum attempts reached for this assessment');
      return;
    }
    
    // Navigate to appropriate assessment page
    if (assessment.type === 'FINAL_EXAM') {
      navigate(`/staff/assessment/${assessment.id}`);
    } else if (assessment.type === 'MODULE_QUIZ') {
      navigate(`/staff/module/${Math.floor(assessment.id / 1000)}/quiz`);
    }
  };

  const completedCount = assessments.filter(a => a.status === 'completed').length;
  const inProgressCount = assessments.filter(a => a.status === 'in_progress').length;
  const notStartedCount = assessments.filter(a => a.status === 'not_started').length;
  const averageScore = assessments.filter(a => a.bestScore !== undefined).length > 0
    ? Math.round(
        assessments
          .filter(a => a.bestScore !== undefined)
          .reduce((sum, a) => sum + (a.bestScore || 0), 0) /
        assessments.filter(a => a.bestScore !== undefined).length
      )
    : 0;

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
          Assessments & Quizzes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Test your knowledge and track your progress
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <Assignment sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">{assessments.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Assessments
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
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <CheckCircle sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">{completedCount}</Typography>
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
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <TrendingUp sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">{inProgressCount}</Typography>
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
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <EmojiEvents sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">{averageScore}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Score
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assessments List */}
      {assessments.length === 0 ? (
        <Alert severity="info">
          No assessments available. Enroll in courses to access assessments.
        </Alert>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Available Assessments
            </Typography>
            <List>
              {assessments.map((assessment, index) => (
                <React.Fragment key={assessment.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 2,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: `${getStatusColor(assessment.status)}.main`,
                          width: 56,
                          height: 56,
                        }}
                      >
                        {getStatusIcon(assessment.status)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {assessment.title}
                          </Typography>
                          <Chip
                            label={assessment.type.replace('_', ' ')}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={assessment.status.replace('_', ' ')}
                            size="small"
                            color={getStatusColor(assessment.status) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Box component="span" sx={{ display: 'block' }}>
                          <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mb: 1 }}>
                            {assessment.description}
                          </Typography>
                          <Box component="span" sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                            <Typography variant="caption" component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Timer fontSize="small" /> {assessment.duration} minutes
                            </Typography>
                            <Typography variant="caption" component="span">
                              Questions: {assessment.totalQuestions}
                            </Typography>
                            <Typography variant="caption" component="span">
                              Passing: {assessment.passingScore}%
                            </Typography>
                            <Typography variant="caption" component="span">
                              Attempts: {assessment.attempts}/{assessment.maxAttempts}
                            </Typography>
                            {assessment.bestScore !== undefined && (
                              <Typography variant="caption" component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Star fontSize="small" color="warning" /> Best: {assessment.bestScore}%
                              </Typography>
                            )}
                          </Box>
                          {assessment.bestScore !== undefined && (
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={assessment.bestScore}
                                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                color={assessment.bestScore >= assessment.passingScore ? 'success' : 'warning'}
                              />
                              <Typography variant="body2" component="span">{assessment.bestScore}%</Typography>
                            </Box>
                          )}
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                    <Box sx={{ ml: 2 }}>
                      {assessment.status === 'locked' ? (
                        <Chip
                          icon={<Lock />}
                          label="Locked"
                          color="default"
                        />
                      ) : assessment.status === 'completed' && assessment.bestScore && assessment.bestScore >= assessment.passingScore ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="Passed"
                          color="success"
                        />
                      ) : assessment.attempts >= assessment.maxAttempts ? (
                        <Chip
                          label="Max Attempts"
                          color="error"
                        />
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<PlayArrow />}
                          onClick={() => handleStartAssessment(assessment)}
                          disabled={assessment.status === 'locked'}
                        >
                          {assessment.status === 'in_progress' ? 'Retake' : 'Start'}
                        </Button>
                      )}
                    </Box>
                  </ListItem>
                  {index < assessments.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Assessments;
