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
  alpha,
  Avatar,
  IconButton,
  Tooltip,
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
  Lock as LockIcon,
  Star as StarIcon,
  TrendingUp,
  MenuBook,
  Assignment,
} from '@mui/icons-material';
import { coursesAPI } from '../../api/courses';
import { modulesAPI } from '../../api/modules';
import AssessmentQuiz from '../../components/taxpayer/AssessmentQuiz';
import { useThemeMode } from '../../theme/ThemeContext';

const STATIC_BASE = import.meta.env.VITE_API_URL || 'http://localhost:9090/api';
const getFileUrl = (url: string) => (!url || url.startsWith('http')) ? url : `${STATIC_BASE}${url}`;

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showCertificateAlert, setShowCertificateAlert] = useState(false);
  const [completionData, setCompletionData] = useState<any>(null);

  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      const userId = user?.id || 1;
      const [courseRes, enrollmentsRes] = await Promise.all([
        coursesAPI.getCourseById(Number(id)),
        coursesAPI.getUserEnrollments(userId),
      ]);

      setCourse(courseRes.data);

      // Load actual modules from database
      try {
        const modulesRes = await modulesAPI.getModulesByCourse(Number(id));
        const modulesData = Array.isArray(modulesRes) ? modulesRes : [];
        // Sort by moduleOrder ascending to ensure correct order
        const sorted = [...modulesData].sort((a, b) => (a.moduleOrder ?? a.module_order ?? 0) - (b.moduleOrder ?? b.module_order ?? 0));
        setModules(sorted);
        setActiveModule(0); // always start at first module
      } catch (error) {
        console.error('Failed to load modules:', error);
        setModules([]);
      }

      const enrollmentsData = enrollmentsRes.data || enrollmentsRes || [];
      const userEnrollment = Array.isArray(enrollmentsData)
        ? enrollmentsData.find((e: any) => e.courseId === Number(id) || e.course?.id === Number(id))
        : null;
      setEnrollment(userEnrollment || null);
    } catch (error) {
      console.error('Failed to load course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleComplete = async () => {
    if (!enrollment) return;
    const newProgress = Math.min(100, enrollment.progress + (100 / modules.length));
    try {
      await coursesAPI.updateProgress(enrollment.id, newProgress);
      await loadCourseData();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleAssessmentComplete = async (score: number, passed: boolean) => {
    if (passed) {
      try {
        const userId = user?.id;
        if (!userId) {
          alert('User not found. Please login again.');
          return;
        }

        const currentModuleData = modules[activeModule];
        if (!currentModuleData?.id) {
          alert('Module information not found. Please refresh the page.');
          return;
        }

        const result = await coursesAPI.completeModule(userId, Number(id), currentModuleData.id);
        setCompletionData(result.data);

        if (result.data?.courseCompleted) {
          setShowCertificateAlert(true);
          setShowAssessment(false);
          setTimeout(() => {
            if (window.confirm('🎉 Congratulations! You have completed the entire course!\n\nYour certificate has been generated.\n\nWould you like to view your certificate now?')) {
              navigate('/taxpayer/certificates');
            }
          }, 500);
        } else {
          const remainingModules = result.data?.totalModules - result.data?.completedModules;
          alert(
            `✅ Module "${currentModuleData.title}" completed!\n\n` +
            `Progress: ${Math.round(result.data?.courseProgress || 0)}%\n` +
            `Completed: ${result.data?.completedModules} of ${result.data?.totalModules} modules\n` +
            `Remaining: ${remainingModules} module${remainingModules !== 1 ? 's' : ''}\n\n` +
            `Keep going! Complete all modules to earn your certificate.`
          );
          if (activeModule < modules.length - 1) {
            setActiveModule(activeModule + 1);
          }
        }
        await loadCourseData();
      } catch (error: any) {
        alert('Failed to update progress: ' + (error.response?.data?.message || error.message));
      }
    } else {
      alert(`You scored ${score}%. You need at least 70% to pass. Please review the material and try again.`);
    }
    setShowAssessment(false);
  };

  const [moduleQuestions, setModuleQuestions] = useState<any[]>([]);

  // Load real questions when active module changes
  useEffect(() => {
    const currentModule = modules[activeModule];
    if (currentModule?.id) {
      loadModuleQuestions(currentModule.id);
    }
  }, [activeModule, modules]);

  const loadModuleQuestions = async (moduleId: number) => {
    try {
      const { questionsAPI } = await import('../../api/modules');
      const data = await questionsAPI.getQuestionsByModule(moduleId);
      const questions = Array.isArray(data) ? data : [];
      // Map backend format to AssessmentQuiz format
      const mapped = questions
        .filter((q: any) => !q.isPractice)
        .map((q: any) => ({
          id: q.id,
          question: q.questionText,
          options: (q.answers || []).map((a: any) => a.answerText),
          correctAnswer: (q.answers || []).findIndex((a: any) => a.isCorrect),
          explanation: q.explanation || '',
        }));
      setModuleQuestions(mapped);
    } catch (e) {
      setModuleQuestions([]);
    }
  };

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate('/taxpayer/courses')}
        sx={{ 
          mb: 3,
          color: mode === 'light' ? '#1c7ed6' : '#339af0',
          fontWeight: 600,
          '&:hover': {
            bgcolor: mode === 'light' ? alpha('#1c7ed6', 0.05) : alpha('#339af0', 0.05),
          },
        }}
      >
        Back to Courses
      </Button>

      {/* Certificate Completion Alert */}
      {showCertificateAlert && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 4,
            background: mode === 'light'
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
            border: '2px solid #10B981',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
          }}
          onClose={() => setShowCertificateAlert(false)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: '#10B981', width: 56, height: 56 }}>
              <TrophyIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#059669', mb: 0.5 }}>
                🎉 Congratulations! Course Completed!
              </Typography>
              <Typography variant="body1">
                You have successfully completed all modules. Your certificate is ready!
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<TrophyIcon />}
              onClick={() => navigate('/taxpayer/certificates')}
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
              }}
            >
              View Certificate
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/taxpayer/courses')}
              sx={{
                borderColor: '#10B981',
                color: '#059669',
                fontWeight: 600,
              }}
            >
              Browse More Courses
            </Button>
          </Box>
        </Alert>
      )}

      {/* Course Hero Section */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 4,
          background: mode === 'light'
            ? 'linear-gradient(135deg, #1c7ed6 0%, #339af0 100%)'
            : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            opacity: 0.1,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${alpha('#f59e0b', 0.3)} 0%, transparent 50%)`,
          }}
        />

        <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={course.category} 
                sx={{ 
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  border: `1px solid ${alpha('#fff', 0.3)}`,
                }} 
              />
              <Chip 
                label={course.difficulty} 
                sx={{ 
                  bgcolor: alpha('#f59e0b', 0.2),
                  color: '#fbbf24',
                  fontWeight: 600,
                  border: `1px solid ${alpha('#f59e0b', 0.3)}`,
                }} 
              />
              <Chip 
                icon={<ScheduleIcon sx={{ color: 'white !important' }} />} 
                label={`${course.durationHours} hours`} 
                sx={{ 
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  border: `1px solid ${alpha('#fff', 0.3)}`,
                }} 
              />
            </Box>
            
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              {course.title}
            </Typography>
            
            <Typography variant="h6" sx={{ opacity: 0.95, lineHeight: 1.6, mb: 3 }}>
              {course.description}
            </Typography>

            {!isEnrolled && (
              <Button
                variant="contained"
                size="large"
                startIcon={<SchoolIcon />}
                onClick={() => coursesAPI.enroll(1, course.id).then(() => loadCourseData())}
                sx={{
                  bgcolor: '#f59e0b',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  py: 1.5,
                  px: 4,
                  '&:hover': {
                    bgcolor: '#d97706',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Enroll in This Course
              </Button>
            )}
          </Grid>

          {isEnrolled && (
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: alpha('#fff', 0.15),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#fff', 0.2)}`,
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Your Progress
                  </Typography>
                  <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                    {Math.round(enrollment.progress)}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={enrollment.progress} 
                    sx={{ 
                      height: 10,
                      borderRadius: 5,
                      bgcolor: alpha('#fff', 0.2),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#f59e0b',
                        borderRadius: 5,
                      },
                    }}
                  />
                </Box>
                <Divider sx={{ my: 2, borderColor: alpha('#fff', 0.2) }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {completedModules}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Completed
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {totalModules}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Total Modules
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {totalModules - completedModules}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Remaining
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column - Course Content */}
        <Grid item xs={12} lg={8}>
          {!isEnrolled ? (
            <Paper 
              elevation={0}
              sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: 4,
                border: `2px dashed ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: mode === 'light' ? alpha('#1c7ed6', 0.1) : alpha('#339af0', 0.2),
                  color: mode === 'light' ? '#1c7ed6' : '#339af0',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <SchoolIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Enroll to Access Course Content
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Enroll in this course to access all modules, videos, practice questions, and assessments.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<SchoolIcon />}
                onClick={() => coursesAPI.enroll(1, course.id).then(() => loadCourseData())}
                sx={{
                  mt: 2,
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
              >
                Enroll Now - It's Free!
              </Button>
            </Paper>
          ) : showAssessment ? (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Module Assessment: {currentModule}
              </Typography>
              <AssessmentQuiz
                questions={moduleQuestions}
                timeLimit={15}
                onComplete={handleAssessmentComplete}
              />
            </Paper>
          ) : (
            <Box>
              {/* Module Header */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  mb: 3,
                  borderRadius: 4,
                  background: mode === 'light'
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                  border: `1px solid ${mode === 'light' ? alpha('#339af0', 0.2) : alpha('#339af0', 0.3)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: mode === 'light' ? '#339af0' : alpha('#339af0', 0.3),
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.5rem',
                    }}
                  >
                    {activeModule + 1}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Module {activeModule + 1} of {totalModules}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {currentModule}
                    </Typography>
                  </Box>
                </Box>
                
                <Alert 
                  severity="info" 
                  icon={<MenuBook />}
                  sx={{ 
                    mt: 3,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: 28,
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    📚 How to Complete This Module:
                  </Typography>
                  <Typography variant="body2" component="div">
                    1. Review the learning materials (video & PDF)<br/>
                    2. Practice with unlimited practice questions<br/>
                    3. Take the module quiz to test your knowledge<br/>
                    4. Score 70% or higher to unlock the next module
                  </Typography>
                </Alert>
              </Paper>

              {/* Learning Materials — inline like W3Schools */}
              <Box sx={{ mb: 3 }}>

                {/* Video — embedded inline */}
                {currentModuleData?.videoUrl ? (
                  <Paper elevation={0} sx={{
                    mb: 3, borderRadius: 3, overflow: 'hidden',
                    border: `1px solid ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
                  }}>
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2,
                      bgcolor: mode === 'light' ? '#fef2f2' : alpha('#ef4444', 0.1),
                      borderBottom: `1px solid ${mode === 'light' ? '#fecaca' : alpha('#ef4444', 0.2)}`,
                    }}>
                      <Avatar sx={{ bgcolor: '#ef4444', width: 32, height: 32 }}>
                        <PlayIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Video Lecture</Typography>
                    </Box>
                    <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: '#000' }}>
                      {currentModuleData.videoUrl.includes('youtube') || currentModuleData.videoUrl.includes('youtu.be') || currentModuleData.videoUrl.includes('vimeo') ? (
                        <iframe
                          src={currentModuleData.videoUrl.includes('watch?v=')
                            ? currentModuleData.videoUrl.replace('watch?v=', 'embed/')
                            : currentModuleData.videoUrl}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          controls
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                          src={getFileUrl(currentModuleData.videoUrl)}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </Box>
                  </Paper>
                ) : (
                  <Paper elevation={0} sx={{
                    mb: 3, p: 3, borderRadius: 3, textAlign: 'center',
                    border: `1px dashed ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
                    bgcolor: mode === 'light' ? '#fafafa' : alpha('#fff', 0.02),
                  }}>
                    <PlayIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">No video uploaded for this module yet</Typography>
                  </Paper>
                )}

                {/* PDF / Document — embedded inline */}
                {currentModuleData?.contentUrl ? (
                  <Paper elevation={0} sx={{
                    mb: 3, borderRadius: 3, overflow: 'hidden',
                    border: `1px solid ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
                  }}>
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2,
                      bgcolor: mode === 'light' ? '#f5f3ff' : alpha('#8b5cf6', 0.1),
                      borderBottom: `1px solid ${mode === 'light' ? '#ddd6fe' : alpha('#8b5cf6', 0.2)}`,
                    }}>
                      <Avatar sx={{ bgcolor: '#8b5cf6', width: 32, height: 32 }}>
                        <BookIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Reading Material</Typography>
                      <Button
                        size="small" variant="outlined"
                        sx={{ ml: 'auto', borderColor: '#8b5cf6', color: '#8b5cf6', textTransform: 'none', fontWeight: 600 }}
                        onClick={() => window.open(getFileUrl(currentModuleData.contentUrl), '_blank')}
                      >
                        Open in new tab
                      </Button>
                    </Box>
                    <Box sx={{ height: 600 }}>
                      <iframe
                        src={getFileUrl(currentModuleData.contentUrl)}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Reading Material"
                      />
                    </Box>
                  </Paper>
                ) : (
                  <Paper elevation={0} sx={{
                    mb: 3, p: 3, borderRadius: 3, textAlign: 'center',
                    border: `1px dashed ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
                    bgcolor: mode === 'light' ? '#fafafa' : alpha('#fff', 0.02),
                  }}>
                    <BookIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">No reading material uploaded for this module yet</Typography>
                  </Paper>
                )}
              </Box>

              {/* Practice & Assessment Actions */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Practice Questions */}
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: `2px solid ${mode === 'light' ? '#10b981' : alpha('#10b981', 0.3)}`,
                      background: mode === 'light'
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(16, 185, 129, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: alpha('#10b981', 0.15), color: '#10b981', width: 48, height: 48 }}>
                          <PracticeIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Practice Questions
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 60 }}>
                        Test your understanding with unlimited practice questions. Get instant feedback and detailed explanations.
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={!currentModuleData?.id}
                        startIcon={<PracticeIcon />}
                        onClick={() => navigate(`/taxpayer/courses/${id}/modules/${currentModuleData?.id}/practice`)}
                        sx={{
                          bgcolor: '#10b981',
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: '#059669',
                          },
                        }}
                      >
                        Practice Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Module Quiz */}
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: `2px solid ${mode === 'light' ? '#f59e0b' : alpha('#f59e0b', 0.3)}`,
                      background: mode === 'light'
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(245, 158, 11, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: alpha('#f59e0b', 0.15), color: '#f59e0b', width: 48, height: 48 }}>
                          <QuizIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Module Quiz
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 60 }}>
                        Take the official module quiz. Score 70% or higher to unlock the next module. Time: 15 minutes.
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={!currentModuleData?.id}
                        startIcon={<QuizIcon />}
                        onClick={() => navigate(`/taxpayer/module/${currentModuleData?.id}/quiz`)}
                        sx={{
                          bgcolor: '#f59e0b',
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: '#d97706',
                          },
                        }}
                      >
                        Take Quiz
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Full Lesson & Assessment */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  mb: 3,
                  borderRadius: 4,
                  background: mode === 'light'
                    ? 'linear-gradient(135deg, #1c7ed6 0%, #339af0 100%)'
                    : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  color: 'white',
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 56, height: 56 }}>
                        <MenuBook sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Full Lesson Content
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Complete lesson with objectives & materials
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={!currentModuleData?.id}
                      startIcon={<MenuBook />}
                      onClick={() => navigate(`/taxpayer/courses/${id}/modules/${currentModuleData?.id}/lesson`)}
                      sx={{
                        bgcolor: 'white',
                        color: '#1c7ed6',
                        fontWeight: 700,
                        '&:hover': {
                          bgcolor: alpha('#fff', 0.9),
                        },
                      }}
                    >
                      View Full Lesson
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha('#f59e0b', 0.3), width: 56, height: 56 }}>
                        <Assignment sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Module Assessment
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Score 70% or higher to pass
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<CheckIcon />}
                      onClick={() => setShowAssessment(true)}
                      sx={{
                        bgcolor: '#f59e0b',
                        color: 'white',
                        fontWeight: 700,
                        '&:hover': {
                          bgcolor: '#d97706',
                        },
                      }}
                    >
                      Take Assessment
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 3 }}>
                <Button
                  variant="outlined"
                  size="large"
                  disabled={activeModule === 0}
                  onClick={() => setActiveModule(activeModule - 1)}
                  sx={{
                    flex: 1,
                    fontWeight: 600,
                  }}
                >
                  ← Previous Module
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  disabled={activeModule >= modules.length - 1}
                  onClick={() => setActiveModule(activeModule + 1)}
                  sx={{
                    flex: 1,
                    fontWeight: 600,
                  }}
                >
                  Next Module →
                </Button>
              </Box>

              {/* Final Exam - Show when all modules are completed */}
              {completedModules >= totalModules && totalModules > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Background Pattern */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      bgcolor: alpha('#fff', 0.1),
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -30,
                      left: -30,
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      bgcolor: alpha('#fff', 0.08),
                    }}
                  />

                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 72, height: 72 }}>
                        <TrophyIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                          Ready for Final Exam!
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.95 }}>
                          🎉 All modules completed - Earn your certificate
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.95, fontSize: '1.1rem' }}>
                      Congratulations! You've completed all modules. Take the final exam to earn your certificate.
                      You need to score 80% or higher to pass. Time limit: 60 minutes.
                    </Typography>
                    
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<TrophyIcon />}
                      onClick={() => navigate(`/taxpayer/course/${id}/final-exam`)}
                      sx={{
                        bgcolor: 'white',
                        color: '#059669',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        py: 2,
                        px: 5,
                        '&:hover': {
                          bgcolor: alpha('#fff', 0.9),
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Take Final Exam & Get Certificate
                    </Button>
                  </Box>
                </Paper>
              )}
            </Box>
          )}
        </Grid>

        {/* Right Column - Modules & Progress */}
        <Grid item xs={12} lg={4}>
          {/* Course Modules */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3,
              borderRadius: 4,
              border: `1px solid ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Course Modules
            </Typography>
            <Stepper activeStep={completedModules} orientation="vertical">
              {modules.map((module: any, index: number) => {
                const moduleName = module.title || `Module ${index + 1}`;
                const isCompleted = index < completedModules;
                const isCurrent = index === activeModule;
                // First module always unlocked; others locked if not yet reached
                const isLocked = index > 0 && index > completedModules;
                
                return (
                  <Step key={index}>
                    <StepLabel
                      onClick={() => {
                        if (!isLocked) {
                          setActiveModule(index);
                          setShowAssessment(false);
                        }
                      }}
                      sx={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                      icon={
                        isCompleted ? (
                          <CheckIcon sx={{ color: '#10b981', fontSize: 28 }} />
                        ) : isLocked ? (
                          <LockIcon sx={{ color: '#9ca3af', fontSize: 24 }} />
                        ) : (
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: isCurrent ? '#339af0' : alpha('#339af0', 0.1),
                              color: isCurrent ? 'white' : '#339af0',
                              fontSize: '0.875rem',
                              fontWeight: 700,
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        )
                      }
                    >
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: isCurrent ? 700 : 600,
                            color: isLocked ? 'text.disabled' : 'text.primary',
                          }}
                        >
                          {moduleName}
                        </Typography>
                        {isCurrent && !showAssessment && (
                          <Chip 
                            label="Current" 
                            size="small" 
                            sx={{ 
                              mt: 0.5,
                              height: 20,
                              bgcolor: alpha('#339af0', 0.1),
                              color: '#339af0',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }} 
                          />
                        )}
                        {isCompleted && (
                          <Chip 
                            label="Completed" 
                            size="small" 
                            sx={{ 
                              mt: 0.5,
                              height: 20,
                              bgcolor: alpha('#10b981', 0.1),
                              color: '#10b981',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }} 
                          />
                        )}
                        {isLocked && (
                          <Chip 
                            label="Locked" 
                            size="small" 
                            sx={{ 
                              mt: 0.5,
                              height: 20,
                              bgcolor: alpha('#9ca3af', 0.1),
                              color: '#9ca3af',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }} 
                          />
                        )}
                      </Box>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Paper>

          {/* Course Statistics */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 4,
              border: `1px solid ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Course Statistics
            </Typography>
            <List disablePadding>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#339af0', 0.1), color: '#339af0' }}>
                    <TrendingUp fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      Modules Completed
                    </Typography>
                  }
                  secondary={
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {completedModules} of {totalModules}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b' }}>
                    <ScheduleIcon fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      Time Required
                    </Typography>
                  }
                  secondary={
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {course.durationHours} hours
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#8b5cf6', 0.1), color: '#8b5cf6' }}>
                    <StarIcon fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      Difficulty Level
                    </Typography>
                  }
                  secondary={
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {course.difficulty}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#10b981', 0.1), color: '#10b981' }}>
                    <BookIcon fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      Category
                    </Typography>
                  }
                  secondary={
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {course.category}
                    </Typography>
                  }
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


