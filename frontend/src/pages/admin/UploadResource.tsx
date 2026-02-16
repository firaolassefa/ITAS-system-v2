import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  SelectChangeEvent,
  LinearProgress,
  Fade,
  Zoom,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as DocumentIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { resourcesAPI } from '../../api/resources';
import { COURSE_CATEGORIES, RESOURCE_TYPES } from '../../utils/constants';

const UploadResource: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceType: 'PDF',
    category: 'VAT',
    audience: 'ALL',
    file: null as File | null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess(false);
    setUploadProgress(0);

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.file) {
        throw new Error('Please select a file to upload');
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const resourceData = {
        title: formData.title,
        description: formData.description,
        resourceType: formData.resourceType,
        category: formData.category,
        audience: formData.audience,
        fileUrl: `/uploads/${formData.file.name}`,
        fileType: formData.file.type,
        fileSize: formData.file.size,
      };

      await resourcesAPI.uploadResource(resourceData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setSuccess(true);
        setFormData({
          title: '',
          description: '',
          resourceType: 'PDF',
          category: 'VAT',
          audience: 'ALL',
          file: null,
        });
        setUploadProgress(0);
      }, 500);

    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getResourceTypeIcon = () => {
    switch (formData.resourceType) {
      case 'PDF': return <DocumentIcon sx={{ fontSize: 48, color: '#EF4444' }} />;
      case 'VIDEO': return <VideoIcon sx={{ fontSize: 48, color: '#667eea' }} />;
      case 'ARTICLE': return <ArticleIcon sx={{ fontSize: 48, color: '#10B981' }} />;
      default: return <DocumentIcon sx={{ fontSize: 48 }} />;
    }
  };

  const getResourceTypeColor = () => {
    switch (formData.resourceType) {
      case 'PDF': return '#EF4444';
      case 'VIDEO': return '#667eea';
      case 'ARTICLE': return '#10B981';
      default: return '#667eea';
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
    <Container maxWidth="lg" sx={{ animation: 'fadeIn 0.6s ease-out' }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              mr: 3,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <UploadIcon sx={{ fontSize: 40, color: '#667eea' }} />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Upload New Resource
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Add educational materials to the resource library
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Success Alert */}
      <Zoom in={success}>
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
          icon={<CheckIcon />}
          action={
            <IconButton size="small" onClick={() => setSuccess(false)}>
              <CloseIcon />
            </IconButton>
          }
        >
          Resource uploaded successfully! It will appear in the library shortly.
        </Alert>
      </Zoom>

      {/* Error Alert */}
      {error && (
        <Fade in={!!error}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        </Fade>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Form */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              borderRadius: '16px',
              animation: 'scaleIn 0.4s ease-out',
            }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Resource Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    disabled={uploading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Resource Type</InputLabel>
                    <Select
                      name="resourceType"
                      value={formData.resourceType}
                      label="Resource Type"
                      onChange={handleSelectChange}
                      disabled={uploading}
                      sx={{
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                        },
                      }}
                    >
                      {RESOURCE_TYPES.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      label="Category"
                      onChange={handleSelectChange}
                      disabled={uploading}
                      sx={{
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                        },
                      }}
                    >
                      {COURSE_CATEGORIES.map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Target Audience</InputLabel>
                    <Select
                      name="audience"
                      value={formData.audience}
                      label="Target Audience"
                      onChange={handleSelectChange}
                      disabled={uploading}
                      sx={{
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                        },
                      }}
                    >
                      <MenuItem value="ALL">All Users</MenuItem>
                      <MenuItem value="TAXPAYER">Taxpayers</MenuItem>
                      <MenuItem value="STAFF">Staff</MenuItem>
                      <MenuItem value="SME">Small Businesses</MenuItem>
                      <MenuItem value="INDIVIDUAL">Individuals</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Drag and Drop File Upload */}
                <Grid item xs={12}>
                  <Box
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    sx={{
                      border: `2px dashed ${dragActive ? getResourceTypeColor() : 'rgba(102, 126, 234, 0.3)'}`,
                      borderRadius: '16px',
                      p: 4,
                      textAlign: 'center',
                      background: dragActive 
                        ? `linear-gradient(135deg, ${getResourceTypeColor()}10 0%, ${getResourceTypeColor()}05 100%)`
                        : 'rgba(102, 126, 234, 0.02)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: getResourceTypeColor(),
                        background: `linear-gradient(135deg, ${getResourceTypeColor()}10 0%, ${getResourceTypeColor()}05 100%)`,
                        transform: 'scale(1.01)',
                      },
                    }}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    {formData.file ? (
                      <Box sx={{ animation: 'scaleIn 0.3s ease-out' }}>
                        <FileIcon sx={{ fontSize: 60, color: getResourceTypeColor(), mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {formData.file.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatFileSize(formData.file.size)}
                        </Typography>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, file: null }));
                          }}
                          sx={{ mt: 2 }}
                        >
                          Remove File
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        {getResourceTypeIcon()}
                        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                          {dragActive ? 'Drop file here' : 'Drag & drop file here'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          or click to browse
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Supported: {formData.resourceType === 'PDF' ? 'PDF files' : 
                                     formData.resourceType === 'VIDEO' ? 'MP4, MOV, AVI' : 
                                     'TXT, DOC, DOCX'}
                        </Typography>
                      </Box>
                    )}
                    <input
                      id="file-upload"
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      accept={formData.resourceType === 'PDF' ? '.pdf' : 
                              formData.resourceType === 'VIDEO' ? 'video/*' : 
                              '*/*'}
                    />
                  </Box>
                </Grid>

                {/* Upload Progress */}
                {uploading && (
                  <Grid item xs={12}>
                    <Fade in={uploading}>
                      <Box sx={{ animation: 'slideUp 0.3s ease-out' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Uploading...
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#667eea' }}>
                            {uploadProgress}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={uploadProgress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            background: 'rgba(102, 126, 234, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={uploading || !formData.file}
                    startIcon={<UploadIcon />}
                    sx={{
                      py: 2,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    {uploading ? 'Uploading...' : 'Upload Resource'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Right Column - Guidelines */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              borderTop: `3px solid ${getResourceTypeColor()}`,
              borderRadius: '16px',
              animation: 'scaleIn 0.4s ease-out 0.1s both',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 40px ${getResourceTypeColor()}30`,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {getResourceTypeIcon()}
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 700 }}>
                  {formData.resourceType} Guidelines
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Max File Size
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData.resourceType === 'VIDEO' ? '100MB' : 
                   formData.resourceType === 'PDF' ? '50MB' : '10MB'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Allowed Extensions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData.resourceType === 'PDF' ? '.pdf' : 
                   formData.resourceType === 'VIDEO' ? '.mp4, .mov, .avi' : 
                   '.txt, .doc, .docx'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Quality Requirements
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, color: 'text.secondary' }}>
                  <li><Typography variant="body2">Clear, readable content</Typography></li>
                  <li><Typography variant="body2">Proper formatting</Typography></li>
                  <li><Typography variant="body2">No copyrighted material</Typography></li>
                  <li><Typography variant="body2">Relevant to tax education</Typography></li>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card 
            elevation={0}
            sx={{ 
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(16, 185, 129, 0.1)',
              borderTop: '3px solid #10B981',
              borderRadius: '16px',
              animation: 'scaleIn 0.4s ease-out 0.2s both',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.3)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                Upload Tips
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, color: 'text.secondary' }}>
                <li><Typography variant="body2" sx={{ mb: 1 }}>Use descriptive titles</Typography></li>
                <li><Typography variant="body2" sx={{ mb: 1 }}>Provide detailed descriptions</Typography></li>
                <li><Typography variant="body2" sx={{ mb: 1 }}>Choose appropriate categories</Typography></li>
                <li><Typography variant="body2" sx={{ mb: 1 }}>Verify file quality before upload</Typography></li>
                <li><Typography variant="body2">Ensure content is up-to-date</Typography></li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UploadResource;
