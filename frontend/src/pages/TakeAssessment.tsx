import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, Radio, RadioGroup,
  FormControlLabel, FormControl, FormLabel, CircularProgress,
  Alert, LinearProgress, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Paper,
} from '@mui/material';
import {
  CheckCircle, Cancel, EmojiEvents, ArrowBack, Timer,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

interface Question {
  id: number;
  questionText: string;
  questionType: string;
  points: number;
  order: number;
  answers: Answer[];
}

interface Answer {
  id: number;
  answerText: string;
  isCorrect: boolean;
  order: number;
}

interface AssessmentResult {
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  passed: boolean;
  feedback: string;
}

const TakeAssessment: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    loadQuestions();
    
    // Start timer
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [moduleId]);

  const loadQuestions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/questions/module/${moduleId}`,
        getAuthHeaders()
      );
      const data = response.data.data || response.data || [];
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setAnswers({
      ...answers,
      [questionId]: answerId,
    });
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/questions/submit-assessment`,
        {
          moduleId: parseInt(moduleId!),
          userId: user?.id,
          answers: answers,
        },
        getAuthHeaders()
      );

      const resultData = response.data.data || response.data;
      setResult(resultData);
      setShowResult(true);
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    return (answered / questions.length) * 100;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Box>
        <Alert severity="info">
          No questions available for this module yet.
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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Module Assessment
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              icon={<Timer />}
              label={formatTime(timeElapsed)}
              color="primary"
              variant="outlined"
            />
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress: {Object.keys(answers).length} of {questions.length} questions answered
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(getProgress())}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={getProgress()} sx={{ height: 8, borderRadius: 4 }} />
        </Paper>

        <Alert severity="info" sx={{ mb: 2 }}>
          Answer all questions and click "Submit Assessment" when ready. Passing grade: 70%
        </Alert>
      </Box>

      {/* Questions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {questions.map((question, index) => (
          <Card key={question.id} sx={{ position: 'relative' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {question.questionText}
                  </Typography>
                </Box>
                <Chip
                  label={`${question.points} ${question.points === 1 ? 'point' : 'points'}`}
                  size="small"
                  color="primary"
                />
              </Box>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                >
                  {question.answers.map((answer) => (
                    <FormControlLabel
                      key={answer.id}
                      value={answer.id}
                      control={<Radio />}
                      label={answer.answerText}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: answers[question.id] === answer.id ? 'primary.main' : 'grey.300',
                        bgcolor: answers[question.id] === answer.id ? 'primary.50' : 'transparent',
                        '&:hover': {
                          bgcolor: 'grey.50',
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Submit Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={submitting || Object.keys(answers).length !== questions.length}
          sx={{ minWidth: 200 }}
        >
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </Button>
      </Box>

      {/* Result Dialog */}
      <Dialog open={showResult} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {result?.passed ? (
              <EmojiEvents sx={{ fontSize: 48, color: 'success.main' }} />
            ) : (
              <Cancel sx={{ fontSize: 48, color: 'error.main' }} />
            )}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {result?.passed ? 'Congratulations!' : 'Not Passed'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assessment completed in {formatTime(timeElapsed)}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Score Display */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: result?.passed ? 'success.50' : 'error.50' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: result?.passed ? 'success.main' : 'error.main' }}>
                    {result?.percentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your Score
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {result?.earnedPoints}/{result?.totalPoints}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Points Earned
                  </Typography>
                </Box>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={result?.percentage || 0}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: result?.passed ? 'success.main' : 'error.main',
                  },
                }}
              />
            </Paper>

            {/* Feedback */}
            <Alert severity={result?.passed ? 'success' : 'warning'} sx={{ mb: 2 }}>
              {result?.feedback}
            </Alert>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Paper sx={{ flex: 1, p: 2, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {questions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Questions
                </Typography>
              </Paper>
              <Paper sx={{ flex: 1, p: 2, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {Math.round((result?.earnedPoints || 0) / (result?.totalPoints || 1) * questions.length)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct Answers
                </Typography>
              </Paper>
              <Paper sx={{ flex: 1, p: 2, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  70%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Passing Grade
                </Typography>
              </Paper>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {result?.passed ? (
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={() => navigate('/taxpayer/dashboard')}
              startIcon={<CheckCircle />}
            >
              Continue to Dashboard
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate(-1)}
              >
                Review Module
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setShowResult(false);
                  setAnswers({});
                  setTimeElapsed(0);
                  setResult(null);
                }}
              >
                Retake Assessment
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TakeAssessment;
