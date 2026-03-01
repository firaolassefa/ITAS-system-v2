import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Typography, IconButton, Chip, MenuItem,
  CircularProgress, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Card, CardContent,
  Radio,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { modulesAPI, questionsAPI } from '../../api/modules';

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
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  
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
      console.log('Loading modules...');
      console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:8080/api');
      
      // Check if user is logged in
      const token = localStorage.getItem('itas_token');
      const user = localStorage.getItem('itas_user');
      console.log('Token exists:', !!token);
      console.log('User:', user);
      
      if (!token) {
        setBackendConnected(true);
        alert('You are not logged in. Please login first.');
        window.location.href = '/login';
        return;
      }
      
      const response = await modulesAPI.getAllModules();
      console.log('Modules response:', response);
      
      // The API now returns the data directly (already unwrapped)
      const modulesData = Array.isArray(response) ? response : [];
      console.log('Parsed modules:', modulesData);
      
      if (!Array.isArray(modulesData)) {
        console.error('Modules data is not an array:', modulesData);
        setModules([]);
        setBackendConnected(true);
        return;
      }
      
      setModules(modulesData);
      setBackendConnected(true);
      
      if (modulesData.length === 0) {
        alert('No modules found. Please create courses and modules first in Course Management and Module Content Manager.');
      }
    } catch (error: any) {
      console.error('Failed to load modules:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      let errorMessage = 'Failed to load modules. ';
      
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        setBackendConnected(false);
        errorMessage = 'Cannot connect to the backend server at http://localhost:8080/api\n\n';
        errorMessage += 'Possible causes:\n';
        errorMessage += '1. Backend server is not running - Run start-backend.bat\n';
        errorMessage += '2. Backend is running on a different port\n';
        errorMessage += '3. CORS is blocking the request\n\n';
        errorMessage += 'Check the browser console for more details.';
      } else if (error.response?.status === 401) {
        setBackendConnected(true);
        errorMessage = 'Authentication failed. Your session may have expired. Please login again.';
        setTimeout(() => {
          localStorage.removeItem('itas_token');
          localStorage.removeItem('itas_user');
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.status === 403) {
        setBackendConnected(true);
        errorMessage = 'Access denied. You do not have permission to manage questions. Please ensure you are logged in as an admin.';
      } else if (error.response) {
        setBackendConnected(true);
        errorMessage += error.response.data?.message || error.response.statusText || 'Unknown error';
      } else {
        setBackendConnected(false);
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    }
  };

  const loadQuestions = async (moduleId: number) => {
    try {
      setLoading(true);
      console.log('Loading questions for module:', moduleId);
      const response = await questionsAPI.getQuestionsByModule(moduleId);
      console.log('Questions response:', response);
      
      // The API now returns the data directly (already unwrapped)
      const questionsData = Array.isArray(response) ? response : [];
      console.log('Parsed questions:', questionsData);
      
      setQuestions(questionsData);
    } catch (error: any) {
      console.error('Failed to load questions:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to load questions: ' + (error.response?.data?.message || error.message));
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
      console.log('Submitting question with data:', formData);
      console.log('Selected module:', selectedModule);
      
      // Validate
      if (!selectedModule) {
        alert('Please select a module first');
        return;
      }

      if (!formData.questionText.trim()) {
        alert('Please enter a question');
        return;
      }

      const validAnswers = formData.answers.filter(a => a.answerText.trim());
      console.log('Valid answers:', validAnswers);
      
      if (validAnswers.length < 2) {
        alert('Please provide at least 2 answers');
        return;
      }

      if (!validAnswers.some(a => a.isCorrect)) {
        alert('Please mark at least one answer as correct');
        return;
      }

      // Ensure answers have correct order
      const orderedAnswers = validAnswers.map((answer, index) => ({
        ...answer,
        order: index
      }));

      const payload = {
        ...formData,
        moduleId: selectedModule,
        answers: orderedAnswers,
      };

      console.log('Sending payload:', payload);

      if (editingQuestion && editingQuestion.id) {
        const response = await questionsAPI.updateQuestion(editingQuestion.id, payload);
        console.log('Update response:', response);
        alert('Question updated successfully!');
      } else {
        const response = await questionsAPI.createQuestion(payload);
        console.log('Create response:', response);
        alert('Question created successfully!');
      }

      if (selectedModule) {
        await loadQuestions(selectedModule);
      }
      handleCloseDialog();
    } catch (error: any) {
      console.error('Failed to save question:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save question';
      alert('Error: ' + errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionsAPI.deleteQuestion(id);
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
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Question Management
      </Typography>

      {/* Backend Connection Status */}
      {backendConnected === false && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Cannot connect to backend server. Please ensure the backend is running on http://localhost:8080
          <br />
          Run <code>start-backend.bat</code> in the backend folder to start the server.
        </Alert>
      )}

      {backendConnected === true && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Connected to backend server
        </Alert>
      )}

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
                onChange={(e) => {
                  const value = Number(e.target.value);
                  console.log('Module selected:', value);
                  setSelectedModule(value);
                }}
              >
                <MenuItem value="">Select a module...</MenuItem>
                {modules.map((module) => (
                  <MenuItem key={module.id} value={module.id}>
                    {module.title} {module.course?.title ? `(${module.course.title})` : ''}
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
