import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Radio, RadioGroup,
  FormControlLabel, Alert, CircularProgress, Card, CardContent,
  Chip, LinearProgress,
} from '@mui/material';
import {
  CheckCircle, Cancel, Lightbulb, Refresh, ArrowBack,
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
  explanation: string;
  points: number;
  answers: Answer[];
}

interface Answer {
  id: number;
  answerText: string;
  isCorrect: boolean;
}

const PracticeQuestions: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    loadPracticeQuestions();
  }, [moduleId]);

  const loadPracticeQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/questions/module/${moduleId}/practice`,
        getAuthHeaders()
      );
      const data = response.data.data || response.data || [];
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load practice questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = async () => {
    if (selectedAnswer === null) {
      alert('Please select an answer');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/questions/practice/check-answer`,
        {
          questionId: questions[currentQuestionIndex].id,
          answerId: selectedAnswer,
        },
        getAuthHeaders()
      );

      const result = response.data.data || response.data;
      setFeedback(result);
      setShowFeedback(true);

      if (result.correct) {
        setCorrectCount(correctCount + 1);
      }
    } catch (error) {
      console.error('Failed to check answer:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setFeedback(null);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setFeedback(null);
    setCorrectCount(0);
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
          No practice questions available for this module yet.
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

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
          Practice Questions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Learn at your own pace - unlimited attempts, instant feedback
        </Typography>
      </Box>

      {/* Progress */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
            Correct: {correctCount} / {currentQuestionIndex + (showFeedback && feedback?.correct ? 1 : 0)}
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
      </Paper>

      {/* Question Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 3 }}>
            <Chip
              label={`${currentQuestion.points} point${currentQuestion.points > 1 ? 's' : ''}`}
              color="primary"
            />
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
              {currentQuestion.questionText}
            </Typography>
          </Box>

          <RadioGroup
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(Number(e.target.value))}
          >
            {currentQuestion.answers.map((answer) => (
              <Paper
                key={answer.id}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '2px solid',
                  borderColor: showFeedback
                    ? answer.isCorrect
                      ? '#10B981'
                      : selectedAnswer === answer.id
                      ? '#EF4444'
                      : '#e0e0e0'
                    : selectedAnswer === answer.id
                    ? '#667eea'
                    : '#e0e0e0',
                  bgcolor: showFeedback
                    ? answer.isCorrect
                      ? '#10B98110'
                      : selectedAnswer === answer.id
                      ? '#EF444410'
                      : 'white'
                    : 'white',
                  cursor: showFeedback ? 'default' : 'pointer',
                  transition: 'all 0.3s',
                }}
                onClick={() => !showFeedback && setSelectedAnswer(answer.id)}
              >
                <FormControlLabel
                  value={answer.id}
                  control={<Radio disabled={showFeedback} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{answer.answerText}</Typography>
                      {showFeedback && answer.isCorrect && (
                        <CheckCircle sx={{ color: '#10B981' }} />
                      )}
                      {showFeedback && !answer.isCorrect && selectedAnswer === answer.id && (
                        <Cancel sx={{ color: '#EF4444' }} />
                      )}
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            ))}
          </RadioGroup>

          {/* Feedback */}
          {showFeedback && feedback && (
            <Alert
              severity={feedback.correct ? 'success' : 'error'}
              icon={feedback.correct ? <CheckCircle /> : <Lightbulb />}
              sx={{ mt: 3 }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                {feedback.correct ? '✅ Correct!' : '❌ Not quite right'}
              </Typography>
              {feedback.explanation && (
                <Typography variant="body2">
                  <strong>Explanation:</strong> {feedback.explanation}
                </Typography>
              )}
              {!feedback.correct && feedback.correctAnswer && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Correct answer:</strong> {feedback.correctAnswer}
                </Typography>
              )}
            </Alert>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            {!showFeedback ? (
              <Button
                variant="contained"
                size="large"
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                fullWidth
              >
                Check Answer
              </Button>
            ) : (
              <>
                {!isLastQuestion ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    fullWidth
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Refresh />}
                    onClick={handleRetry}
                    fullWidth
                  >
                    Practice Again
                  </Button>
                )}
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Completion Message */}
      {isLastQuestion && showFeedback && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            🎉 Practice Complete!
          </Typography>
          <Typography variant="body2">
            You got {correctCount} out of {questions.length} questions correct.
            Feel free to practice again or move on to the module quiz!
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default PracticeQuestions;
