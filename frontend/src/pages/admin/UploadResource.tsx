import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Chip, Alert,
  CircularProgress, Tooltip, InputAdornment, Card, CardContent,
} from '@mui/material';
import {
  Edit, Delete, Search, Visibility, Add,
  Refresh, PictureAsPdf, VideoLibrary,
  Image as ImageIcon, Description, CloudUpload, AudioFile,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';

interface Resource {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  resourceType: string;
  category: string;
  audience: string;
  status: string;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt?: string;
  viewCount: number;
  downloadCount: number;
}

const UploadResource: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  // Dynamic options from backend
  const [categories, setCategories] = useState<string[]>([]);
  const [resourceTypes, setResourceTypes] = useState<string[]>([]);
  const [audiences, setAudiences] = useState<string[]>([]);

  // Form state for upload
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    resourceType: '',
    category: '',
    audience: '',
    file: null as File | null,
  });

  // Form state for edit
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    resourceType: '',
    category: '',
    audience: '',
    file: null as File | null,
  });

  // Load dynamic options and resources on component mount
  useEffect(() => {
    loadDynamicOptions();
    loadResources();
  }, []);

  // Filter resources when search/filter changes
  useEffect(() => {
    filterResources();
  }, [searchQuery, filterCategory, filterType, resources]);

  const loadDynamicOptions = async () => {
    try {
      const [categoriesRes, typesRes, audiencesRes] = await Promise.all([
        apiClient.get('/resources/categories'),
        apiClient.get('/resources/types'),
        apiClient.get('/resources/audiences'),
      ]);

      const fetchedCategories = categoriesRes.data.data || [];
      const fetchedTypes = typesRes.data.data || [];
      const fetchedAudiences = audiencesRes.data.data || [];

      // Set with defaults if empty
      const finalCategories = fetchedCategories.length > 0 ? fetchedCategories : ['INCOME_TAX', 'VAT', 'CORPORATE_TAX', 'CUSTOMS', 'EXCISE', 'GENERAL'];
      const finalTypes = fetchedTypes.length > 0 ? fetchedTypes : ['PDF', 'VIDEO', 'IMAGE', 'DOCUMENT', 'AUDIO'];
      const finalAudiences = fetchedAudiences.length > 0 ? fetchedAudiences : ['TAXPAYER', 'TAXPAYER', 'MOR_STAFF', 'ALL'];

      setCategories(finalCategories);
      setResourceTypes(finalTypes);
      setAudiences(finalAudiences);

      // Set default values for upload form
      setUploadFormData({
        title: '',
        description: '',
        resourceType: finalTypes[0],
        category: finalCategories[0],
        audience: finalAudiences[0],
        file: null,
      });
    } catch (error) {
      console.error('Error loading dynamic options:', error);
      // Set defaults on error
      const defaultCategories = ['INCOME_TAX', 'VAT', 'CORPORATE_TAX', 'CUSTOMS', 'EXCISE', 'GENERAL'];
      const defaultTypes = ['PDF', 'VIDEO', 'IMAGE', 'DOCUMENT', 'AUDIO'];
      const defaultAudiences = ['TAXPAYER', 'TAXPAYER', 'MOR_STAFF', 'ALL'];

      setCategories(defaultCategories);
      setResourceTypes(defaultTypes);
      setAudiences(defaultAudiences);

      setUploadFormData({
        title: '',
        description: '',
        resourceType: defaultTypes[0],
        category: defaultCategories[0],
        audience: defaultAudiences[0],
        file: null,
      });
    }
  };

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/resources');
      const resourcesData = response.data.data || [];
      console.log('Loaded resources:', resourcesData);
      setResources(resourcesData);
    } catch (error) {
      console.error('Error loading resources:', error);
      showAlert('error', 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((r) => r.category === filterCategory);
    }

    if (filterType) {
      filtered = filtered.filter((r) => r.resourceType === filterType);
    }

    setFilteredResources(filtered);
  };

  const handleUpload = async () => {
    if (!uploadFormData.file || !uploadFormData.title) {
      showAlert('error', 'Please fill in title and select a file');
      return;
    }

    try {
      setUploading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('file', uploadFormData.file);
      formDataToSend.append('title', uploadFormData.title);
      formDataToSend.append('description', uploadFormData.description);
      formDataToSend.append('resourceType', uploadFormData.resourceType);
      formDataToSend.append('category', uploadFormData.category);
      formDataToSend.append('audience', uploadFormData.audience);

      await apiClient.post('/resources/upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showAlert('success', 'Resource uploaded successfully');
      setOpenUploadDialog(false);
      resetUploadForm();
      loadResources();
    } catch (error: any) {
      console.error('Error uploading resource:', error);
      showAlert('error', error.response?.data?.message || 'Failed to upload resource');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedResource || !editFormData.title) {
      showAlert('error', 'Please fill in all required fields');
      return;
    }

    try {
      const formDataToSend = new FormData();
      if (editFormData.file) {
        formDataToSend.append('file', editFormData.file);
      }
      formDataToSend.append('title', editFormData.title);
      formDataToSend.append('description', editFormData.description);
      formDataToSend.append('resourceType', editFormData.resourceType);
      formDataToSend.append('category', editFormData.category);
      formDataToSend.append('audience', editFormData.audience);

      await apiClient.put(`/resources/${selectedResource.id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showAlert('success', 'Resource updated successfully');
      setOpenEditDialog(false);
      resetEditForm();
      loadResources();
    } catch (error: any) {
      console.error('Error updating resource:', error);
      showAlert('error', error.response?.data?.message || 'Failed to update resource');
    }
  };

  const handleDelete = async () => {
    if (!selectedResource) return;

    try {
      await apiClient.delete(`/resources/${selectedResource.id}`);
      showAlert('success', 'Resource deleted successfully');
      setOpenDeleteDialog(false);
      setSelectedResource(null);
      loadResources();
    } catch (error: any) {
      console.error('Error deleting resource:', error);
      showAlert('error', error.response?.data?.message || 'Failed to delete resource');
    }
  };

  const openEditDialogHandler = (resource: Resource) => {
    setSelectedResource(resource);
    setEditFormData({
      title: resource.title,
      description: resource.description,
      resourceType: resource.resourceType,
      category: resource.category,
      audience: resource.audience,
      file: null,
    });
    setOpenEditDialog(true);
  };

  const openDeleteDialogHandler = (resource: Resource) => {
    setSelectedResource(resource);
    setOpenDeleteDialog(true);
  };

  const resetUploadForm = () => {
    setUploadFormData({
      title: '',
      description: '',
      resourceType: resourceTypes[0] || 'PDF',
      category: categories[0] || 'INCOME_TAX',
      audience: audiences[0] || 'TAXPAYER',
      file: null,
    });
  };

  const resetEditForm = () => {
    setEditFormData({
      title: '',
      description: '',
      resourceType: '',
      category: '',
      audience: '',
      file: null,
    });
    setSelectedResource(null);
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getResourceIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return <PictureAsPdf color="error" />;
      case 'VIDEO':
        return <VideoLibrary color="primary" />;
      case 'IMAGE':
        return <ImageIcon color="success" />;
      case 'AUDIO':
        return <AudioFile color="secondary" />;
      default:
        return <Description />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Resource Management
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            View, edit, and manage learning resources
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => setOpenUploadDialog(true)}
        >
          Upload Resource
        </Button>
      </Box>

      {/* Alert */}
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Resources
              </Typography>
              <Typography variant="h4">{resources.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                PDFs
              </Typography>
              <Typography variant="h4">
                {resources.filter((r) => r.resourceType === 'PDF').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Videos
              </Typography>
              <Typography variant="h4">
                {resources.filter((r) => r.resourceType === 'VIDEO').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Views
              </Typography>
              <Typography variant="h4">
                {resources.reduce((sum, r) => sum + (r.viewCount || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {resourceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadResources}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Resources Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Audience</TableCell>
              <TableCell>File Size</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Downloads</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredResources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary">No resources found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredResources.map((resource) => (
                <TableRow key={resource.id} hover>
                  <TableCell>{getResourceIcon(resource.resourceType)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {resource.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {resource.fileName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={resource.category.replace(/_/g, ' ')} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={resource.audience.replace(/_/g, ' ')} size="small" color="primary" />
                  </TableCell>
                  <TableCell>{formatFileSize(resource.fileSize)}</TableCell>
                  <TableCell>{resource.viewCount || 0}</TableCell>
                  <TableCell>{resource.downloadCount || 0}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => window.open(`/api/resources/${resource.id}/stream`, '_blank')}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => openEditDialogHandler(resource)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDeleteDialogHandler(resource)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Resource</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              required
              value={uploadFormData.title}
              onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={uploadFormData.description}
              onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
            />
            <FormControl fullWidth required>
              <InputLabel>Resource Type</InputLabel>
              <Select
                value={uploadFormData.resourceType}
                label="Resource Type"
                onChange={(e) => setUploadFormData({ ...uploadFormData, resourceType: e.target.value })}
              >
                {resourceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={uploadFormData.category}
                label="Category"
                onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Target Audience</InputLabel>
              <Select
                value={uploadFormData.audience}
                label="Target Audience"
                onChange={(e) => setUploadFormData({ ...uploadFormData, audience: e.target.value })}
              >
                {audiences.map((aud) => (
                  <MenuItem key={aud} value={aud}>
                    {aud.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
              {uploadFormData.file ? uploadFormData.file.name : 'Choose File'}
              <input
                type="file"
                hidden
                onChange={(e) => setUploadFormData({ ...uploadFormData, file: e.target.files?.[0] || null })}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            variant="contained"
            disabled={!uploadFormData.file || !uploadFormData.title || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Resource</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              required
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            />
            <FormControl fullWidth required>
              <InputLabel>Resource Type</InputLabel>
              <Select
                value={editFormData.resourceType}
                label="Resource Type"
                onChange={(e) => setEditFormData({ ...editFormData, resourceType: e.target.value })}
              >
                {resourceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={editFormData.category}
                label="Category"
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Target Audience</InputLabel>
              <Select
                value={editFormData.audience}
                label="Target Audience"
                onChange={(e) => setEditFormData({ ...editFormData, audience: e.target.value })}
              >
                {audiences.map((aud) => (
                  <MenuItem key={aud} value={aud}>
                    {aud.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
              {editFormData.file ? editFormData.file.name : 'Replace File (Optional)'}
              <input
                type="file"
                hidden
                onChange={(e) => setEditFormData({ ...editFormData, file: e.target.files?.[0] || null })}
              />
            </Button>
            <Typography variant="caption" color="textSecondary">
              Leave file empty to keep the existing file
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedResource?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UploadResource;
