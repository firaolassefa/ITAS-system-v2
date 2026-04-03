import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Paper, Button, Chip, LinearProgress,
  Card, CardContent, Divider, Alert, Collapse, IconButton, Stack,
  Breadcrumbs, Link, Skeleton, Fade, alpha,
} from '@mui/material';
import {
  PlayArrow, CheckCircle, ExpandMore, ExpandLess, MenuBook,
  VideoLibrary, Description, Quiz, ArrowBack, ArrowForward,
  LightbulbOutlined, InfoOutlined, School,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api';

const getFileUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Static files served under /api context path
  return `${API_BASE_URL}${url}`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

interface Module {
  id: number;
  title: string;
  description: string;
  lessonContent: string;
  learningObjectives: string;
  videoUrl: string;
  contentUrl: string;
  durationMinutes: number;
  moduleOrder: number;
  isLocked: boolean;
}

interface ModuleProgress {
  completed: boolean;
  progress: number;
  completedAt: string;
}

const ModuleLesson: React.FC = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    objectives: true,
    content: true,
  });

  useEffect(() => {
    loadModuleData();
  }, [moduleId]);

  const loadModuleData = async () => {
    try {
      setLoading(true);
      const moduleRes = await axios.get(`${API_BASE_URL}/modules/${moduleId}`, getAuthHeaders());
      const moduleData = moduleRes.data.data || moduleRes.data;
      setModule(moduleData);

      // Check if module has quiz questions
      try {
        const quizRes = await axios.get(`${API_BASE_URL}/modules/${moduleId}/has-quiz`, getAuthHeaders());
        const quizData = quizRes.data.data || quizRes.data;
        setHasQuiz(quizData.hasQuiz === true);
      } catch { setHasQuiz(false); }

      // Try to get progress (non-critical)
      try {
        const user = JSON.parse(localStorage.getItem('itas_user') || '{}');
        const userId = user?.id || 1;
        const progressRes = await axios.get(`${API_BASE_URL}/module-progress/user/${userId}/module/${moduleId}`, getAuthHeaders());
        setProgress(progressRes.data.data || progressRes.data || { completed: false, progress: 0 });
      } catch { setProgress({ completed: false, progress: 0, completedAt: '' }); }

    } catch (error) {
      console.error('Failed to load module:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFinishReading = async () => {
    setCompleting(true);
    try {
      const user = JSON.parse(localStorage.getItem('itas_user') || '{}');
      const userId = user?.id || 1;
      await axios.post(
        `${API_BASE_URL}/courses/complete-module`,
        { userId, courseId: Number(courseId), moduleId: Number(moduleId) },
        getAuthHeaders()
      );
      if (hasQuiz) {
        // Has quiz — redirect to quiz
        navigate(`/taxpayer/courses/${courseId}/modules/${moduleId}/quiz`);
      } else {
        // No quiz — go back to course, module is complete
        navigate(`/taxpayer/courses/${courseId}`);
      }
    } catch (error) {
      console.error('Failed to complete module:', error);
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      </Container>
    );
  }

  if (!module) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Module not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/taxpayer/courses')}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <School sx={{ mr: 0.5, fontSize: 20 }} />
          Courses
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate(`/taxpayer/courses/${courseId}`)}
          sx={{ cursor: 'pointer' }}
        >
          Course Details
        </Link>
        <Typography color="text.primary">{module.title}</Typography>
      </Breadcrumbs>

      {/* Module Header */}
      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: alpha('#FFFFFF', 0.1),
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                icon={<MenuBook />}
                label={`Module ${(module.moduleOrder ?? 0) + 1}`}
                sx={{
                  background: alpha('#FFFFFF', 0.2),
                  color: '#FFFFFF',
                  fontWeight: 700,
                }}
              />
              {progress?.completed && (
                <Chip
                  icon={<CheckCircle />}
                  label="Completed"
                  sx={{
                    background: alpha('#10B981', 0.9),
                    color: '#FFFFFF',
                    fontWeight: 700,
                  }}
                />
              )}
              {module.durationMinutes && (
                <Chip
                  label={`${module.durationMinutes} minutes`}
                  sx={{
                    background: alpha('#FFFFFF', 0.2),
                    color: '#FFFFFF',
                  }}
                />
              )}
            </Stack>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              {module.title}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
              {module.description}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress?.progress || 0}
              sx={{
                height: 8,
                borderRadius: 4,
                background: alpha('#FFFFFF', 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: '#10B981',
                },
              }}
            />
          </Box>
        </Paper>
      </Fade>

      {/* Learning Objectives */}
      {module.learningObjectives && (
        <Fade in timeout={800}>
          <Card
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha('#339af0', 0.2),
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => toggleSection('objectives')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LightbulbOutlined sx={{ color: '#F59E0B' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Learning Objectives
                  </Typography>
                </Box>
                <IconButton size="small">
                  {expandedSections.objectives ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              <Collapse in={expandedSections.objectives}>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{ pl: 2 }}
                  dangerouslySetInnerHTML={{ __html: module.learningObjectives }}
                />
              </Collapse>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Video Content */}
      {module.videoUrl && (
        <Fade in timeout={1000}>
          <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: alpha('#ef4444', 0.2) }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VideoLibrary sx={{ color: '#EF4444' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Video Lesson</Typography>
                </Box>
                <Button size="small" variant="outlined" sx={{ borderColor: '#ef4444', color: '#ef4444', textTransform: 'none' }}
                  onClick={() => window.open(getFileUrl(module.videoUrl), '_blank')}>
                  Open in new tab
                </Button>
              </Box>
              {module.videoUrl.includes('youtube') || module.videoUrl.includes('youtu.be') || module.videoUrl.includes('vimeo') ? (
                <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 2, overflow: 'hidden', background: '#000' }}>
                  <iframe
                    src={module.videoUrl.includes('watch?v=') ? module.videoUrl.replace('watch?v=', 'embed/') : module.videoUrl}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              ) : (
                <Box sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#000' }}>
                  <video controls style={{ width: '100%', maxHeight: 480, display: 'block' }} src={getFileUrl(module.videoUrl)}>
                    Your browser does not support the video tag.
                  </video>
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Reading Material / PDF */}
      {module.contentUrl && (
        <Fade in timeout={1100}>
          <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: alpha('#8b5cf6', 0.2) }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description sx={{ color: '#8b5cf6' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Reading Material</Typography>
                </Box>
                <Button size="small" variant="outlined" sx={{ borderColor: '#8b5cf6', color: '#8b5cf6', textTransform: 'none' }}
                  onClick={() => window.open(getFileUrl(module.contentUrl), '_blank')}>
                  Open in new tab
                </Button>
              </Box>
              <Box sx={{ height: 600, borderRadius: 2, overflow: 'hidden' }}>
                <iframe src={getFileUrl(module.contentUrl)} style={{ width: '100%', height: '100%', border: 'none' }} title="Reading Material" />
              </Box>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Lesson Content */}
      {module.lessonContent && (
        <Fade in timeout={1200}>
          <Card
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha('#000', 0.1),
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: 2,
                }}
                onClick={() => toggleSection('content')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description sx={{ color: '#339af0' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Lesson Content
                  </Typography>
                </Box>
                <IconButton size="small">
                  {expandedSections.content ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              <Collapse in={expandedSections.content}>
                <Divider sx={{ mb: 3 }} />
                <Box
                  sx={{
                    '& h1, & h2, & h3': { fontWeight: 700, mb: 2, mt: 3 },
                    '& p': { mb: 2, lineHeight: 1.8 },
                    '& ul, & ol': { pl: 3, mb: 2 },
                    '& li': { mb: 1 },
                    '& code': {
                      background: alpha('#339af0', 0.1),
                      padding: '2px 6px',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                    },
                    '& pre': {
                      background: '#f5f5f5',
                      p: 2,
                      borderRadius: 2,
                      overflow: 'auto',
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: module.lessonContent }}
                />
              </Collapse>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Action Buttons */}
      <Fade in timeout={1400}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: alpha('#000', 0.1),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/taxpayer/courses/${courseId}`)}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Back to Course
          </Button>
          <Stack direction="row" spacing={2}>
            {hasQuiz && (
              <Button
                variant="outlined"
                endIcon={<Quiz />}
                onClick={() => navigate(`/taxpayer/courses/${courseId}/modules/${moduleId}/practice`)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Practice Questions
              </Button>
            )}
            <Button
              variant="contained"
              disabled={completing || progress?.completed}
              endIcon={hasQuiz ? <ArrowForward /> : <CheckCircle />}
              onClick={handleFinishReading}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                background: hasQuiz
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)',
              }}
            >
              {completing ? 'Saving...' : progress?.completed ? 'Completed ✓' : hasQuiz ? 'Finish Reading → Take Quiz' : 'Mark as Complete'}
            </Button>
          </Stack>
        </Paper>
      </Fade>

      {/* Info Alert */}
      <Alert severity="info" icon={<InfoOutlined />} sx={{ mt: 3, borderRadius: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {hasQuiz
            ? 'Review the materials above, then click "Finish Reading → Take Quiz" to test your knowledge.'
            : 'Review the materials above, then click "Mark as Complete" to unlock the next module.'}
        </Typography>
      </Alert>
    </Container>
  );
};

export default ModuleLesson;


