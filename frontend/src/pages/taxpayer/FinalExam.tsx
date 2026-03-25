import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Radio, RadioGroup,
  FormControlLabel, Alert, CircularProgress, Card, CardContent,
  Chip, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Stepper, Step, StepLabel, alpha,
} from '@mui/material';
import { Timer, ArrowBack, ArrowForward, EmojiEvents, Warning } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';

const BLUE = '#339af0';
const GOLD = '#f59e0b';

interface Answer { id: number; answerText: string; }
interface Question { id: number; questionText: string; questionType: string; points: number; answers: Answer[]; }

const FinalExam: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  useEffect(() => { loadFinalExamQuestions(); }, [courseId]);

  useEffect(() => {
    if (questions.length > 0 && !result) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { handleSubmit(); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [questions, result]);

  const loadFinalExamQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get(`/questions/course/${courseId}/final-exam`);
      const data = response.data.data || response.data || [];
      // Ensure it's an array
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load final exam questions:', err);
      // Show a meaningful error — do NOT let the axios interceptor redirect
      if (err.response?.status === 404) {
        setError('');  // 404 just means no questions yet — show empty state
        setQuestions([]);
      } else if (err.response?.status === 500) {
        setError('Server error loading exam questions. The database may need to be updated. Please contact your administrator.');
      } else if (!err.response) {
        setError('Cannot reach the server. Please check your connection and try again.');
      } else {
        setError(`Failed to load exam questions (${err.response?.status}). Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0 && timeLeft > 0) {
      if (!window.confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`)) return;
    }
    try {
      setSubmitting(true);
      // Calculate score locally
      let earnedPoints = 0;
      let totalPoints = 0;
      questions.forEach(q => {
        totalPoints += q.points;
        const selectedId = answers[q.id];
        if (selectedId) {
          const selectedAnswer = q.answers.find(a => a.id === selectedId);
          // We don't have isCorrect on the answer here (hidden for final exam)
          // Submit to backend which will calculate
        }
      });

      const response = await apiClient.post(`/assessments/final-exam/submit`, {
        userId: user.id,
        courseId: Number(courseId),
        answers: answers,
      });
      const data = response.data.data || response.data;
      setResult(data);
      setShowResultDialog(true);

      // If passed (75%+), generate certificate
      if (data.passed) {
        try {
          await apiClient.post('/certificates/generate', { userId: user.id, courseId: Number(courseId) });
        } catch (certErr) {
          console.error('Certificate generation error:', certErr);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: BLUE }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          No final exam questions available yet. Please complete all modules first.
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  const progress = (Object.keys(answers).length / questions.length) * 100;
  const currentQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2, color: BLUE }}>
          Back to Course
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: BLUE }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Final Exam</Typography>
        </Box>
        <Alert severity="warning" sx={{ mb: 2, border: `1px solid ${alpha(GOLD, 0.4)}` }}>
          You must score at least <strong>75%</strong> to pass and earn your certificate.
        </Alert>
      </Box>

      {/* Timer and Progress */}
      <Paper sx={{ p: 3, mb: 3, border: `1px solid ${alpha(BLUE, 0.15)}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timer sx={{ color: timeLeft < 300 ? '#ef4444' : BLUE }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: timeLeft < 300 ? '#ef4444' : BLUE }}>
              {formatTime(timeLeft)}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Answered: {Object.keys(answers).length} / {questions.length}
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress}
          sx={{ height: 10, borderRadius: 5, bgcolor: alpha(BLUE, 0.1),
            '& .MuiLinearProgress-bar': { bgcolor: BLUE } }} />
      </Paper>

      {/* Page Stepper */}
      {totalPages > 1 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stepper activeStep={currentPage} alternativeLabel>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Step key={i} onClick={() => setCurrentPage(i)} sx={{ cursor: 'pointer' }}>
                <StepLabel>Page {i + 1}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      {/* Questions */}
      {currentQuestions.map((question, index) => {
        const globalIndex = currentPage * questionsPerPage + index;
        const isAnswered = !!answers[question.id];
        return (
          <Card key={question.id} sx={{ mb: 3, border: `1px solid ${isAnswered ? alpha(BLUE, 0.3) : '#e0e0e0'}`,
            borderLeft: `4px solid ${isAnswered ? BLUE : '#e0e0e0'}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Chip label={`Q${globalIndex + 1}`} size="small"
                  sx={{ bgcolor: isAnswered ? BLUE : alpha(BLUE, 0.1), color: isAnswered ? 'white' : BLUE, fontWeight: 700 }} />
                <Chip label={`${question.points} pt${question.points > 1 ? 's' : ''}`} size="small" variant="outlined" />
                <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>{question.questionText}</Typography>
                {isAnswered && <Chip label="Answered" size="small" sx={{ bgcolor: alpha(BLUE, 0.1), color: BLUE }} />}
              </Box>
              <RadioGroup value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, Number(e.target.value))}>
                {question.answers.map(answer => (
                  <Paper key={answer.id} sx={{
                    p: 2, mb: 1, border: '2px solid', cursor: 'pointer',
                    borderColor: answers[question.id] === answer.id ? BLUE : '#e0e0e0',
                    bgcolor: answers[question.id] === answer.id ? alpha(BLUE, 0.05) : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: BLUE, bgcolor: alpha(BLUE, 0.04) },
                  }} onClick={() => handleAnswerChange(question.id, answer.id)}>
                    <FormControlLabel value={answer.id} control={<Radio sx={{ color: BLUE, '&.Mui-checked': { color: BLUE } }} />}
                      label={answer.answerText} sx={{ width: '100%', m: 0 }} />
                  </Paper>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );
      })}

      {/* Navigation */}
      <Paper sx={{ p: 3, position: 'sticky', bottom: 0, border: `1px solid ${alpha(BLUE, 0.15)}` }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />}
            onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}
            sx={{ flex: 1, borderColor: BLUE, color: BLUE }}>
            Previous
          </Button>
          {currentPage < totalPages - 1 ? (
            <Button variant="contained" endIcon={<ArrowForward />}
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{ flex: 1, bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
              Next Page
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit} disabled={submitting}
              sx={{ flex: 1, py: 1.5, bgcolor: GOLD, color: 'white', fontWeight: 700,
                '&:hover': { bgcolor: '#d97706' } }}>
              {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit Final Exam'}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} maxWidth="sm" fullWidth disableEscapeKeyDown>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          {result?.passed
            ? <EmojiEvents sx={{ fontSize: 72, color: GOLD }} />
            : <Warning sx={{ fontSize: 72, color: GOLD }} />}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
              {result?.passed ? 'Congratulations! You Passed!' : 'Not Passed'}
            </Typography>
            <Paper sx={{ p: 4, mb: 3, bgcolor: result?.passed ? alpha(BLUE, 0.05) : alpha(GOLD, 0.08),
              border: `2px solid ${result?.passed ? BLUE : GOLD}`, borderRadius: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, color: result?.passed ? BLUE : GOLD, mb: 1 }}>
                {result?.percentage}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {result?.earnedPoints} / {result?.totalPoints} points
              </Typography>
            </Paper>
            <Alert severity={result?.passed ? 'success' : 'warning'} sx={{ mb: 2 }}>
              {result?.feedback || (result?.passed
                ? 'You passed! Your certificate has been generated.'
                : 'You need 75% to pass. Please review the material and try again.')}
            </Alert>
            {result?.passed && (
              <Alert severity="success" icon={<EmojiEvents />}>
                Your certificate has been generated. Go to <strong>My Certificates</strong> to view and download it.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          {result?.passed ? (
            <Button variant="contained" size="large"
              onClick={() => navigate('/taxpayer/certificates')}
              sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
              View My Certificates
            </Button>
          ) : (
            <>
              <Button variant="outlined" onClick={() => navigate(-1)}
                sx={{ borderColor: BLUE, color: BLUE }}>
                Review Course
              </Button>
              <Button variant="contained" onClick={() => {
                setShowResultDialog(false); setResult(null);
                setAnswers({}); setCurrentPage(0); setTimeLeft(3600);
                loadFinalExamQuestions();
              }} sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
                Retry Exam
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinalExam;

