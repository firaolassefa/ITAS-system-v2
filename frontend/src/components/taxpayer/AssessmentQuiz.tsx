import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
  Alert,
} from '@mui/material';
import { Timer, CheckCircle, Error } from '@mui/icons-material';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface AssessmentQuizProps {
  questions: Question[];
  timeLimit?: number; // in minutes
  onComplete: (score: number) => void;
}

const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({
  questions,
  timeLimit = 30,
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // in seconds
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Timer effect
  React.useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    // Calculate score
    const score = questions.reduce((total, question, index) => {
      return total + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    
    const percentage = (score / questions.length) * 100;
    
    setTimeout(() => {
      setShowResults(true);
      onComplete(percentage);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const score = questions.reduce((total, question, index) => {
      return total + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;

    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {passed ? (
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        ) : (
          <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        )}
        
        <Typography variant="h5" gutterBottom>
          {passed ? 'Congratulations!' : 'Assessment Complete'}
        </Typography>
        
        <Typography variant="h3" gutterBottom color={passed ? 'success.main' : 'error.main'}>
          {percentage.toFixed(1)}%
        </Typography>
        
        <Typography variant="body1" paragraph>
          You scored {score} out of {questions.length} questions correctly.
        </Typography>
        
        {passed ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            You passed the assessment! You can now proceed to the next module.
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You need at least 70% to pass. You can retake the assessment.
          </Alert>
        )}
        
        <Button
          variant="contained"
          onClick={() => {
            setCurrentQuestion(0);
            setAnswers(Array(questions.length).fill(-1));
            setTimeLeft(timeLimit * 60);
            setSubmitted(false);
            setShowResults(false);
          }}
        >
          Retake Assessment
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          Question {currentQuestion + 1} of {questions.length}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timer />
          <Typography variant="body1">
            Time remaining: {formatTime(timeLeft)}
          </Typography>
        </Box>
      </Box>

      {/* Progress bar */}
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />

      {/* Question */}
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <FormLabel component="legend" sx={{ mb: 2 }}>
          <Typography variant="h6">
            {currentQuestionData.question}
          </Typography>
        </FormLabel>
        
        <RadioGroup
          value={answers[currentQuestion]}
          onChange={(e) => handleAnswerSelect(currentQuestion, parseInt(e.target.value))}
        >
          {currentQuestionData.options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={index}
              control={<Radio />}
              label={option}
              disabled={submitted}
              sx={{
                mb: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: submitted
                  ? index === currentQuestionData.correctAnswer
                    ? 'success.light'
                    : answers[currentQuestion] === index
                    ? 'error.light'
                    : 'transparent'
                  : 'transparent',
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0 || submitted}
        >
          Previous
        </Button>
        
        {currentQuestion === questions.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitted || answers[currentQuestion] === -1}
          >
            {submitted ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={answers[currentQuestion] === -1 || submitted}
          >
            Next Question
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default AssessmentQuiz;
