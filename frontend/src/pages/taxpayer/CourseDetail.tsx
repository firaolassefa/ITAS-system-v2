import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  PlayCircle as PlayIcon,
  CheckCircle as CheckIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { coursesAPI } from '../../api/courses';
import AssessmentQuiz from '../../components/taxpayer/AssessmentQuiz';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      const [courseRes, enrollmentsRes] = await Promise.all([
        coursesAPI.getCourseById(Number(id)),
        coursesAPI.getUserEnrollments(1), // Mock user ID
      ]);

      setCourse(courseRes.data);
      
      const userEnrollment = enrollmentsRes.data?.find(
        (e: any) => e.courseId === Number(id)
      );
      setEnrollment(userEnrollment || null);
    } catch (error) {
      console.error('Failed to load course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleComplete = async () => {
    if (!enrollment) return;

    const newProgress = Math.min(100, enrollment.progress + (100 / course.modules.length));
    
    try {
      await coursesAPI.updateProgress(enrollment.id, newProgress);
      await loadCourseData(); // Reload data
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleAssessmentComplete = async (score: number) => {
    if (score >= 70 && activeModule === course.modules.length - 1) {
      // Last module completed successfully
      await coursesAPI.updateProgress(enrollment.id, 100);
      await loadCourseData();
    }
    setShowAssessment(false);
  };

  const mockQuestions = [
    {
      id: 1,
      question: 'What is the primary purpose of VAT?',
      options: [
        'To generate government revenue',
        'To discourage consumption',
        'To promote exports',
        'To regulate prices'
      ],
      correctAnswer: 0,
      explanation: 'VAT is a consumption tax designed to generate government revenue.'
    },
    {
      id: 2,
      question: 'When should a business register for VAT?',
      options: [
        'When annual turnover exceeds the threshold',
        'Immediately upon starting business',
        'After 2 years of operation',
        'Only if selling imported goods'
      ],
      correctAnswer: 0,
      explanation: 'Businesses must register for VAT when their taxable turnover exceeds the registration threshold.'
    },
    {
      id: 3,
      question: 'How often are VAT returns typically filed?',
      options: [
        'Monthly or quarterly',
        'Yearly',
        'Every 6 months',
        'Only when requested'
      ],
      correctAnswer: 0,
      explanation: 'VAT returns are usually filed monthly or quarterly depending on the business size.'
    }
  ];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading course...</Typography>
        </Box>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Course not found</Alert>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/taxpayer/courses')}
          sx={{ mt: 2 }}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  const isEnrolled = !!enrollment;
  const currentModule = course.modules[activeModule];
  const moduleProgress = enrollment ? (enrollment.progress / 100) * course.modules.length : 0;
  const completedModules = Math.floor(moduleProgress);

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/taxpayer/courses')}
          sx={{ mb: 2 }}
        >
          Back to Courses
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {course.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={course.category} color="primary" />
              <Chip label={course.difficulty} color="secondary" />
              <Chip 
                icon={<ScheduleIcon />} 
                label={`${course.durationHours} hours`} 
                variant="outlined" 
              />
            </Box>
          </Box>
          
          {isEnrolled && (
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                Your Progress
              </Typography>
              <Typography variant="h5">
                {Math.round(enrollment.progress)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={enrollment.progress} 
                sx={{ width: 100, mt: 1 }}
              />
            </Box>
          )}
        </Box>

        <Typography variant="body1" paragraph>
          {course.description}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Course Content */}
        <Grid item xs={12} md={8}>
          {!isEnrolled ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Enroll to Access Course Content
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Enroll in this course to access all modules, videos, and assessments.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => coursesAPI.enroll(1, course.id).then(() => loadCourseData())}
              >
                Enroll Now
              </Button>
            </Paper>
          ) : showAssessment ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Module Assessment: {currentModule}
              </Typography>
              <AssessmentQuiz
                questions={mockQuestions}
                timeLimit={10}
                onComplete={handleAssessmentComplete}
              />
            </Paper>
          ) : (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Module {activeModule + 1}: {currentModule}
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" paragraph>
                  This module covers essential concepts and practical applications.
                  Complete all learning materials before taking the assessment.
                </Typography>
              </Box>

              {/* Module Content */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PlayIcon sx={{ mr: 1 }} /> Video Lecture
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Watch the instructional video covering key concepts.
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => {/* Play video */}}
                  >
                    Watch Video
                  </Button>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <BookIcon sx={{ mr: 1 }} /> Reading Material
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Read the detailed guide and reference materials.
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => {/* Open PDF */}}
                  >
                    Open PDF Guide
                  </Button>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeModule === 0}
                  onClick={() => setActiveModule(activeModule - 1)}
                >
                  Previous Module
                </Button>
                
                {activeModule < course.modules.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={() => setActiveModule(activeModule + 1)}
                  >
                    Next Module
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setShowAssessment(true)}
                  >
                    Take Final Assessment
                  </Button>
                )}
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Right Column - Modules & Progress */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Modules
            </Typography>
            <Stepper activeStep={completedModules} orientation="vertical">
              {course.modules.map((module: string, index: number) => (
                <Step key={index}>
                  <StepLabel
                    icon={index < completedModules ? <CheckIcon color="success" /> : undefined}
                  >
                    <Typography variant="body2">
                      Module {index + 1}: {module}
                    </Typography>
                    {index === activeModule && !showAssessment && (
                      <Chip label="Current" size="small" color="primary" sx={{ ml: 1 }} />
                    )}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Statistics
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Modules Completed"
                  secondary={`${completedModules} of ${course.modules.length}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Time Required"
                  secondary={`${course.durationHours} hours`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Difficulty Level"
                  secondary={course.difficulty}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Category"
                  secondary={course.category}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail;

