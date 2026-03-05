import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Button, Radio, RadioGroup, FormControlLabel,
  FormControl, LinearProgress, Chip, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, Card, CardContent, Grid, alpha, CircularProgress, Divider,
} from '@mui/material';
import {
  Timer, CheckCircle, Cancel, EmojiEvents, Info, Warning, TrendingUp,
  School, Quiz,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';

interface Question {
  id: number;
  questionText: string;
  questionType: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

interface Assessment {
  id: number;
  title: string;
  description: string;
  assessmentType: 'MODULE_QUIZ' | 'FINAL_EXAM';
  isFinalExam: boolean;
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes: number;
  showCorrectAnswers: boolean;
  certificateRequired: boolean;
}

interface Attempt {
  attemptNumber: number;
  score: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
}

const TakeAssessment: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [result, setResult] = useState<any>(null);
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);

  const userId = JSON.parse(localStorage.getItem('itas_user') || '{}').id;

  useEffect(() => {
    loadAssessment();
  }, [assessmentId]);

  useEffect(() => {
    if (started && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, timeRemaining]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const [assessmentRes, questionsRes, attemptsRes] = await Promise.all([
        apiClient.get(`/assessment-definitions/${assessmentId}`),
        apiClient.get(`/questions/assessment/${assessmentId}`),
        apiClient.get(`/assessment-attempts/assessment/${assessmentId}/user/${userId}`),
      ]);

      const assessmentData = assessmentRes.data.data || assessmentRes.data;
      const questionsData = questionsRes.data.data || questionsRes.data || [];
      const attemptsData = attemptsRes.data.data || attemptsRes.data || [];

      setAssessment(assessmentData);
      setQuestions(questionsData);
      setAttempts(attemptsData);
      setTimeRemaining(assessmentData.timeLimitMinutes * 60);
    } catch (err: any) {
      setError('Failed to load assessment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (!assessment) return;
    
    const attemptsUsed = attempts.length;
    const attemptsRemaining = assessment.maxAttempts - attemptsUsed;

    if (attemptsRemaining <= 0) {
      setError('You have used all your attempts for this assessment');
      return;
    }

    if (assessment.isFinalExam && attemptsRemaining <= 1) {
      setWarningDialogOpen(true);
    } else {
      setStarted(true);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmDialogOpen(false);
    await submitAssessment();
  };

  const handleAutoSubmit = async () => {
    await submitAssessment();
  };

  const submitAssessment = async () => {
    try {
      const answersArray = questions.map(q => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] || '',
        isCorrect: answers[q.id] === q.correctAnswer,
        pointsEarned: answers[q.id] === q.correctAnswer ? q.points : 0,
      }));

      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
      const earnedPoints = answersArray.reduce((sum, a) => sum + a.pointsEarned, 0);
      const percentage = (earnedPoints / totalPoints) * 100;

      const payload = {
        userId,
        assessmentDefinitionId: parseInt(assessmentId!),
        attemptNumber: attempts.length + 1,
        score: earnedPoints,
        totalPoints,
        percentage,
        passed: percentage >= (assessment?.passingScore || 70),
        answers: JSON.stringify(answersArray),
        timeTakenMinutes: Math.ceil((assessment!.timeLimitMinutes * 60 - timeRemaining) / 60),
      };

      const response = await apiClient.post('/assessment-attempts', payload);
      const resultData = response.data.data || response.data;

      setResult({
        ...resultData,
        answersArray,
        totalQuestions: questions.length,
        correctAnswers: answersArray.filter(a => a.isCorrect).length,
      });
      setSubmitted(true);

      // If passed final exam, generate certificate
      if (assessment?.isFinalExam && resultData.passed) {
        await generateCertificate();
      }
    } catch (err: any) {
      setError('Failed to submit assessment');
      console.error(err);
    }
  };

  const generateCertificate = async () => {
    try {
      await apiClient.post('/certificates/generate', {
        userId,
        courseId: assessment?.courseId,
        assessmentId: parseInt(assessmentId!),
      });
    } catch (err) {
      console.error('Failed to generate certificate:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (assessment!.timeLimitMinutes * 60)) * 100;
    if (percentage > 50) return '#10B981';
    if (percentage > 20) return '#F59E0B';
    return '#EF4444';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!assessment) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Assessment not found</Alert>
      </Container>
    );
  }

  // Pre-start screen
  if (!started && !submitted) {
    const attemptsUsed = attempts.length;
    const attemptsRemaining = assessment.maxAttempts - attemptsUsed;
    const canAttempt = attemptsRemaining > 0;

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 3,
                borderRadius: '50%',
                background: assessment.isFinalExam
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mb: 2,
              }}
            >
              {assessment.isFinalExam ? (
                <EmojiEvents sx={{ fontSize: 48, color: 'white' }} />
              ) : (
                <Quiz sx={{ fontSize: 48, color: 'white' }} />
              )}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              {assessment.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {assessment.description}
            </Typography>
            <Chip
              label={assessment.isFinalExam ? 'Final Exam' : 'Module Quiz'}
              color={assessment.isFinalExam ? 'success' : 'primary'}
              sx={{ fontWeight: 700 }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Card sx={{ background: alpha('#667eea', 0.1) }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Questions
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {questions.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ background: alpha('#F59E0B', 0.1) }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Time Limit
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {assessment.timeLimitMinutes} min
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ background: alpha('#10B981', 0.1) }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Passing Score
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {assessment.passingScore}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ background: alpha('#8B5CF6', 0.1) }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Attempts Remaining
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: attemptsRemaining > 0 ? '#10B981' : '#EF4444' }}>
                    {attemptsRemaining} / {assessment.maxAttempts === 999 ? '∞' : assessment.maxAttempts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {attempts.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Previous Attempts
              </Typography>
              {attempts.map((attempt, index) => (
                <Paper key={index} sx={{ p: 2, mb: 1, background: alpha('#f9fafb', 0.5) }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Attempt {attempt.attemptNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(attempt.completedAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {attempt.percentage.toFixed(1)}%
                      </Typography>
                      <Chip
                        label={attempt.passed ? 'Passed' : 'Failed'}
                        color={attempt.passed ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Alert severity={assessment.isFinalExam ? 'warning' : 'info'} icon={<Info />} sx={{ mb: 3 }}>
            {assessment.isFinalExam ? (
              <>
                This is a final exam. You have {attemptsRemaining} attempt(s) remaining. 
                Correct answers will NOT be shown. Passing this exam will generate your certificate.
              </>
            ) : (
              <>
                This is a practice quiz. You have unlimited attempts. 
                Correct answers will be shown after submission.
              </>
            )}
          </Alert>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleStart}
            disabled={!canAttempt}
            sx={{
              py: 2,
              background: assessment.isFinalExam
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '1.1rem',
              fontWeight: 700,
            }}
          >
            {canAttempt ? 'Start Assessment' : 'No Attempts Remaining'}
          </Button>
        </Paper>

        {/* Warning Dialog for Last Attempt */}
        <Dialog open={warningDialogOpen} onClose={() => setWarningDialogOpen(false)}>
          <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" /> Last Attempt Warning
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This is your LAST attempt for this final exam. Make sure you're ready!
            </Alert>
            <Typography variant="body2">
              • You have {assessment.timeLimitMinutes} minutes to complete
              <br />
              • You need {assessment.passingScore}% to pass
              <br />
              • Correct answers will NOT be shown
              <br />
              • If you fail, you cannot retake this exam
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWarningDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                setWarningDialogOpen(false);
                setStarted(true);
              }}
            >
              I'm Ready, Start Exam
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  // Taking assessment screen
  if (started && !submitted) {
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / questions.length) * 100;

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Timer and Progress Bar */}
        <Paper sx={{ p: 3, mb: 3, position: 'sticky', top: 16, zIndex: 100 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {assessment.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {answeredCount} of {questions.length} answered
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={<Timer />}
                label={formatTime(timeRemaining)}
                sx={{
                  background: alpha(getTimeColor(), 0.1),
                  color: getTimeColor(),
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  px: 2,
                }}
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                sx={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
              >
                Submit
              </Button>
            </Box>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Paper>

        {/* Questions */}
        {questions.map((question, index) => (
          <Paper key={question.id} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip
                label={`Q${index + 1}`}
                sx={{
                  background: answers[question.id]
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 700,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                {question.questionText}
              </Typography>
              <Chip label={`${question.points} pts`} size="small" />
            </Box>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              >
                {question.options.map((option, optIndex) => (
                  <FormControlLabel
                    key={optIndex}
                    value={option}
                    control={<Radio />}
                    label={option}
                    sx={{
                      p: 2,
                      mb: 1,
                      border: '2px solid',
                      borderColor: answers[question.id] === option ? '#667eea' : '#e5e7eb',
                      borderRadius: 2,
                      background: answers[question.id] === option ? alpha('#667eea', 0.05) : 'transparent',
                      '&:hover': {
                        background: alpha('#667eea', 0.05),
                        borderColor: '#667eea',
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        ))}

        {/* Confirm Submit Dialog */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
          <DialogTitle sx={{ fontWeight: 700 }}>Submit Assessment?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              You have answered {answeredCount} out of {questions.length} questions.
            </Typography>
            {answeredCount < questions.length && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You have {questions.length - answeredCount} unanswered question(s). 
                They will be marked as incorrect.
              </Alert>
            )}
            <Typography variant="body2">
              Are you sure you want to submit?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleConfirmSubmit}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  // Results screen
  if (submitted && result) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 3,
                borderRadius: '50%',
                background: result.passed
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                mb: 2,
              }}
            >
              {result.passed ? (
                <CheckCircle sx={{ fontSize: 64, color: 'white' }} />
              ) : (
                <Cancel sx={{ fontSize: 64, color: 'white' }} />
              )}
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {result.percentage.toFixed(1)}%
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: result.passed ? '#10B981' : '#EF4444' }}>
              {result.passed ? 'Congratulations! You Passed!' : 'Not Passed'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {result.correctAnswers} out of {result.totalQuestions} questions correct
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="body2" color="text.secondary">Score</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{result.score}/{result.totalPoints}</Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="body2" color="text.secondary">Passing</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{assessment.passingScore}%</Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="body2" color="text.secondary">Time</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{result.timeTakenMinutes}m</Typography>
              </Card>
            </Grid>
          </Grid>

          {result.passed && assessment.isFinalExam && (
            <Alert severity="success" icon={<EmojiEvents />} sx={{ mb: 3 }}>
              Your certificate has been generated! Check your certificates page.
            </Alert>
          )}

          {!result.passed && assessment.isFinalExam && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              You have {assessment.maxAttempts - attempts.length - 1} attempt(s) remaining.
            </Alert>
          )}

          {/* Show answers for quizzes only */}
          {assessment.showCorrectAnswers && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Review Answers
              </Typography>
              {questions.map((question, index) => {
                const userAnswer = result.answersArray.find((a: any) => a.questionId === question.id);
                const isCorrect = userAnswer?.isCorrect;

                return (
                  <Paper key={question.id} sx={{ p: 3, mb: 2, border: '2px solid', borderColor: isCorrect ? '#10B981' : '#EF4444' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip label={`Q${index + 1}`} size="small" />
                      <Typography variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
                        {question.questionText}
                      </Typography>
                      {isCorrect ? (
                        <CheckCircle sx={{ color: '#10B981' }} />
                      ) : (
                        <Cancel sx={{ color: '#EF4444' }} />
                      )}
                    </Box>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Your answer: <strong>{userAnswer?.selectedAnswer || 'Not answered'}</strong>
                      </Typography>
                      {!isCorrect && (
                        <Typography variant="body2" sx={{ color: '#10B981', mt: 1 }}>
                          Correct answer: <strong>{question.correctAnswer}</strong>
                        </Typography>
                      )}
                      {question.explanation && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          {question.explanation}
                        </Alert>
                      )}
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/taxpayer/courses')}
            >
              Back to Courses
            </Button>
            {!result.passed && assessment.maxAttempts - attempts.length - 1 > 0 && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setStarted(false);
                  setSubmitted(false);
                  setAnswers({});
                  setResult(null);
                  loadAssessment();
                }}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Try Again
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    );
  }

  return null;
};

export default TakeAssessment;
