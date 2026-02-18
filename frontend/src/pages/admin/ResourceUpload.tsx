import React, { useState } from 'react';
import {
  Box, Button, TextField, Grid, Card, CardContent, Typography,
  MenuItem, Alert, LinearProgress, Chip, IconButton,
} from '@mui/material';
import { CloudUpload, AttachFile, Delete } from '@mui/icons-material';
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

const ResourceUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'VAT',
    resourceType: 'PDF',
    audience: 'ALL',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError('');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('category', formData.category);
    uploadData.append('resourceType', formData.resourceType);
    uploadData.append('audience', formData.audience);

    try {
      await axios.post(
        `${API_BASE_URL}/files/upload`,
        uploadData,
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
      setFormData({
        title: '',
        description: '',
        category: 'VAT',
        resourceType: 'PDF',
        audience: 'ALL',
      });
      setUploadProgress(0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
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

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Upload Resource
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* File Upload Area */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: file ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: file ? 'primary.50' : 'grey.50',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50',
                    },
                  }}
                  onClick={() => !file && document.getElementById('file-input')?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.zip"
                  />
                  
                  {file ? (
                    <Box>
                      <AttachFile sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {file.name}
                      </Typography>
                      <Chip label={formatFileSize(file.size)} color="primary" sx={{ mb: 2 }} />
                      <Box>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
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
                        PDF, DOC, PPT, MP4, MP3, ZIP (Max 50MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Resource Title"
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
                  <MenuItem value="GENERAL">General</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Resource Type"
                  value={formData.resourceType}
                  onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                >
                  <MenuItem value="PDF">PDF Document</MenuItem>
                  <MenuItem value="VIDEO">Video</MenuItem>
                  <MenuItem value="AUDIO">Audio</MenuItem>
                  <MenuItem value="DOCUMENT">Document</MenuItem>
                  <MenuItem value="PRESENTATION">Presentation</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Target Audience"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                >
                  <MenuItem value="ALL">All Users</MenuItem>
                  <MenuItem value="TAXPAYER">Taxpayers</MenuItem>
                  <MenuItem value="MOR_STAFF">MOR Staff</MenuItem>
                  <MenuItem value="BEGINNER">Beginners</MenuItem>
                  <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                  <MenuItem value="ADVANCED">Advanced</MenuItem>
                </TextField>
              </Grid>

              {/* Upload Progress */}
              {uploading && (
                <Grid item xs={12}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Uploading...</Typography>
                      <Typography variant="body2">{uploadProgress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                </Grid>
              )}

              {/* Messages */}
              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    File uploaded successfully!
                  </Alert>
                </Grid>
              )}

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={uploading || !file}
                  startIcon={<CloudUpload />}
                >
                  {uploading ? 'Uploading...' : 'Upload Resource'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResourceUpload;
