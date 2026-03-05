import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Button, Radio, RadioGroup, FormControlLabel,
  Card, CardContent, Alert, Chip, LinearProgress, alpha, CircularProgress,
} from '@mui/material';
import {
  CheckCircle, Cancel, Lightbulb, Quiz, TrendingUp, School,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';

interface Question {
  id: number;
  questionText: string;
  answers: Array<{
    id: number;
    answerText: string;
    isCorrect: boolean;
  }>;
  explanation?: string;
  points: number;
}

const PracticeQuiz: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPracticeQuestions();
  }, [moduleId]);

  const loadPracticeQuestions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/questions/module/${moduleId}`);
      const allQuestions = response.data.data || response.data || [];
      
      // Filter only practice questions
      const practiceQuestions = allQuestions.filter((q: any) => q.isPractice === true);
      setQuestions(practiceQuestions);
    } catch (error) {
      console.error('Failed to load practice questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentIndex];
    const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);
    const correct = selectedAnswer === correctAnswer?.answerText;

    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer('');
    setShowResult(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="info">
          No practice questions available for this module yet.
        </Alert>
      </Container>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Quiz completed
  if (isLastQuestion && showResult && isCorrect) {
    const percentage = (score / questions.length) * 100;

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 3,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                mb: 2,
              }}
            >
              <School sx={{ fontSize: 64, color: 'white' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {percentage.toFixed(0)}%
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#10B981' }}>
              Practice Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You got {score} out of {questions.length} questions correct
            </Typography>
          </Box>

          <Alert severity="success" icon={<TrendingUp />} sx={{ mb: 3 }}>
            Great job practicing! Keep learning to improve your score.
          </Alert>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleRestart}
            sx={{
              py: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '1.1rem',
              fontWeight: 700,
            }}
          >
            Practice Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Progress Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Question {currentIndex + 1} of {questions.length}
          </Typography>
          <Chip
            icon={<Quiz />}
            label={`Score: ${score}/${currentIndex + (showResult && isCorrect ? 1 : 0)}`}
            color="primary"
            sx={{ fontWeight: 700 }}
          />
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
      </Paper>

      {/* Question Card */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.2rem',
            }}
          >
            {currentIndex + 1}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
            {currentQuestion.questionText}
          </Typography>
          <Chip label={`${currentQuestion.points} pts`} />
        </Box>

        {/* Answer Options */}
        {!showResult ? (
          <Box>
            <RadioGroup value={selectedAnswer} onChange={(e) => setSelectedAnswer(e.target.value)}>
              {currentQuestion.answers.map((answer, index) => (
                <FormControlLabel
                  key={answer.id}
                  value={answer.answerText}
                  control={<Radio />}
                  label={answer.answerText}
                  sx={{
                    p: 2,
                    mb: 1,
                    border: '2px solid',
                    borderColor: selectedAnswer === answer.answerText ? '#667eea' : '#e5e7eb',
                    borderRadius: 2,
                    background: selectedAnswer === answer.answerText ? alpha('#667eea', 0.05) : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: alpha('#667eea', 0.05),
                      borderColor: '#667eea',
                    },
                  }}
                />
              ))}
            </RadioGroup>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              sx={{
                mt: 3,
                py: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1.1rem',
                fontWeight: 700,
              }}
            >
              Submit Answer
            </Button>
          </Box>
        ) : (
          <Box>
            {/* Show Result */}
            <Alert
              severity={isCorrect ? 'success' : 'error'}
              icon={isCorrect ? <CheckCircle /> : <Cancel />}
              sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600 }}
            >
              {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </Alert>

            {/* Show Selected Answer */}
            <Card sx={{ mb: 2, background: isCorrect ? alpha('#10B981', 0.05) : alpha('#EF4444', 0.05) }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Your Answer:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedAnswer}
                </Typography>
              </CardContent>
            </Card>

            {/* Show Correct Answer if wrong */}
            {!isCorrect && (
              <Card sx={{ mb: 2, background: alpha('#10B981', 0.05) }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Correct Answer:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#10B981' }}>
                    {currentQuestion.answers.find(a => a.isCorrect)?.answerText}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Show Explanation */}
            {currentQuestion.explanation && (
              <Alert severity="info" icon={<Lightbulb />} sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Explanation:
                </Typography>
                <Typography variant="body2">
                  {currentQuestion.explanation}
                </Typography>
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isCorrect && (
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={handleTryAgain}
                  sx={{ py: 2, fontWeight: 700 }}
                >
                  Try Again
                </Button>
              )}
              {!isLastQuestion && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleNext}
                  sx={{
                    py: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 700,
                  }}
                >
                  Next Question
                </Button>
              )}
              {isLastQuestion && isCorrect && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleNext}
                  sx={{
                    py: 2,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    fontWeight: 700,
                  }}
                >
                  See Results
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PracticeQuiz;
