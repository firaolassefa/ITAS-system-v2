import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import { Save, VideoLibrary, PictureAsPdf } from '@mui/icons-material';
import { modulesAPI } from '../../api/modules';
import { coursesAPI } from '../../api/courses';

const ModuleContentManager: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedModule, setSelectedModule] = useState<number | ''>('');
  const [videoUrl, setVideoUrl] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
      loadModuleDetails(selectedModule as number);
    }
  }, [selectedModule]);

  const loadCourses = async () => {
    try {
      const response = await coursesAPI.getAllCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const loadModules = async (courseId: number) => {
    try {
      const response = await modulesAPI.getModulesByCourse(courseId);
      const modulesData = Array.isArray(response) ? response : [];
      setModules(modulesData);
      setSelectedModule('');
      setVideoUrl('');
      setContentUrl('');
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const loadModuleDetails = async (moduleId: number) => {
    try {
      const response = await modulesAPI.getModuleById(moduleId);
      const moduleData = response.data || response;
      setVideoUrl(moduleData.videoUrl || '');
      setContentUrl(moduleData.contentUrl || '');
    } catch (error) {
      console.error('Failed to load module details:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedModule) {
      setMessage({ type: 'error', text: 'Please select a module' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await modulesAPI.updateModule(selectedModule as number, {
        videoUrl: videoUrl || null,
        contentUrl: contentUrl || null,
      });

      setMessage({ type: 'success', text: 'Module content updated successfully!' });
      
      // Reload module details
      await loadModuleDetails(selectedModule as number);
    } catch (error: any) {
      console.error('Failed to update module:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update module content' 
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedModuleData = modules.find(m => m.id === selectedModule);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Module Content Manager
      </Typography>

      <Grid container spacing={3}>
        {/* Selection Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Module
              </Typography>

              <TextField
                fullWidth
                select
                label="Course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(Number(e.target.value) || '')}
                sx={{ mb: 2 }}
              >
                <MenuItem value="">Select a course...</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="Module"
                value={selectedModule}
                onChange={(e) => setSelectedModule(Number(e.target.value) || '')}
                disabled={!selectedCourse}
              >
                <MenuItem value="">Select a module...</MenuItem>
                {modules.map((module) => (
                  <MenuItem key={module.id} value={module.id}>
                    {module.title}
                  </MenuItem>
                ))}
              </TextField>

              {selectedModuleData && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Selected Module:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedModuleData.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Order: {selectedModuleData.order + 1}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Content Panel */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Module Content URLs
              </Typography>

              {message && (
                <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
                  {message.text}
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <VideoLibrary sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Video URL
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., /uploads/modules/video.mp4 or https://youtube.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={!selectedModule}
                />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Quick fill examples (click to use):
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                    <Chip 
                      label="/uploads/modules/arduino project.mp4" 
                      size="small" 
                      onClick={() => setVideoUrl('/uploads/modules/arduino%20project.mp4')}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Box>
                  {videoUrl && (
                    <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                      Full URL: http://localhost:8080/api{videoUrl}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PictureAsPdf sx={{ mr: 1, color: 'error.main' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    PDF/Content URL
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., /uploads/modules/guide.pdf"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  disabled={!selectedModule}
                />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Quick fill examples (click to use):
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                    <Chip 
                      label="/uploads/modules/Lab Manual Performance Testing with K6.pdf" 
                      size="small" 
                      onClick={() => setContentUrl('/uploads/modules/Lab%20Manual%20Performance%20Testing%20with%20K6.pdf')}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Box>
                  {contentUrl && (
                    <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                      Full URL: http://localhost:8080/api{contentUrl}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                onClick={handleSave}
                disabled={!selectedModule || loading}
                fullWidth
                size="large"
              >
                {loading ? 'Saving...' : 'Save Module Content'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModuleContentManager;
