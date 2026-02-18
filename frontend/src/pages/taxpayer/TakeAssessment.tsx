import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Radio, RadioGroup,
  FormControlLabel, FormControl, FormLabel, CircularProgress,
  Alert, LinearProgress, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Paper,
} from '@mui/material';
import {
  CheckCircle, Cancel, EmojiEvents, TrendingUp, Quiz,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

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

interface Answer {
  id: number;
  answerText: string;
  isCorrect: boolean;
  order: number;
}

interface Question {
  id: number;
  questionText: string;
  questionType: string;
  points: number;
  order: number;
  answers: Answer[];
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
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [result, setResult