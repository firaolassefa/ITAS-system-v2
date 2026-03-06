import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Typography, IconButton, Card, CardContent,
  MenuItem, Alert, CircularProgress, Chip, Radio, RadioGroup,
  FormControlLabel, FormControl, FormLabel, Divider, Paper,
} from '@mui/material';
import {
  Add, Edit, Delete, Quiz, CheckCircle, Cancel, Upload,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';

interface Question {
  id?: number;
  moduleId: number;
  questionText: string;
  questionType: string;
  isPractice: boolean;
  explanation?: string;
  points: number;
  order: number;
  answers: Answer[];
}

interface Answer {
  answerText: string;
  isCorrect: boolean;
  order: number;
}

const QuestionManagement: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedModule, setSelectedModule] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<Question>({
    moduleId: 0,
    questionText: '',
    questionType: 'MULTIPLE_CHOICE',
    isPractice: false,
    explanation: '',
    points: 1,
    order: 0,
    answers: [
      { answerText: '', isCorrect: false, order: 0 },
      { answerText: '', isCorrect: false, order: 1 },
    ],
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadModules(selectedCourse as number);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedModule) {
      loadQuestions(selectedModule as number);
    }
  }, [selectedModule]);

  const loadCourses = async () => {
    try {
      const response = await apiClient.get('/courses');
      setCourses(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const loadModules = async (courseId: number) => {
    try {
      const response = await apiClient.get(`/modules/course/${courseId}`);
      setModules(response.data.data || response.data || []);
      setSelectedModule('');
      setQuestions([]);
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const loadQuestions = async (moduleId: number) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/questions/module/${moduleId}`);
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
      const nextOrder = questions.length;
      setFormData({
        moduleId: selectedModule as number,
        questionText: '',
        questionType: 'MULTIPLE_CHOICE',
        isPractice: false,
        explanation: '',
        points: 1,
        order: nextOrder,
        answers: [
          { answerText: '', isCorrect: false, order: 0 },
          { answerText: '', isCorrect: false, order: 1 },
        ],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingQuestion(null);
    setMessage(null);
  };

  const handleAddAnswer = () => {
    setFormData({
      ...formData,
      answers: [
        ...formData.answers,
        { answerText: '', isCorrect: false, order: formData.answers.length },
      ],
    });
  };

  const handleRemoveAnswer = (index: number) => {
    if (formData.answers.length > 2) {
      setFormData({
        ...formData,
        answers: formData.answers.filter((_, i) => i !== index),
      });
    }
  };

  const handleAnswerChange = (index: number, field: string, value: any) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setFormData({ ...formData, answers: newAnswers });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.questionText.trim()) {
      setMessage({ type: 'error', text: 'Question text is required' });
      return;
    }

    if (formData.answers.length < 2) {
      setMessage({ type: 'error', text: 'At least 2 answers are required' });
      return;
    }

    const hasCorrectAnswer = formData.answers.some(a => a.isCorrect);
    if (!hasCorrectAnswer) {
      setMessage({ type: 'error', text: 'At least one answer must be marked as correct' });
      return;
    }

    if (formData.isPractice && !formData.explanation?.trim()) {
      setMessage({ type: 'error', text: 'Explanation is required for practice questions' });
      return;
    }

    try {
      setLoading(true);
      if (editingQuestion) {
        await apiClient.put(`/questions/${editingQuestion.id}`, formData);
        setMessage({ type: 'success', text: 'Question updated successfully!' });
      } else {
        await apiClient.post('/questions', formData);
        setMessage({ type: 'success', text: 'Question created successfully!' });
      }

      await loadQuestions(selectedModule as number);
      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save question',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await apiClient.delete(`/questions/${id}`);
        await loadQuestions(selectedModule as number);
      } catch (error) {
        alert('Failed to delete question');
      }
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !selectedModule) {
      setMessage({ type: 'error', text: 'Please select a file and module' });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('moduleId', selectedModule.toString());

      const response = await apiClient.post('/assessment-definitions/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data.data || response.data;
      setMessage({ 
        type: 'success', 
        text: `Successfully imported ${Array.isArray(data) ? data.length : 0} questions!` 
      });
      setUploadDialogOpen(false);
      setUploadFile(null);
      await loadQuestions(selectedModule as number);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload file' 
      });
    } finally {
      setLoading(false);
    }
  };

  const practiceQuestions = questions.filter(q => q.isPractice);
  const quizQuestions = questions.filter(q => !q.isPractice);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Question Management
      </Typography>

      {/* Selection Panel */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              select
              label="Select Course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(Number(e.target.value) || '')}
            >
              <MenuItem value="">Choose a course...</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              select
              label="Select Module"
              value={selectedModule}
              onChange={(e) => setSelectedModule(Number(e.target.value) || '')}
              disabled={!selectedCourse}
            >
              <MenuItem value="">Choose a module...</MenuItem>
              {modules.map((module) => (
                <MenuItem key={module.id} value={module.id}>
                  {module.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={1.5}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setUploadDialogOpen(true)}
              disabled={!selectedModule}
              sx={{ height: '56px' }}
            >
              Upload File
            </Button>
          </Grid>
          <Grid item xs={12} md={0.5}></Grid>
          <Grid item xs={12} md={1.5}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              disabled={!selectedModule}
              sx={{ height: '56px' }}
            >
              Add Question
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Questions Display */}
      {selectedModule && (
        <Grid container spacing={3}>
          {/* Practice Questions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Quiz color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Practice Questions ({practiceQuestions.length})
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  For learning - unlimited attempts, instant feedback
                </Typography>

                {loading ? (
                  <CircularProgress />
                ) : practiceQuestions.length === 0 ? (
                  <Alert severity="info">No practice questions yet</Alert>
                ) : (
                  practiceQuestions.map((q, index) => (
                    <Paper key={q.id} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                            {index + 1}. {q.questionText}
                          </Typography>
                          <Chip label={`${q.points} point${q.points > 1 ? 's' : ''}`} size="small" sx={{ mr: 1 }} />
                          <Chip label={q.questionType} size="small" color="primary" />
                        </Box>
                        <Box>
                          <IconButton size="small" onClick={() => handleOpenDialog(q)}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(q.id!)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quiz Questions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CheckCircle color="success" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Quiz Questions ({quizQuestions.length})
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  For assessment - must pass to unlock next module
                </Typography>

                {loading ? (
                  <CircularProgress />
                ) : quizQuestions.length === 0 ? (
                  <Alert severity="info">No quiz questions yet</Alert>
                ) : (
                  quizQuestions.map((q, index) => (
                    <Paper key={q.id} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                            {index + 1}. {q.questionText}
                          </Typography>
                          <Chip label={`${q.points} point${q.points > 1 ? 's' : ''}`} size="small" sx={{ mr: 1 }} />
                          <Chip label={q.questionType} size="small" color="success" />
                        </Box>
                        <Box>
                          <IconButton size="small" onClick={() => handleOpenDialog(q)}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(q.id!)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent>
          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

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

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Question Type"
                value={formData.questionType}
                onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
              >
                <MenuItem value="MULTIPLE_CHOICE">Multiple Choice</MenuItem>
                <MenuItem value="TRUE_FALSE">True/False</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Question Category"
                value={formData.isPractice ? 'practice' : 'quiz'}
                onChange={(e) => setFormData({ ...formData, isPractice: e.target.value === 'practice' })}
              >
                <MenuItem value="practice">Practice (Learning)</MenuItem>
                <MenuItem value="quiz">Quiz (Assessment)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Points"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}
              />
            </Grid>

            {formData.isPractice && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Explanation (for practice questions)"
                  value={formData.explanation || ''}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  helperText="This will be shown after the user answers"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Answers
              </Typography>

              {formData.answers.map((answer, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        label={`Answer ${index + 1}`}
                        value={answer.answerText}
                        onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={answer.isCorrect}
                            onChange={(e) => {
                              // Only one answer can be correct
                              const newAnswers = formData.answers.map((a, i) => ({
                                ...a,
                                isCorrect: i === index,
                              }));
                              setFormData({ ...formData, answers: newAnswers });
                            }}
                          />
                        }
                        label="Correct"
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveAnswer(index)}
                        disabled={formData.answers.length <= 2}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddAnswer}
                disabled={formData.answers.length >= 6}
              >
                Add Answer
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : editingQuestion ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Import Questions from File (Like W3Schools!)</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Alert severity="info" sx={{ fontSize: '0.9rem' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Upload Word (.docx) or PDF with questions in this format:
              </Typography>
              <Box component="pre" sx={{ 
                bgcolor: '#f5f5f5', 
                p: 2, 
                borderRadius: 1, 
                fontSize: '0.85rem',
                overflow: 'auto',
                fontFamily: 'monospace'
              }}>
{`Question 1: What is VAT?
Type: Practice
A) Value Added Tax
B) Variable Annual Tax
C) Verified Asset Tax
D) None of the above
Correct Answer: A
Explanation: VAT stands for Value Added Tax
Points: 10

Question 2: What is the VAT rate?
Type: Exam
A) 5%
B) 10%
C) 15%
D) 20%
Correct Answer: C
Explanation: Standard VAT rate is 15%
Points: 10`}
              </Box>
              <Typography variant="body2" sx={{ mt: 2, fontWeight: 600 }}>
                📝 Type: Practice = Unlimited tries, see answers (like W3Schools)<br />
                📝 Type: Exam = For certificate, limited tries<br />
                📝 If no Type specified, defaults to Exam
              </Typography>
            </Alert>

            {message && (
              <Alert severity={message.type} onClose={() => setMessage(null)}>
                {message.text}
              </Alert>
            )}

            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              fullWidth
              sx={{ py: 2 }}
            >
              {uploadFile ? uploadFile.name : 'Choose File (.docx or .pdf)'}
              <input
                type="file"
                hidden
                accept=".docx,.pdf,.doc"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => {
            setUploadDialogOpen(false);
            setUploadFile(null);
            setMessage(null);
          }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleFileUpload} 
            disabled={!uploadFile || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Upload />}
          >
            {loading ? 'Uploading...' : 'Upload & Import'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionManagement;
