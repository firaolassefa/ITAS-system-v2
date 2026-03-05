import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload,
  Link as LinkIcon,
  VideoLibrary,
  PictureAsPdf,
  CheckCircle,
} from '@mui/icons-material';
import { modulesAPI } from '../api/modules';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ModuleContentDialogProps {
  open: boolean;
  onClose: () => void;
  moduleId: number;
  moduleName: string;
  onSuccess: () => void;
}

const ModuleContentDialog: React.FC<ModuleContentDialogProps> = ({
  open,
  onClose,
  moduleId,
  moduleName,
  onSuccess,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // File upload states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  
  // URL states
  const [videoUrl, setVideoUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  
  // Current module data
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState('');

  useEffect(() => {
    if (open && moduleId) {
      loadModuleContent();
    }
  }, [open, moduleId]);

  const loadModuleContent = async () => {
    try {
      const response = await modulesAPI.getModuleById(moduleId);
      const moduleData = response.data || response;
      setCurrentVideoUrl(moduleData.videoUrl || '');
      setCurrentDocumentUrl(moduleData.contentUrl || '');
      setVideoUrl(moduleData.videoUrl || '');
      setDocumentUrl(moduleData.contentUrl || '');
    } catch (error) {
      console.error('Failed to load module content:', error);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('itas_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleUploadFile = async (file: File, contentType: 'video' | 'document') => {
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contentType', contentType);

      await axios.post(
        `${API_BASE_URL}/modules/${moduleId}/upload-content`,
        formData,
        {
          ...getAuthHeaders(),
          headers: {
            ...getAuthHeaders().headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage({ type: 'success', text: `${contentType === 'video' ? 'Video' : 'Document'} uploaded successfully!` });
      
      if (contentType === 'video') {
        setVideoFile(null);
      } else {
        setDocumentFile(null);
      }
      
      await loadModuleContent();
      onSuccess();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload file',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetUrl = async (url: string, urlType: 'video' | 'document') => {
    if (!url.trim()) {
      setMessage({ type: 'error', text: 'URL cannot be empty' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await axios.post(
        `${API_BASE_URL}/modules/${moduleId}/set-url`,
        null,
        {
          ...getAuthHeaders(),
          params: {
            url: url.trim(),
            urlType,
          },
        }
      );

      setMessage({ type: 'success', text: `${urlType === 'video' ? 'Video' : 'Document'} URL set successfully!` });
      await loadModuleContent();
      onSuccess();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to set URL',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTabValue(0);
    setVideoFile(null);
    setDocumentFile(null);
    setMessage(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Manage Module Content
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {moduleName}
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Video Content" icon={<VideoLibrary />} iconPosition="start" />
          <Tab label="Document Content" icon={<PictureAsPdf />} iconPosition="start" />
        </Tabs>

        {/* Video Tab */}
        {tabValue === 0 && (
          <Box>
            {currentVideoUrl && (
              <Alert severity="info" icon={<CheckCircle />} sx={{ mb: 2 }}>
                Current video: {currentVideoUrl}
              </Alert>
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Upload Video File
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: videoFile ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                bgcolor: videoFile ? 'primary.50' : 'grey.50',
                cursor: 'pointer',
                mb: 3,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
              }}
              onClick={() => document.getElementById('video-file-input')?.click()}
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
              />

              {videoFile ? (
                <Box>
                  <VideoLibrary sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {videoFile.name}
                  </Typography>
                  <Chip label={`${(videoFile.size / 1024 / 1024).toFixed(2)} MB`} color="primary" sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadFile(videoFile, 'video');
                      }}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Upload Video'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
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
                    Click to select video file
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    MP4, AVI, MOV, WebM (Max 100MB)
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Set Video URL
            </Typography>
            <TextField
              fullWidth
              label="Video URL"
              placeholder="https://youtube.com/watch?v=... or /uploads/modules/video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={() => handleSetUrl(videoUrl, 'video')}
              disabled={loading || !videoUrl.trim()}
              fullWidth
            >
              Set Video URL
            </Button>
          </Box>
        )}

        {/* Document Tab */}
        {tabValue === 1 && (
          <Box>
            {currentDocumentUrl && (
              <Alert severity="info" icon={<CheckCircle />} sx={{ mb: 2 }}>
                Current document: {currentDocumentUrl}
              </Alert>
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Upload Document File
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: documentFile ? 'error.main' : 'grey.300',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                bgcolor: documentFile ? 'error.50' : 'grey.50',
                cursor: 'pointer',
                mb: 3,
                '&:hover': {
                  borderColor: 'error.main',
                  bgcolor: 'error.50',
                },
              }}
              onClick={() => document.getElementById('document-file-input')?.click()}
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
              />

              {documentFile ? (
                <Box>
                  <PictureAsPdf sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {documentFile.name}
                  </Typography>
                  <Chip label={`${(documentFile.size / 1024 / 1024).toFixed(2)} MB`} color="error" sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadFile(documentFile, 'document');
                      }}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Upload Document'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
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
                    Click to select document file
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PDF, DOC, DOCX, PPT, PPTX (Max 100MB)
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Set Document URL
            </Typography>
            <TextField
              fullWidth
              label="Document URL"
              placeholder="https://example.com/document.pdf or /uploads/modules/guide.pdf"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              color="error"
              startIcon={<LinkIcon />}
              onClick={() => handleSetUrl(documentUrl, 'document')}
              disabled={loading || !documentUrl.trim()}
              fullWidth
            >
              Set Document URL
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModuleContentDialog;
