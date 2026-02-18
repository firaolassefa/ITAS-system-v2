import React, { useState } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Grid, Tabs, Tab, Typography, Alert, LinearProgress,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  IconButton, Chip,
} from '@mui/material';
import { CloudUpload, Link as LinkIcon, VideoLibrary, Description, Close } from '@mui/icons-material';
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

interface ModuleContentManagerProps {
  open: boolean;
  onClose: () => void;
  moduleId: number;
  moduleName: string;
  onSuccess: () => void;
}

const ModuleContentManager: React.FC<ModuleContentManagerProps> = ({
  open,
  onClose,
  moduleId,
  moduleName,
  onSuccess,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [contentType, setContentType] = useState<'document' | 'video'>('document');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // URL input state
  const [url, setUrl] = useState('');
  const [urlType, setUrlType] = useState<'document' | 'video'>('document');
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError('');
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', contentType);

    try {
      await axios.post(
        `${API_BASE_URL}/modules/${moduleId}/upload-content`,
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

      setSuccess(true);
      setFile(null);
      setUploadProgress(0);
      onSuccess();
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post(
        `${API_BASE_URL}/modules/${moduleId}/set-url`,
        null,
        {
          ...getAuthHeaders(),
          params: {
            url: url,
            urlType: urlType,
          },
        }
      );

      setSuccess(true);
      setUrl('');
      onSuccess();
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set URL');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUrl('');
    setError('');
    setSuccess(false);
    setUploadProgress(0);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Add Content to Module</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {moduleName}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
          <Tab label="Upload File" icon={<CloudUpload />} iconPosition="start" />
          <Tab label="Add URL" icon={<LinkIcon />} iconPosition="start" />
        </Tabs>

        {/* File Upload Tab */}
        {tabValue === 0 && (
          <Box>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel>Content Type</FormLabel>
              <RadioGroup
                row
                value={contentType}
                onChange={(e) => setContentType(e.target.value as 'document' | 'video')}
              >
                <FormControlLabel
                  value="document"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description /> Document/PDF
                    </Box>
                  }
                />
                <FormControlLabel
                  value="video"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VideoLibrary /> Video
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Box
              sx={{
                border: '2px dashed',
                borderColor: file ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                bgcolor: file ? 'primary.50' : 'grey.50',
                cursor: 'pointer',
                mb: 2,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
              }}
              onClick={() => !file && document.getElementById('module-file-input')?.click()}
            >
              <input
                id="module-file-input"
                type="file"
                hidden
                onChange={handleFileChange}
                accept={contentType === 'video' ? 'video/*' : '.pdf,.doc,.docx,.ppt,.pptx'}
              />
              
              {file ? (
                <Box>
                  {contentType === 'video' ? <VideoLibrary sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} /> : <Description sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />}
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {file.name}
                  </Typography>
                  <Chip label={formatFileSize(file.size)} color="primary" sx={{ mb: 2 }} />
                  <Box>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      Remove File
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {contentType === 'video' ? 'MP4, AVI, MOV (Max 50MB)' : 'PDF, DOC, PPT (Max 50MB)'}
                  </Typography>
                </Box>
              )}
            </Box>

            {uploading && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Uploading...</Typography>
                  <Typography variant="body2">{uploadProgress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
          </Box>
        )}

        {/* URL Input Tab */}
        {tabValue === 1 && (
          <Box>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel>Content Type</FormLabel>
              <RadioGroup
                row
                value={urlType}
                onChange={(e) => setUrlType(e.target.value as 'document' | 'video')}
              >
                <FormControlLabel
                  value="document"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description /> Document URL
                    </Box>
                  }
                />
                <FormControlLabel
                  value="video"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VideoLibrary /> Video URL
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Content URL"
              placeholder="https://example.com/video.mp4 or https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              helperText="Enter a direct link to a video or document, or a YouTube/Vimeo URL"
              sx={{ mb: 2 }}
            />

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Supported URLs:
              </Typography>
              <Typography variant="body2" component="div">
                • YouTube: https://youtube.com/watch?v=...
              </Typography>
              <Typography variant="body2" component="div">
                • Vimeo: https://vimeo.com/...
              </Typography>
              <Typography variant="body2" component="div">
                • Direct links: https://example.com/file.pdf
              </Typography>
              <Typography variant="body2" component="div">
                • Google Drive: https://drive.google.com/...
              </Typography>
            </Alert>
          </Box>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Content added successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={tabValue === 0 ? handleFileUpload : handleUrlSubmit}
          disabled={uploading || (tabValue === 0 ? !file : !url.trim())}
          startIcon={tabValue === 0 ? <CloudUpload /> : <LinkIcon />}
        >
          {uploading ? 'Processing...' : tabValue === 0 ? 'Upload File' : 'Add URL'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModuleContentManager;
