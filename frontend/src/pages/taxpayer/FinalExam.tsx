import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Radio, RadioGroup,
  FormControlLabel, Alert, CircularProgress, Card, CardContent,
  Chip, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Stepper, Step, StepLabel,
} from '@mui/material';
import {
  Timer, ArrowBack, ArrowForward, EmojiEvents, Warning, Download,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  };
};

interface Question {
  id: number;
  questionText: string;
  questionType: string;
  points: number;
  answers: Answer[];
}

interface Answer {
  id: number;
  answerText: string;
}

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
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes

  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  useEffect(() => {
    loadFinalExamQuestions();
  }, [courseId]);

  useEffect(() => {
    if (questions.length > 0 && !result) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [questions, result]);

  const loadFinalExamQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/assessments/course/${courseId}/final-exam`,
        getAuthHeaders()
      );
      const data = response.data.data || response.data || [];
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load final exam questions:', error);
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
      if (!window.confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`)) {
        return;
      }
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/assessments/final-exam/submit`,
        {
          userId: user.id,
          courseId: Number(courseId),
          answers: answers,
        },
        getAuthHeaders()
      );

      const data = response.data.data || response.data;
      setResult(data);
      setShowResultDialog(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadCertificate = () => {
    if (result?.certificateId) {
      window.open(`${API_BASE_URL}/certificates/${result.certificateId}/download`, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">
          No exam questions available yet. Please complete all modules first.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const progress = (Object.keys(answers).length / questions.length) * 100;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Course
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Final Exam
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            ⚠️ Important: You must score at least 80% to pass and earn your certificate.
          </Typography>
        </Alert>
      </Box>

      {/* Timer and Progress */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timer color={timeLeft < 300 ? 'error' : 'primary'} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: timeLeft < 300 ? '#EF4444' : 'primary.main',
              }}
            >
              {formatTime(timeLeft)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Answered: {Object.keys(answers).length} / {questions.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Points: {totalPoints}
            </Typography>
          </Box>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
      </Paper>

      {/* Page Stepper */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={currentPage} alternativeLabel>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Step key={index}>
              <StepLabel>
                Page {index + 1}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Questions */}
      {currentQuestions.map((question, index) => {
        const globalIndex = currentPage * questionsPerPage + index;
        return (
          <Card key={question.id} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                <Chip label={`Q${globalIndex + 1}`} color="primary" />
                <Chip label={`${question.points} pt${question.points > 1 ? 's' : ''}`} />
                <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
                  {question.questionText}
                </Typography>
                {answers[question.id] && (
                  <Chip label="Answered" color="success" size="small" />
                )}
              </Box>

              <RadioGroup
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, Number(e.target.value))}
              >
                {question.answers.map((answer) => (
                  <Paper
                    key={answer.id}
                    sx={{
                      p: 2,
                      mb: 1,
                      border: '2px solid',
                      borderColor: answers[question.id] === answer.id ? '#667eea' : '#e0e0e0',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#667eea',
                        bgcolor: '#667eea10',
                      },
                    }}
                    onClick={() => handleAnswerChange(question.id, answer.id)}
                  >
                    <FormControlLabel
                      value={answer.id}
                      control={<Radio />}
                      label={answer.answerText}
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );
      })}

      {/* Navigation */}
      <Paper sx={{ p: 3, position: 'sticky', bottom: 0 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
            sx={{ flex: 1 }}
          >
            Previous
          </Button>

          {currentPage < totalPages - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{ flex: 1 }}
            >
              Next Page
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ flex: 1, py: 2 }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Submit Final Exam'}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} maxWidth="md" fullWidth disableEscapeKeyDown>
        <DialogTitle>
          <Box sx={{ textAlign: 'center' }}>
            {result?.passed ? (
              <EmojiEvents sx={{ fontSize: 80, color: '#10B981', mb: 2 }} />
            ) : (
              <Warning sx={{ fontSize: 80, color: '#F59E0B', mb: 2 }} />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              {result?.passed ? '🎉 Congratulations!' : 'Keep Trying!'}
            </Typography>
            
            <Paper sx={{ p: 4, mb: 3, bgcolor: result?.passed ? '#10B98110' : '#F59E0B10' }}>
              <Typography variant="h1" sx={{ fontWeight: 900, color: result?.passed ? '#10B981' : '#F59E0B', mb: 1 }}>
                {result?.percentage}%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {result?.earnedPoints} / {result?.totalPoints} points
              </Typography>
            </Paper>

            <Alert severity={result?.passed ? 'success' : 'warning'} sx={{ mb: 2 }}>
              <Typography variant="body1">
                {result?.feedback}
              </Typography>
            </Alert>

            {result?.passed && result?.certificateNumber && (
              <Paper sx={{ p: 3, bgcolor: '#667eea10', border: '2px solid #667eea' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  📜 Certificate Generated!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Certificate Number: <strong>{result.certificateNumber}</strong>
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownloadCertificate}
                  size="large"
                >
                  Download Certificate
                </Button>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          {result?.passed ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/taxpayer/certificates')}
            >
              View My Certificates
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
              >
                Review Course
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setShowResultDialog(false);
                  setResult(null);
                  setAnswers({});
                  setCurrentPage(0);
                  setTimeLeft(3600);
                  loadFinalExamQuestions();
                }}
              >
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
