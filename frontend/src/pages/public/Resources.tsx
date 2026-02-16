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
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Login as LoginIcon,
  PictureAsPdf,
  VideoLibrary,
  Description,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { resourcesAPI } from '../../api/resources';

const PublicResources: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

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
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom>
            Browse Resources
          </Typography>
          <Typography variant="h6">
            Explore our tax education resources. Sign in to download materials.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          You're browsing as a guest. <Button color="primary" onClick={() => navigate('/login')}>Sign in</Button> to download resources.
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
                        startIcon={<LoginIcon />}
                        onClick={() => navigate('/login')}
                      >
                        Sign in to Download
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
