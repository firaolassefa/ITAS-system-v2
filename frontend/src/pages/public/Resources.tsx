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
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  PictureAsPdf,
  VideoLibrary,
  Description,
  Download as DownloadIcon,
  School,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { resourcesAPI } from '../../api/resources';

const PublicResources: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadResources();
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      loadResources();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadResources = async () => {
    try {
      const response = await resourcesAPI.getAllResources();
      setResources(response.data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (resource: any) => {
    if (resource.filePath) {
      let fileUrl: string;
      
      // Check if it's an external URL (starts with http/https)
      if (resource.filePath.startsWith('http')) {
        fileUrl = resource.filePath;
      } else {
        // For local files, use the download endpoint
        fileUrl = `http://localhost:8080/api/resources/${resource.id}/download`;
      }
      
      // Open in new tab for download
      window.open(fileUrl, '_blank');
    } else {
      alert('File path not available for this resource');
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || resource.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <PictureAsPdf />;
      case 'VIDEO':
        return <VideoLibrary />;
      default:
        return <Description />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading resources...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <School sx={{ fontSize: 28, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ITAS
            </Typography>
          </Box>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ 
              mr: 2, 
              textTransform: 'none', 
              fontWeight: 600,
              '&:hover': {
                bgcolor: alpha('#fff', 0.1),
              },
            }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/public/courses')}
            sx={{ 
              mr: 2, 
              textTransform: 'none', 
              fontWeight: 600,
              '&:hover': {
                bgcolor: alpha('#fff', 0.1),
              },
            }}
          >
            Courses
          </Button>
        </Toolbar>
      </AppBar>

      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Resources for Use
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Browse and download our tax education resources
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`${resources.length} resources available`} 
              sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 600 }}
            />
            <Chip 
              icon={<RefreshIcon />}
              label={`Updated: ${lastUpdated.toLocaleTimeString()}`} 
              sx={{ bgcolor: alpha('#fff', 0.2), color: 'white' }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Info Alert */}
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<RefreshIcon />}
              onClick={loadResources}
            >
              Refresh
            </Button>
          }
        >
          Resources update automatically every 30 seconds. Click refresh for immediate updates.
        </Alert>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search resources"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e: SelectChangeEvent) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="PDF">PDF Documents</MenuItem>
                  <MenuItem value="VIDEO">Videos</MenuItem>
                  <MenuItem value="DOCUMENT">Documents</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results */}
        {filteredResources.length === 0 ? (
          <Alert severity="info">
            No resources found matching your criteria. Try adjusting your filters.
          </Alert>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {filteredResources.length} resources available
            </Typography>
            
            <Grid container spacing={3}>
              {filteredResources.map((resource) => (
                <Grid item xs={12} md={6} lg={4} key={resource.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {getResourceIcon(resource.type)}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {resource.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {resource.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={resource.type} size="small" color="primary" />
                        {resource.tags && resource.tags.map((tag: any) => (
                          <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(resource)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        {resource.type === 'VIDEO' ? 'Watch Video' : 'Download'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default PublicResources;
