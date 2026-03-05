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
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  Psychology as PracticeIcon,
} from '@mui/icons-material';
import { coursesAPI } from '../../api/courses';
import { modulesAPI } from '../../api/modules';
import AssessmentQuiz from '../../components/taxpayer/AssessmentQuiz';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showCertificateAlert, setShowCertificateAlert] = useState(false);
  const [completionData, setCompletionData] = useState<any>(null);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      const [courseRes, enrollmentsRes] = await Promise.all([
        coursesAPI.getCourseById(Number(id)),
        coursesAPI.getUserEnrollments(1), // Mock user ID - should get from auth
      ]);

      setCourse(courseRes.data);
      
      // Load actual modules from database
      try {
        const modulesRes = await modulesAPI.getModulesByCourse(Number(id));
        const modulesData = Array.isArray(modulesRes) ? modulesRes : [];
        setModules(modulesData);
        console.log('Loaded modules:', modulesData);
      } catch (error) {
        console.error('Failed to load modules:', error);
        setModules([]);
      }
      
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

  const handleAssessmentComplete = async (score: number, passed: boolean) => {
    if (passed) {
      try {
        // Get user from localStorage
        const userStr = localStorage.getItem('itas_user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (!user) {
          alert('User not found. Please login again.');
          return;
        }
        
        // Get the actual module ID from the modules array
        const currentModuleData = modules[activeModule];
        if (!currentModuleData || !currentModuleData.id) {
          console.error('Module data not found:', currentModuleData);
          alert('Module information not found. Please refresh the page.');
          return;
        }
        
        console.log('Completing module:', {
          userId: user.id,
          courseId: Number(id),
          moduleId: currentModuleData.id,
          moduleName: currentModuleData.title
        });
        
        // Complete the current module with actual module ID
        const result = await coursesAPI.completeModule(user.id, Number(id), currentModuleData.id);
        console.log('Module completion result:', result);
        
        setCompletionData(result.data);
        
        // Check if course is completed
        if (result.data?.courseCompleted) {
          setShowCertificateAlert(true);
          setShowAssessment(false);
          
          // Show completion dialog with certificate info
          setTimeout(() => {
            if (window.confirm('🎉 Congratulations! You have completed the entire course!\n\nYour certificate has been generated.\n\nWould you like to view your certificate now?')) {
              navigate('/taxpayer/certificates');
            }
          }, 500);
        } else {
          // Show module completion message
          const remainingModules = result.data?.totalModules - result.data?.completedModules;
          alert(
            `✅ Module "${currentModuleData.title}" completed!\n\n` +
            `Progress: ${Math.round(result.data?.courseProgress || 0)}%\n` +
            `Completed: ${result.data?.completedModules} of ${result.data?.totalModules} modules\n` +
            `Remaining: ${remainingModules} module${remainingModules !== 1 ? 's' : ''}\n\n` +
            `Keep going! Complete all modules to earn your certificate.`
          );
          
          // Move to next module
          if (activeModule < modules.length - 1) {
            setActiveModule(activeModule + 1);
          }
        }
        
        await loadCourseData();
      } catch (error: any) {
        console.error('Failed to complete module:', error);
        console.error('Error details:', error.response?.data);
        alert('Failed to update progress: ' + (error.response?.data?.message || error.message));
      }
    } else {
      alert(`You scored ${score}%. You need at least 70% to pass. Please review the material and try again.`);
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
  const currentModuleData = modules[activeModule];
  const currentModule = currentModuleData?.title || `Module ${activeModule + 1}`;
  const totalModules = modules.length || course?.modules?.length || 0;
  const moduleProgress = enrollment ? (enrollment.progress / 100) * totalModules : 0;
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

        {/* Certificate Completion Alert */}
        {showCertificateAlert && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
              border: '2px solid #10B981',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
            }}
            onClose={() => setShowCertificateAlert(false)}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#059669' }}>
              🎉 Congratulations! Course Completed!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You have successfully completed all modules in this course. Your certificate has been automatically generated and is now available.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/taxpayer/certificates')}
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  },
                }}
              >
                View My Certificate
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/taxpayer/courses')}
                sx={{
                  borderColor: '#10B981',
                  color: '#059669',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#059669',
                    background: 'rgba(16, 185, 129, 0.1)',
                  },
                }}
              >
                Browse More Courses
              </Button>
            </Box>
          </Alert>
        )}

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
                  Review all learning materials, then take the assessment to complete this module.
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    📚 How to Complete This Module:
                  </Typography>
                  <Typography variant="body2" component="div">
                    1. Watch the video lecture (optional but recommended)<br/>
                    2. Read the PDF guide (optional but recommended)<br/>
                    3. Click "Take Module Assessment" below<br/>
                    4. Score 70% or higher to pass and move to the next module
                  </Typography>
                </Alert>
              </Box>

              {/* Module Content */}
              <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PlayIcon sx={{ mr: 1, color: '#667eea' }} /> Video Lecture
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {currentModuleData?.videoUrl 
                      ? 'Watch the instructional video covering key concepts.'
                      : 'Video content will be available soon.'}
                  </Typography>
                  <Button
                    variant="outlined"
                    disabled={!currentModuleData?.videoUrl}
                    onClick={() => {
                      if (currentModuleData?.videoUrl) {
                        const videoUrl = currentModuleData.videoUrl.startsWith('http') 
                          ? currentModuleData.videoUrl 
                          : `http://localhost:8080/api${currentModuleData.videoUrl}`;
                        window.open(videoUrl, '_blank');
                      }
                    }}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#667eea',
                        background: 'rgba(102, 126, 234, 0.1)',
                      },
                    }}
                  >
                    {currentModuleData?.videoUrl ? 'Watch Video' : 'Video Not Available'}
                  </Button>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <BookIcon sx={{ mr: 1, color: '#667eea' }} /> Reading Material
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {currentModuleData?.contentUrl 
                      ? 'Read the detailed guide and reference materials.'
                      : 'Reading materials will be available soon.'}
                  </Typography>
                  <Button
                    variant="outlined"
                    disabled={!currentModuleData?.contentUrl}
                    onClick={() => {
                      if (currentModuleData?.contentUrl) {
                        const contentUrl = currentModuleData.contentUrl.startsWith('http') 
                          ? currentModuleData.contentUrl 
                          : `http://localhost:8080/api${currentModuleData.contentUrl}`;
                        window.open(contentUrl, '_blank');
                      }
                    }}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#667eea',
                        background: 'rgba(102, 126, 234, 0.1)',
                      },
                    }}
                  >
                    {currentModuleData?.contentUrl ? 'Open PDF Guide' : 'PDF Not Available'}
                  </Button>
                </CardContent>
              </Card>

              {/* Practice Questions - New Feature */}
              <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PracticeIcon sx={{ mr: 1, color: '#3b82f6' }} /> Practice Questions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Test your understanding with unlimited practice questions. Get instant feedback and explanations.
                  </Typography>
                  <Button
                    variant="outlined"
                    disabled={!currentModuleData?.id}
                    onClick={() => navigate(`/taxpayer/module/${currentModuleData?.id}/practice`)}
                    sx={{
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                      '&:hover': {
                        borderColor: '#3b82f6',
                        background: 'rgba(59, 130, 246, 0.1)',
                      },
                    }}
                  >
                    Practice Now
                  </Button>
                </CardContent>
              </Card>

              {/* Module Quiz - New Feature */}
              <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <QuizIcon sx={{ mr: 1, color: '#f59e0b' }} /> Module Quiz
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Take the official module quiz. Score 70% or higher to unlock the next module. (15 minutes)
                  </Typography>
                  <Button
                    variant="outlined"
                    disabled={!currentModuleData?.id}
                    onClick={() => navigate(`/taxpayer/module/${currentModuleData?.id}/quiz`)}
                    sx={{
                      borderColor: '#f59e0b',
                      color: '#f59e0b',
                      '&:hover': {
                        borderColor: '#f59e0b',
                        background: 'rgba(245, 158, 11, 0.1)',
                      },
                    }}
                  >
                    Take Module Quiz
                  </Button>
                </CardContent>
              </Card>

              {/* Take Assessment Button - Primary Action */}
              <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ mr: 1 }} /> Module Assessment
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    Ready to test your knowledge? Take the assessment to complete this module.
                    You need to score 70% or higher to pass.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setShowAssessment(true)}
                    sx={{
                      background: 'white',
                      color: '#667eea',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    Take Module Assessment
                  </Button>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeModule === 0}
                  onClick={() => setActiveModule(activeModule - 1)}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                  }}
                >
                  Previous Module
                </Button>
                
                <Button
                  variant="outlined"
                  disabled={activeModule >= modules.length - 1}
                  onClick={() => setActiveModule(activeModule + 1)}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#667eea',
                      background: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  Skip to Next Module
                </Button>
              </Box>

              {/* Final Exam - Show when all modules are completed */}
              {completedModules >= totalModules && totalModules > 0 && (
                <Card sx={{ mt: 4, background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                      <TrophyIcon sx={{ mr: 1, fontSize: 32 }} /> Ready for Final Exam!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.95 }}>
                      🎉 Congratulations! You've completed all modules. Take the final exam to earn your certificate.
                      You need to score 80% or higher to pass. (60 minutes)
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate(`/taxpayer/course/${id}/final-exam`)}
                      sx={{
                        background: 'white',
                        color: '#059669',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        py: 1.5,
                        px: 4,
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.9)',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Take Final Exam & Get Certificate
                    </Button>
                  </CardContent>
                </Card>
              )}
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
              {(modules.length > 0 ? modules : course.modules || []).map((module: any, index: number) => {
                const moduleName = typeof module === 'string' ? module : module.title;
                return (
                  <Step key={index}>
                    <StepLabel
                      icon={index < completedModules ? <CheckIcon color="success" /> : undefined}
                    >
                      <Typography variant="body2">
                        Module {index + 1}: {moduleName}
                      </Typography>
                      {index === activeModule && !showAssessment && (
                        <Chip label="Current" size="small" color="primary" sx={{ ml: 1 }} />
                      )}
                    </StepLabel>
                  </Step>
                );
              })}
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
                  secondary={`${completedModules} of ${totalModules}`}
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

