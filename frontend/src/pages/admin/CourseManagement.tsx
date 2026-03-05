import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Card, CardContent, Typography, IconButton,
  Chip, MenuItem, CircularProgress, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Accordion,
  AccordionSummary, AccordionDetails, List, ListItem, ListItemText,
} from '@mui/material';
import { Add, Edit, Delete, Visibility, School, ExpandMore, PlaylistAdd, CloudUpload, Link as LinkIcon } from '@mui/icons-material';
import axios from 'axios';
import ModuleContentDialog from '../../components/ModuleContentDialog';

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

interface Course {
  id?: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationHours: number;
  modules: string[];
  published: boolean;
}

interface Module {
  id?: number;
  courseId?: number;
  title: string;
  description: string;
  orderIndex: number;
  durationMinutes: number;
  contentUrl?: string;
  videoUrl?: string;
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourseForModules, setSelectedCourseForModules] = useState<number | null>(null);
  const [courseModules, setCourseModules] = useState<{ [key: number]: Module[] }>({});
  const [moduleFormData, setModuleFormData] = useState<Module>({
    title: '',
    description: '',
    orderIndex: 0,
    durationMinutes: 60,
  });
  const [contentManagerOpen, setContentManagerOpen] = useState(false);
  const [selectedModuleForContent, setSelectedModuleForContent] = useState<{ id: number; name: string } | null>(null);
  const [formData, setFormData] = useState<Course>({
    title: '',
    description: '',
    category: 'VAT',
    difficulty: 'BEGINNER',
    durationHours: 4,
    modules: [],
    published: true,
  });
  const [moduleInput, setModuleInput] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses`, getAuthHeaders());
      const coursesData = response.data.data || response.data || [];
      setCourses(coursesData);
      
      // Load modules for each course
      for (const course of coursesData) {
        if (course.id) {
          loadModulesForCourse(course.id);
        }
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadModulesForCourse = async (courseId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/modules/course/${courseId}`, getAuthHeaders());
      const modules = response.data.data || response.data || [];
      setCourseModules(prev => ({ ...prev, [courseId]: modules }));
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const handleOpenModuleDialog = (courseId: number) => {
    setSelectedCourseForModules(courseId);
    const existingModules = courseModules[courseId] || [];
    setModuleFormData({
      title: '',
      description: '',
      orderIndex: existingModules.length,
      durationMinutes: 60,
    });
    setOpenModuleDialog(true);
  };

  const handleCloseModuleDialog = () => {
    setOpenModuleDialog(false);
    setSelectedCourseForModules(null);
  };

  const handleAddModuleToCourse = async () => {
    if (!selectedCourseForModules) return;
    
    try {
      // Create the module
      await axios.post(
        `${API_BASE_URL}/modules`,
        {
          courseId: selectedCourseForModules,
          ...moduleFormData,
        },
        getAuthHeaders()
      );
      
      loadModulesForCourse(selectedCourseForModules);
      handleCloseModuleDialog();
      alert('Module created successfully! You can now add content to it.');
    } catch (error) {
      console.error('Failed to add module:', error);
      alert('Failed to add module. Please make sure you are logged in.');
    }
  };

  const handleDeleteModule = async (moduleId: number, courseId: number) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await axios.delete(`${API_BASE_URL}/modules/${moduleId}`, getAuthHeaders());
        loadModulesForCourse(courseId);
      } catch (error) {
        console.error('Failed to delete module:', error);
        alert('Failed to delete module');
      }
    }
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData(course);
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        category: 'VAT',
        difficulty: 'BEGINNER',
        durationHours: 4,
        modules: [],
        published: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setModuleInput('');
  };

  const handleAddModuleChip = () => {
    if (moduleInput.trim()) {
      setFormData({
        ...formData,
        modules: [...formData.modules, moduleInput.trim()],
      });
      setModuleInput('');
    }
  };

  const handleRemoveModule = (index: number) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingCourse) {
        await axios.put(
          `${API_BASE_URL}/courses/${editingCourse.id}`,
          formData,
          getAuthHeaders()
        );
      } else {
        await axios.post(`${API_BASE_URL}/courses`, formData, getAuthHeaders());
      }
      loadCourses();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save course:', error);
      alert('Failed to save course');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`${API_BASE_URL}/courses/${id}`, getAuthHeaders());
        loadCourses();
      } catch (error) {
        console.error('Failed to delete course:', error);
        alert('Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Course Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create Course
        </Button>
      </Box>

      {courses.length === 0 ? (
        <Alert severity="info">No courses found. Create your first course!</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {courses.map((course) => (
            <Accordion key={course.id}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <School color="primary" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {course.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip label={course.category} size="small" color="primary" />
                      <Chip label={course.difficulty} size="small" />
                      <Chip
                        label={course.published ? 'Published' : 'Draft'}
                        size="small"
                        color={course.published ? 'success' : 'default'}
                      />
                      <Chip 
                        label={`${courseModules[course.id!]?.length || 0} modules`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenDialog(course); }}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(course.id!); }}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Course Modules
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PlaylistAdd />}
                      onClick={() => handleOpenModuleDialog(course.id!)}
                    >
                      Add Module
                    </Button>
                  </Box>
                  
                  {courseModules[course.id!]?.length > 0 ? (
                    <List>
                      {courseModules[course.id!].map((module, index) => (
                        <ListItem
                          key={module.id}
                          sx={{
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 1,
                            mb: 1,
                          }}
                          secondaryAction={
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<CloudUpload />}
                                onClick={() => {
                                  setSelectedModuleForContent({ id: module.id!, name: module.title });
                                  setContentManagerOpen(true);
                                }}
                              >
                                Add Content
                              </Button>
                              <IconButton
                                edge="end"
                                color="error"
                                onClick={() => handleDeleteModule(module.id!, course.id!)}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={`${index + 1}. ${module.title}`}
                            secondary={
                              <React.Fragment>
                                <Typography variant="body2" component="span" display="block">
                                  {module.durationMinutes} minutes - {module.description}
                                </Typography>
                                {(module.contentUrl || module.videoUrl) && (
                                  <Box component="span" sx={{ display: 'inline-flex', gap: 0.5, mt: 0.5 }}>
                                    {module.contentUrl && (
                                      <Chip label="Has Document" size="small" color="primary" />
                                    )}
                                    {module.videoUrl && (
                                      <Chip label="Has Video" size="small" color="secondary" />
                                    )}
                                  </Box>
                                )}
                              </React.Fragment>
                            }
                            secondaryTypographyProps={{ component: 'div' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info">No modules yet. Add your first module!</Alert>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCourse ? 'Edit Course' : 'Create New Course'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="VAT">VAT</MenuItem>
                <MenuItem value="INCOME_TAX">Income Tax</MenuItem>
                <MenuItem value="CORPORATE_TAX">Corporate Tax</MenuItem>
                <MenuItem value="CUSTOMS">Customs</MenuItem>
                <MenuItem value="EXCISE">Excise</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <MenuItem value="BEGINNER">Beginner</MenuItem>
                <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                <MenuItem value="ADVANCED">Advanced</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Duration (hours)"
                value={formData.durationHours || 0}
                onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Course Modules
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter module name"
                  value={moduleInput}
                  onChange={(e) => setModuleInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddModuleChip()}
                />
                <Button variant="outlined" onClick={handleAddModuleChip}>
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.modules.map((module, index) => (
                  <Chip
                    key={index}
                    label={module}
                    onDelete={() => handleRemoveModule(index)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingCourse ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Module Dialog */}
      <Dialog open={openModuleDialog} onClose={handleCloseModuleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Module</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Module Title"
                value={moduleFormData.title}
                onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={moduleFormData.description}
                onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={moduleFormData.durationMinutes || 60}
                onChange={(e) => setModuleFormData({ ...moduleFormData, durationMinutes: parseInt(e.target.value) || 60 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Order"
                value={moduleFormData.orderIndex || 0}
                onChange={(e) => setModuleFormData({ ...moduleFormData, orderIndex: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                After creating the module, you can add video and document content using the "Add Content" button.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModuleDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddModuleToCourse}
            disabled={!moduleFormData.title.trim()}
          >
            Create Module
          </Button>
        </DialogActions>
      </Dialog>

      {/* Module Content Dialog */}
      {selectedModuleForContent && (
        <ModuleContentDialog
          open={contentManagerOpen}
          onClose={() => {
            setContentManagerOpen(false);
            setSelectedModuleForContent(null);
          }}
          moduleId={selectedModuleForContent.id}
          moduleName={selectedModuleForContent.name}
          onSuccess={() => {
            // Reload modules for the course
            const courseId = Object.keys(courseModules).find(key =>
              courseModules[parseInt(key)].some(m => m.id === selectedModuleForContent.id)
            );
            if (courseId) {
              loadModulesForCourse(parseInt(courseId));
            }
          }}
        />
      )}
    </Box>
  );
};

export default CourseManagement;
