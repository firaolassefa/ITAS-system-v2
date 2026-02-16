import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Chip,
  Paper,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
  Modal,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  GridView as GridIcon,
  ViewList as ListIcon,
  PlayCircle as PlayIcon,
} from '@mui/icons-material';
import { resourcesAPI } from '../../api/resources';
import { COURSE_CATEGORIES, RESOURCE_TYPES } from '../../utils/constants';
import ResourceCard from '../../components/taxpayer/ResourceCard';
import VideoPlayer from '../../components/taxpayer/VideoPlayer';

interface ResourcesProps {
  user: any;
}

const Resources: React.FC<ResourcesProps> = ({ user }) => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await resourcesAPI.getAllResources();
      setResources(response.data || []);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resourceId: number) => {
    try {
      const response = await resourcesAPI.downloadResource(resourceId);
      alert(`Download started: ${response.message}`);
      await loadResources(); // Refresh to update download count
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handlePlayVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setVideoModalOpen(true);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || resource.category === categoryFilter;
    const matchesType = !typeFilter || resource.resourceType === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const stats = {
    total: resources.length,
    pdfs: resources.filter(r => r.resourceType === 'PDF').length,
    videos: resources.filter(r => r.resourceType === 'VIDEO').length,
    articles: resources.filter(r => r.resourceType === 'ARTICLE').length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading resources...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Resource Library
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            mb: 3,
            fontWeight: 400,
          }}
        >
          Access educational materials, guides, and tutorials
        </Typography>
        
        {/* Stats - Modern Futuristic */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderTop: '3px solid #667eea',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
              },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Resources
            </Typography>
          </Box>
          
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderTop: '3px solid #EF4444',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(239, 68, 68, 0.3)',
              },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#EF4444' }}>
              {stats.pdfs}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              PDFs
            </Typography>
          </Box>
          
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderTop: '3px solid #667eea',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
              },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
              {stats.videos}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Videos
            </Typography>
          </Box>
          
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderTop: '3px solid #10B981',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.3)',
              },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#10B981' }}>
              {stats.articles}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Articles
            </Typography>
          </Box>
          
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderTop: '3px solid #F59E0B',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(245, 158, 11, 0.3)',
              },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#F59E0B' }}>
              {stats.totalDownloads.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Downloads
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters - Glassmorphism */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search resources"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: '#667eea' }} />,
              }}
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e: SelectChangeEvent) => setCategoryFilter(e.target.value)}
                sx={{
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                  },
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {COURSE_CATEGORIES.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Resource Type</InputLabel>
              <Select
                value={typeFilter}
                label="Resource Type"
                onChange={(e: SelectChangeEvent) => setTypeFilter(e.target.value)}
                sx={{
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                  },
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                {RESOURCE_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, value) => value && setViewMode(value)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: '8px',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    color: '#667eea',
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="grid">
                  <GridIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setTypeFilter('');
                }}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#667eea',
                  color: '#667eea',
                  minWidth: 'auto',
                  px: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#667eea',
                    background: 'rgba(102, 126, 234, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                  },
                }}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      {filteredResources.length === 0 ? (
        <Alert 
          severity="info"
          sx={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
          }}
        >
          No resources found matching your criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography 
              variant="h5"
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {filteredResources.length} resources found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click on videos to play, PDFs/Articles to download
            </Typography>
          </Box>

          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredResources.map((resource) => (
                <Grid item xs={12} md={6} lg={4} key={resource.id}>
                  {resource.resourceType === 'VIDEO' ? (
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 3, 
                        cursor: 'pointer',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        borderTop: '3px solid #667eea',
                        borderRadius: '16px',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.02)',
                          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                          border: '1px solid rgba(102, 126, 234, 0.3)',
                        },
                      }} 
                      onClick={() => handlePlayVideo(resource.fileUrl)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PlayIcon sx={{ fontSize: 40, color: '#667eea', mr: 1 }} />
                        <Typography 
                          variant="h6"
                          sx={{ fontWeight: 700 }}
                        >
                          {resource.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {resource.description}
                      </Typography>
                      <Chip 
                        label="Click to play" 
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Paper>
                  ) : (
                    <ResourceCard
                      resource={resource}
                      onDownload={() => handleDownload(resource.id)}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              {filteredResources.map((resource) => (
                <Paper 
                  key={resource.id} 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    mb: 2,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    borderLeft: '4px solid #667eea',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.2)',
                    },
                  }}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={8}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {resource.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {resource.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={resource.resourceType} 
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                        <Chip 
                          label={resource.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ borderColor: '#667eea', color: '#667eea' }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      {resource.resourceType === 'VIDEO' ? (
                        <Button
                          startIcon={<PlayIcon />}
                          onClick={() => handlePlayVideo(resource.fileUrl)}
                          sx={{
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                            },
                          }}
                        >
                          Play Video
                        </Button>
                      ) : (
                        <Button
                          startIcon={<ClearIcon />}
                          onClick={() => handleDownload(resource.id)}
                          sx={{
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                            },
                          }}
                        >
                          Download
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}

      {/* Video Modal */}
      <Modal
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            width: '80%', 
            maxWidth: 800, 
            p: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {selectedVideo && (
            <VideoPlayer
              src={selectedVideo}
              title="Educational Video"
            />
          )}
          <Button
            fullWidth
            onClick={() => setVideoModalOpen(false)}
            sx={{ 
              mt: 3,
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            Close
          </Button>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Resources;
