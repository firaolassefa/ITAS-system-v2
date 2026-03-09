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
  LinearProgress,
} from '@mui/material';
import { Save, VideoLibrary, PictureAsPdf, CloudUpload, Delete } from '@mui/icons-material';
import { modulesAPI } from '../../api/modules';
import { coursesAPI } from '../../api/courses';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  };
};

const ModuleContentManager: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedModule, setSelectedModule] = useState<number | ''>('');
  const [videoUrl, setVideoUrl] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // File upload states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      setVideoFile(null);
      setDocumentFile(null);
    } catch (error) {
      console.error('Failed to load module details:', error);
    }
  };

  const handleUploadFile = async (file: File, contentType: 'video' | 'document') => {
    if (!selectedModule) {
      setMessage({ type: 'error', text: 'Please select a module first' });
      return;
    }

    setUploading(true);
    setMessage(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contentType', contentType);

      const response = await axios.post(
        `${API_BASE_URL}/modules/${selectedModule}/upload-content`,
        formData,
        {
          ...getAuthHeaders(),
          headers: {
            ...getAuthHeaders().headers,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        }
      );

      setMessage({ 
        type: 'success', 
        text: `${contentType === 'video' ? 'Video' : 'Document'} uploaded successfully!` 
      });
      
      if (contentType === 'video') {
        setVideoFile(null);
      } else {
        setDocumentFile(null);
      }
      
      // Reload module details to get the new URL
      await loadModuleDetails(selectedModule as number);
      setUploadProgress(0);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload file',
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
                    Video Content
                  </Typography>
                </Box>
                
                {/* Video File Upload */}
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: videoFile ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: videoFile ? 'primary.50' : 'grey.50',
                    cursor: 'pointer',
                    mb: 2,
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50',
                    },
                  }}
                  onClick={() => !videoFile && document.getElementById('video-file-input')?.click()}
                >
                  <input
                    id="video-file-input"
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setVideoFile(e.target.files[0]);
                      }
                    }}
                    disabled={!selectedModule}
                  />
                  
                  {videoFile ? (
                    <Box>
                      <VideoLibrary sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {videoFile.name}
                      </Typography>
                      <Chip label={formatFileSize(videoFile.size)} color="primary" sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUploadFile(videoFile, 'video');
                          }}
                          disabled={uploading || !selectedModule}
                        >
                          Upload Video
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setVideoFile(null);
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {selectedModule ? 'Click to upload video file' : 'Select a module first'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        MP4, AVI, MOV, WebM (Max 100MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }}>OR</Divider>
                
                {/* Video URL */}
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Video URL
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., /uploads/modules/video.mp4 or https://youtube.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={!selectedModule}
                  size="small"
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
                    Document Content
                  </Typography>
                </Box>
                
                {/* Document File Upload */}
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: documentFile ? 'error.main' : 'grey.300',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: documentFile ? 'error.50' : 'grey.50',
                    cursor: 'pointer',
                    mb: 2,
                    '&:hover': {
                      borderColor: 'error.main',
                      bgcolor: 'error.50',
                    },
                  }}
                  onClick={() => !documentFile && document.getElementById('document-file-input')?.click()}
                >
                  <input
                    id="document-file-input"
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setDocumentFile(e.target.files[0]);
                      }
                    }}
                    disabled={!selectedModule}
                  />
                  
                  {documentFile ? (
                    <Box>
                      <PictureAsPdf sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {documentFile.name}
                      </Typography>
                      <Chip label={formatFileSize(documentFile.size)} color="error" sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUploadFile(documentFile, 'document');
                          }}
                          disabled={uploading || !selectedModule}
                        >
                          Upload Document
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDocumentFile(null);
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {selectedModule ? 'Click to upload document file' : 'Select a module first'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        PDF, DOC, DOCX, PPT, PPTX (Max 100MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }}>OR</Divider>
                
                {/* Document URL */}
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  PDF/Content URL
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., /uploads/modules/guide.pdf"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  disabled={!selectedModule}
                  size="small"
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
              
              {/* Upload Progress */}
              {uploading && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Uploading...</Typography>
                    <Typography variant="body2">{uploadProgress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}

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
