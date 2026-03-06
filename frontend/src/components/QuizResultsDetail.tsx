import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, Typography, Paper, Chip, Stack, LinearProgress, Divider,
  alpha, Grid, Card, CardContent,
} from '@mui/material';
import {
  CheckCircle, Cancel, EmojiEvents, TrendingUp, Timer,
  Quiz, ArrowForward, Refresh,
} from '@mui/icons-material';

interface QuestionResult {
  questionId: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  explanation?: string;
}

interface QuizResultsDetailProps {
  open: boolean;
  onClose: () => void;
  results: {
    passed: boolean;
    percentage: number;
    score: number;
    totalPoints: number;
    attemptNumber: number;
    maxAttempts: number;
    timeTaken?: number;
    questionResults?: QuestionResult[];
    feedback: string;
  };
  onRetry?: () => void;
  onContinue?: () => void;
  showRetry?: boolean;
}

const QuizResultsDetail: React.FC<QuizResultsDetailProps> = ({
  open,
  onClose,
  results,
  onRetry,
  onContinue,
  showRetry = true,
}) => {
  const correctCount = results.questionResults?.filter(q => q.isCorrect).length || 0;
  const totalQuestions = results.questionResults?.length || 0;
  const incorrectCount = totalQuestions - correctCount;

  const getGradeColor = () => {
    if (results.percentage >= 90) return '#10B981';
    if (results.percentage >= 80) return '#3B82F6';
    if (results.percentage >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getGradeLabel = () => {
    if (results.percentage >= 90) return 'Excellent!';
    if (results.percentage >= 80) return 'Great Job!';
    if (results.percentage >= 70) return 'Good!';
    return 'Keep Trying!';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Quiz sx={{ color: '#667eea' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Quiz Results
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Score Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${getGradeColor()} 0%, ${alpha(getGradeColor(), 0.7)} 100%)`,
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: alpha('#FFFFFF', 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >
            {results.passed ? (
              <EmojiEvents sx={{ fontSize: 48 }} />
            ) : (
              <Refresh sx={{ fontSize: 48 }} />
            )}
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            {Math.round(results.percentage)}%
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, opacity: 0.9 }}>
            {getGradeLabel()}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {results.score} out of {results.totalPoints} points
          </Typography>
        </Paper>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card elevation={0} sx={{ textAlign: 'center', border: '1px solid', borderColor: alpha('#000', 0.1) }}>
              <CardContent>
                <CheckCircle sx={{ color: '#10B981', fontSize: 32, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {correctCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Correct
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card elevation={0} sx={{ textAlign: 'center', border: '1px solid', borderColor: alpha('#000', 0.1) }}>
              <CardContent>
                <Cancel sx={{ color: '#EF4444', fontSize: 32, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {incorrectCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Incorrect
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card elevation={0} sx={{ textAlign: 'center', border: '1px solid', borderColor: alpha('#000', 0.1) }}>
              <CardContent>
                <TrendingUp sx={{ color: '#667eea', fontSize: 32, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {results.attemptNumber}/{results.maxAttempts}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Attempts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {results.timeTaken && (
            <Grid item xs={6} sm={3}>
              <Card elevation={0} sx={{ textAlign: 'center', border: '1px solid', borderColor: alpha('#000', 0.1) }}>
                <CardContent>
                  <Timer sx={{ color: '#F59E0B', fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {results.timeTaken}m
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Time Taken
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Feedback */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            background: results.passed ? alpha('#10B981', 0.05) : alpha('#F59E0B', 0.05),
            border: '1px solid',
            borderColor: results.passed ? alpha('#10B981', 0.2) : alpha('#F59E0B', 0.2),
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {results.feedback}
          </Typography>
        </Paper>

        {/* Question Breakdown */}
        {results.questionResults && results.questionResults.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Question Breakdown
            </Typography>
            <Stack spacing={2}>
              {results.questionResults.map((question, index) => (
                <Paper
                  key={question.questionId}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: question.isCorrect ? alpha('#10B981', 0.2) : alpha('#EF4444', 0.2),
                    background: question.isCorrect ? alpha('#10B981', 0.05) : alpha('#EF4444', 0.05),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        background: question.isCorrect ? alpha('#10B981', 0.15) : alpha('#EF4444', 0.15),
                        color: question.isCorrect ? '#10B981' : '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {question.isCorrect ? <CheckCircle /> : <Cancel />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Question {index + 1}: {question.questionText}
                      </Typography>
                      <Stack spacing={0.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Your answer:
                          </Typography>
                          <Chip
                            label={question.userAnswer}
                            size="small"
                            sx={{
                              background: question.isCorrect ? alpha('#10B981', 0.15) : alpha('#EF4444', 0.15),
                              color: question.isCorrect ? '#10B981' : '#EF4444',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        {!question.isCorrect && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Correct answer:
                            </Typography>
                            <Chip
                              label={question.correctAnswer}
                              size="small"
                              sx={{
                                background: alpha('#10B981', 0.15),
                                color: '#10B981',
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        )}
                      </Stack>
                      {question.explanation && (
                        <Box
                          sx={{
                            mt: 1.5,
                            p: 1.5,
                            borderRadius: 1.5,
                            background: alpha('#667eea', 0.05),
                            border: '1px solid',
                            borderColor: alpha('#667eea', 0.15),
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#667eea', display: 'block', mb: 0.5 }}>
                            💡 Explanation:
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {question.explanation}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Chip
                      label={`${question.points} pts`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Paper>
              ))}
            </Stack>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
          Close
        </Button>
        {showRetry && !results.passed && results.attemptNumber < results.maxAttempts && onRetry && (
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRetry}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Try Again ({results.maxAttempts - results.attemptNumber} attempts left)
          </Button>
        )}
        {results.passed && onContinue && (
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={onContinue}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            }}
          >
            Continue to Next Module
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QuizResultsDetail;
