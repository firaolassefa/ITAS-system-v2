import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Grid,
  Card, CardContent, Chip, IconButton, Alert, CircularProgress, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, alpha,
} from '@mui/material';
import {
  Add, Edit, Delete, Quiz, School, Upload, Download, CheckCircle,
  Timer, EmojiEvents, Info,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';

interface Assessment {
  id: number;
  courseId: number;
  moduleId?: number;
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

interface Course {
  id: number;
  title: string;
}

interface Module {
  id: number;
  title: string;
  courseId: number;
}

const AssessmentManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  
  const [formData, setFormData] = useState({
    courseId: '',
    moduleId: '',
    title: '',
    description: '',
    isFinalExam: false,
    passingScore: 70,
    timeLimitMinutes: 60,
  });

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadModuleId, setUploadModuleId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load courses first
      const coursesRes = await apiClient.get('/courses');
      setCourses(coursesRes.data.data || coursesRes.data || []);
      
      // Try to load assessments, but don't fail if endpoint doesn't exist
      try {
        const assessmentsRes = await apiClient.get('/assessment-definitions');
        setAssessments(assessmentsRes.data.data || assessmentsRes.data || []);
      } catch (assessmentErr: any) {
        console.warn('Assessment definitions endpoint not available:', assessmentErr);
        setAssessments([]);
      }
      
    } catch (err: any) {
      console.error('Failed to load data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadModules = async (courseId: string) => {
    if (!courseId) return;
    try {
      const response = await apiClient.get(`/modules/course/${courseId}`);
      setModules(response.data.data || response.data || []);
    } catch (err) {
      console.error('Failed to load modules:', err);
    }
  };

  const handleCreateAssessment = async () => {
    try {
      setError('');
      const payload = {
        courseId: parseInt(formData.courseId),
        moduleId: formData.moduleId ? parseInt(formData.moduleId) : null,
        title: formData.title,
        description: formData.description,
        isFinalExam: formData.isFinalExam,
        passingScore: formData.passingScore,
        timeLimitMinutes: formData.timeLimitMinutes,
      };

      if (editingAssessment) {
        await apiClient.put(`/assessment-definitions/${editingAssessment.id}`, payload);
        setSuccess('Assessment updated successfully!');
      } else {
        await apiClient.post('/assessment-definitions', payload);
        setSuccess('Assessment created successfully!');
      }

      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save assessment');
    }
  };

  const handleDeleteAssessment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    
    try {
      await apiClient.delete(`/assessment-definitions/${id}`);
      setSuccess('Assessment deleted successfully!');
      loadData();
    } catch (err: any) {
      setError('Failed to delete assessment');
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadModuleId) {
      setError('Please select a file and module');
      return;
    }

    try {
      setError('');
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('moduleId', uploadModuleId);

      const response = await apiClient.post('/assessment-definitions/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = response.data.data || response.data;
      setSuccess(`Successfully imported ${Array.isArray(data) ? data.length : 0} questions!`);
      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadModuleId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
    }
  };

  const resetForm = () => {
    setFormData({
      courseId: '',
      moduleId: '',
      title: '',
      description: '',
      isFinalExam: false,
      passingScore: 70,
      timeLimitMinutes: 60,
    });
    setEditingAssessment(null);
  };

  const openEditDialog = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      courseId: assessment.courseId.toString(),
      moduleId: assessment.moduleId?.toString() || '',
      title: assessment.title,
      description: assessment.description,
      isFinalExam: assessment.isFinalExam,
      passingScore: assessment.passingScore,
      timeLimitMinutes: assessment.timeLimitMinutes,
    });
    loadModules(assessment.courseId.toString());
    setDialogOpen(true);
  };

  const moduleQuizzes = assessments.filter(a => !a.isFinalExam);
  const finalExams = assessments.filter(a => a.isFinalExam);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Assessment Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create module quizzes and final exams for courses
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={() => setUploadDialogOpen(true)}
              sx={{ borderRadius: 3 }}
            >
              Import from File
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
              }}
            >
              Create Assessment
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
      </Box>

      {/* Info Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: alpha('#667eea', 0.1), border: '2px solid', borderColor: alpha('#667eea', 0.3) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Quiz sx={{ fontSize: 40, color: '#667eea' }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Module Quiz</Typography>
                  <Typography variant="body2" color="text.secondary">Practice & Learning</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="Unlimited Attempts" size="small" sx={{ width: 'fit-content' }} />
                <Chip label="Shows Correct Answers" size="small" sx={{ width: 'fit-content' }} />
                <Chip label="No Certificate" size="small" sx={{ width: 'fit-content' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: alpha('#10B981', 0.1), border: '2px solid', borderColor: alpha('#10B981', 0.3) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <EmojiEvents sx={{ fontSize: 40, color: '#10B981' }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Final Exam</Typography>
                  <Typography variant="body2" color="text.secondary">Certification Assessment</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="3 Attempts Maximum" size="small" sx={{ width: 'fit-content' }} />
                <Chip label="No Answer Preview" size="small" sx={{ width: 'fit-content' }} />
                <Chip label="Generates Certificate" size="small" sx={{ width: 'fit-content' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label={`Module Quizzes (${moduleQuizzes.length})`} />
          <Tab label={`Final Exams (${finalExams.length})`} />
        </Tabs>
      </Paper>

      {/* Assessment List */}
      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Passing Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Time Limit</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Attempts</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tabValue === 0 ? moduleQuizzes : finalExams).map((assessment) => {
                const course = courses.find(c => c.id === assessment.courseId);
                return (
                  <TableRow key={assessment.id} sx={{ '&:hover': { background: alpha('#667eea', 0.05) } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{assessment.title}</TableCell>
                    <TableCell>{course?.title || 'Unknown'}</TableCell>
                    <TableCell>{assessment.moduleId ? `Module ${assessment.moduleId}` : '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={assessment.isFinalExam ? 'Final Exam' : 'Module Quiz'}
                        size="small"
                        color={assessment.isFinalExam ? 'success' : 'primary'}
                      />
                    </TableCell>
                    <TableCell>{assessment.passingScore}%</TableCell>
                    <TableCell>{assessment.timeLimitMinutes} min</TableCell>
                    <TableCell>{assessment.maxAttempts === 999 ? 'Unlimited' : assessment.maxAttempts}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEditDialog(assessment)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteAssessment(assessment.id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {(tabValue === 0 ? moduleQuizzes : finalExams).length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                    <Info sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No {tabValue === 0 ? 'module quizzes' : 'final exams'} created yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Assessment Type</InputLabel>
              <Select
                value={formData.isFinalExam ? 'final' : 'quiz'}
                label="Assessment Type"
                onChange={(e) => setFormData({ ...formData, isFinalExam: e.target.value === 'final' })}
              >
                <MenuItem value="quiz">Module Quiz (Practice)</MenuItem>
                <MenuItem value="final">Final Exam (Certification)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                value={formData.courseId}
                label="Course"
                onChange={(e) => {
                  setFormData({ ...formData, courseId: e.target.value });
                  loadModules(e.target.value);
                }}
              >
                {courses.map(course => (
                  <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {!formData.isFinalExam && (
              <FormControl fullWidth>
                <InputLabel>Module (Optional)</InputLabel>
                <Select
                  value={formData.moduleId}
                  label="Module (Optional)"
                  onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  {modules.map(module => (
                    <MenuItem key={module.id} value={module.id}>{module.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Passing Score (%)"
                  type="number"
                  fullWidth
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Time Limit (minutes)"
                  type="number"
                  fullWidth
                  value={formData.timeLimitMinutes}
                  onChange={(e) => setFormData({ ...formData, timeLimitMinutes: parseInt(e.target.value) })}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>

            <Alert severity="info" icon={<Info />}>
              {formData.isFinalExam ? (
                <>Final exams have 3 attempts, don't show answers, and generate certificates on pass.</>
              ) : (
                <>Module quizzes have unlimited attempts, show correct answers, and are for practice.</>
              )}
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateAssessment}
            disabled={!formData.courseId || !formData.title}
          >
            {editingAssessment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Import Questions from File</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Alert severity="info" icon={<Info />}>
              Upload a Word (.docx) or PDF file with questions. We'll extract them automatically.
            </Alert>

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

            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                value={formData.courseId}
                label="Course"
                onChange={(e) => {
                  setFormData({ ...formData, courseId: e.target.value });
                  loadModules(e.target.value);
                  setUploadModuleId(''); // Reset module selection when course changes
                }}
              >
                {courses.map(course => (
                  <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Module (Required)</InputLabel>
              <Select
                value={uploadModuleId}
                label="Module (Required)"
                onChange={(e) => setUploadModuleId(e.target.value)}
              >
                {modules.map(module => (
                  <MenuItem key={module.id} value={module.id}>{module.title}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Alert severity="info">
              Upload a Word (.docx) or PDF file with questions in the following format:
              <br /><br />
              Question 1: What is VAT?<br />
              A) Value Added Tax<br />
              B) Variable Annual Tax<br />
              Correct Answer: A<br />
              Explanation: VAT stands for Value Added Tax (optional)<br />
              Points: 10 (optional)
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFileUpload} disabled={!uploadFile || !uploadModuleId}>
            Upload & Extract
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssessmentManagement;
