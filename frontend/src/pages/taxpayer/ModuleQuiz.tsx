import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Radio, RadioGroup,
  FormControlLabel, Alert, CircularProgress, Card, CardContent,
  Chip, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  Timer, ArrowBack, CheckCircle, Warning, EmojiEvents,
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

const ModuleQuiz: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  useEffect(() => {
    loadQuizQuestions();
  }, [moduleId]);

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

  const loadQuizQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/questions/module/${moduleId}/quiz`,
        getAuthHeaders()
      );
      const data = response.data.data || response.data || [];
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load quiz questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0 && timeLeft > 0) {
      if (!window.confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`)) {
        return;
      }
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/questions/module-quiz/submit`,
        {
          moduleId: Number(moduleId),
          userId: user.id,
          answers: answers,
        },
        getAuthHeaders()
      );

      const data = response.data.data || response.data;
      setResult(data);
      setShowResultDialog(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          No quiz questions available for this module yet.
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

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Module
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Module Quiz
        </Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must score at least 70% to pass and unlock the next module.
        </Alert>
      </Box>

      {/* Timer and Progress */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timer color={timeLeft < 60 ? 'error' : 'primary'} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: timeLeft < 60 ? '#EF4444' : 'primary.main',
              }}
            >
              {formatTime(timeLeft)}
            </Typography>
          </Box>
          <Typography variant="body2">
            Answered: {Object.keys(answers).length} / {questions.length}
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
      </Paper>

      {/* Questions */}
      {questions.map((question, index) => (
        <Card key={question.id} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
              <Chip label={`Q${index + 1}`} color="primary" />
              <Chip label={`${question.points} pt${question.points > 1 ? 's' : ''}`} />
              <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
                {question.questionText}
              </Typography>
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
                    borderColor: answers[question.id] === answer.id ? '#339af0' : '#e0e0e0',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#339af0',
                      bgcolor: '#339af010',
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
      ))}

      {/* Submit Button */}
      <Paper sx={{ p: 3, position: 'sticky', bottom: 0 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={submitting || Object.keys(answers).length === 0}
          fullWidth
          sx={{ py: 2 }}
        >
          {submitting ? <CircularProgress size={24} /> : 'Submit Quiz'}
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          Total Points: {totalPoints}
        </Typography>
      </Paper>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ textAlign: 'center' }}>
            {result?.passed ? (
              <EmojiEvents sx={{ fontSize: 64, color: '#10B981', mb: 2 }} />
            ) : (
              <Warning sx={{ fontSize: 64, color: '#F59E0B', mb: 2 }} />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              {result?.passed ? 'Congratulations! ðŸŽ‰' : 'Not Quite There Yet'}
            </Typography>
            
            <Paper sx={{ p: 3, mb: 2, bgcolor: result?.passed ? '#10B98110' : '#F59E0B10' }}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: result?.passed ? '#10B981' : '#F59E0B' }}>
                {result?.percentage}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {result?.earnedPoints} / {result?.totalPoints} points
              </Typography>
            </Paper>

            <Alert severity={result?.passed ? 'success' : 'warning'}>
              {result?.feedback}
            </Alert>

            {result?.passed && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ðŸ”“ Next module unlocked!
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          {result?.passed ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(-1)}
            >
              Continue to Next Module
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
              >
                Review Module
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setShowResultDialog(false);
                  setResult(null);
                  setAnswers({});
                  setTimeLeft(900);
                  loadQuizQuestions();
                }}
              >
                Try Again
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModuleQuiz;


