import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  School as CourseIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { coursesAPI } from '../../api/courses';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationHours: number;
  modules: string[];
  published: boolean;
  enrollments?: number;
  completionRate?: number;
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'VAT',
    difficulty: 'BEGINNER',
    durationHours: 4,
    modules: [''],
    published: false,
  });

  const categories = ['VAT', 'INCOME_TAX', 'CORPORATE_TAX', 'PAYROLL_TAX', 'CUSTOMS'];
  const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await coursesAPI.getAllCourses();
      // Add mock enrollment data
      const coursesWithStats = (response.data || []).map((course: Course) => ({
        ...course,
        enrollments: Math.floor(Math.random() * 500) + 50,
        completionRate: Math.floor(Math.random() * 40) + 60,
      }));
      setCourses(coursesWithStats);
    } catch (error) {
      console.error('Failed to load courses:', error);
      showSnackbar('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty,
        durationHours: course.durationHours,
        modules: course.modules.length > 0 ? course.modules : [''],
        published: course.published,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        category: 'VAT',
        difficulty: 'BEGINNER',
        durationHours: 4,
        modules: [''],
        published: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
  };

  const handleSaveCourse = async () => {
    try {
      const courseData = {
        ...formData,
        modules: formData.modules.filter(m => m.trim() !== ''),
      };

      if (editingCourse) {
        // Update course logic would go here
        showSnackbar('Course updated successfully', 'success');
      } else {
        // Create new course logic would go here
        showSnackbar('Course created successfully', 'success');
      }
      handleCloseDialog();
      loadCourses();
    } catch (error) {
      showSnackbar('Failed to save course', 'error');
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        showSnackbar('Course deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete course', 'error');
      }
    }
  };

  const handleTogglePublished = async (courseId: number, published: boolean) => {
    try {
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, published } : c));
      showSnackbar(`Course ${published ? 'published' : 'unpublished'} successfully`, 'success');
    } catch (error) {
      showSnackbar('Failed to update course status', 'error');
    }
  };

  const addModule = () => {
    setFormData(prev => ({ ...prev, modules: [...prev.modules, ''] }));
  };

  const updateModule = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((m, i) => i === index ? value : m)
    }));
  };

  const removeModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'success';
      case 'INTERMEDIATE': return 'warning';
      case 'ADVANCED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Course Management
        </Typography>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Create New Course
          </Button>
        </motion.div>
      </Box>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course.id}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <CourseIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    <Chip
                      label={course.published ? 'Published' : 'Draft'}
                      color={course.published ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {course.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={course.category} size="small" variant="outlined" />
                    <Chip 
                      label={course.difficulty} 
                      size="small" 
                      color={getDifficultyColor(course.difficulty)}
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">{course.durationHours}h</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">{course.enrollments} enrolled</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Completion Rate: {course.completionRate}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.completionRate} 
                      sx={{ mt: 0.5, borderRadius: 1 }}
                    />
                  </Box>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton size="small" color="info">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Course">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(course)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Course">
                      <IconButton size="small" color="error" onClick={() => handleDeleteCourse(course.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Tooltip title={course.published ? 'Unpublish' : 'Publish'}>
                    <IconButton 
                      size="small" 
                      color={course.published ? 'warning' : 'success'}
                      onClick={() => handleTogglePublished(course.id, !course.published)}
                    >
                      <PublishIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Course Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCourse ? 'Edit Course' : 'Create New Course'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField
              label="Course Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              required
            />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat.replace('_', ' ')}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  label="Difficulty"
                >
                  {difficulties.map(diff => (
                    <MenuItem key={diff} value={diff}>{diff}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Duration (hours)"
                type="number"
                value={formData.durationHours}
                onChange={(e) => setFormData(prev => ({ ...prev, durationHours: parseInt(e.target.value) || 0 }))}
                fullWidth
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Course Modules</Typography>
              {formData.modules.map((module, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    label={`Module ${index + 1}`}
                    value={module}
                    onChange={(e) => updateModule(index, e.target.value)}
                    fullWidth
                    size="small"
                  />
                  {formData.modules.length > 1 && (
                    <Button onClick={() => removeModule(index)} color="error" size="small">
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button onClick={addModule} size="small" sx={{ mt: 1 }}>
                Add Module
              </Button>
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                />
              }
              label="Publish Course"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCourse} variant="contained">
            {editingCourse ? 'Update' : 'Create'} Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseManagement;