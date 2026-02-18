import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Typography, IconButton, Chip, MenuItem,
  CircularProgress, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Card, CardContent,
  Radio, RadioGroup, FormControlLabel, Checkbox,
} from '@mui/material';
import { Add, Edit, Delete, QuizOutlined } from '@mui/icons-material';
import axios from 'axios';

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
  answerText: string;
  isCorrect: boolean;
  order: number;
}

interface Question {
  id?: number;
  moduleId: number;
  questionText: string;
  questionType: string;
  points: number;
  order: number;
  answers: Answer[];
}

const QuestionManagement: React.FC = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  const [formData, setFormData] = useState<Question>({
    moduleId: 0,
    questionText: '',
    questionType: 'MULTIPLE_CHOICE',
    points: 1,
    order: 0,
    answers: [
      { answerText: '', isCorrect: false, order: 0 },
      { answerText: '', isCorrect: false, order: 1 },
      { answerText: '', isCorrect: false, order: 2 },
      { answerText: '', isCorrect: false, order: 3 },
    ],
  });

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      loadQuestions(selectedModule);
    }
  }, [selectedModule]);

  const loadModules = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/modules`, getAuthHeaders());
      setModules(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const loadQuestions = async (moduleId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/questions/module/${moduleId}`,
        getAuthHeaders()
      );
      setQuestions(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setFormData(question);
    } else {
      setEditingQuestion(null);
      setFormData({
        moduleId: selectedModule || 0,
        questionText: '',
        questionType: 'MULTIPLE_CHOICE',
        points: 1,
        order: questions.length,
        answers: [
          { answerText: '', isCorrect: false, order: 0 },
          { answerText: '', isCorrect: false, order: 1 },
          { answerText: '', isCorrect: false, order: 2 },
          { answerText: '', isCorrect: false, order: 3 },
        ],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingQuestion(null);
  };

  const handleAnswerChange = (index: number, field: string, value: any) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setFormData({ ...formData, answers: newAnswers });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newAnswers = formData.answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index,
    }));
    setFormData({ ...formData, answers: newAnswers });
  };

  const handleSubmit = async () => {
    try {
      // Validate
      if (!formData.questionText.trim()) {
        alert('Please enter a question');
        return;
      }

      const validAnswers = formData.answers.filter(a => a.answerText.trim());
      if (validAnswers.length < 2) {
        alert('Please provide at least 2 answers');
        return;
      }

      if (!validAnswers.some(a => a.isCorrect)) {
        alert('Please mark at least one answer as correct');
        return;
      }

      const payload = {
        ...formData,
        moduleId: selectedModule,
        answers: validAnswers,
      };

      if (editingQuestion) {
        await axios.put(
          `${API_BASE_URL}/questions/${editingQuestion.id}`,
          payload,
          getAuthHeaders()
        );
      } else {
        await axios.post(`${API_BASE_URL}/questions`, payload, getAuthHeaders());
      }

      if (selectedModule) {
        loadQuestions(selectedModule);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Failed to save question');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`${API_BASE_URL}/questions/${id}`, getAuthHeaders());
        if (selectedModule) {
          loadQuestions(selectedModule);
        }
      } catch (error) {
        console.error('Failed to delete question:', error);
        alert('Failed to delete question');
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Question Management
      </Typography>

      {/* Module Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                select
                label="Select Module"
                value={selectedModule || ''}
                onChange={(e) => setSelectedModule(Number(e.target.value))}
              >
                <MenuItem value="">Select a module...</MenuItem>
                {modules.map((module) => (
                  <MenuItem key={module.id} value={module.id}>
                    {module.title} - {module.course?.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                disabled={!selectedModule}
                onClick={() => handleOpenDialog()}
              >
                Add Question
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Questions List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : !selectedModule ? (
        <Alert severity="info">Please select a module to manage questions</Alert>
      ) : questions.length === 0 ? (
        <Alert severity="info">No questions found. Add your first question!</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Answers</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>{question.order + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 400 }}>
                      {question.questionText}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={question.questionType} size="small" />
                  </TableCell>
                  <TableCell>{question.points}</TableCell>
                  <TableCell>{question.answers?.length || 0}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenDialog(question)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(question.id!)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Create New Question'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Question Text"
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Question Type"
                value={formData.questionType}
                onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
              >
                <MenuItem value="MULTIPLE_CHOICE">Multiple Choice</MenuItem>
                <MenuItem value="TRUE_FALSE">True/False</MenuItem>
                <MenuItem value="SHORT_ANSWER">Short Answer</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Points"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Answer Options (Select the correct answer)
              </Typography>
              {formData.answers.map((answer, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                  <Radio
                    checked={answer.isCorrect}
                    onChange={() => handleCorrectAnswerChange(index)}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label={`Answer ${index + 1}`}
                    value={answer.answerText}
                    onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
                  />
                </Box>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingQuestion ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionManagement;
