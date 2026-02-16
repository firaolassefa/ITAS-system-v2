import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  Archive as ArchiveIcon,
  RestoreFromTrash as RestoreIcon,
  DeleteForever as DeleteIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { archiveAPI, ArchivedResource } from '../../api/archive';
import { useApi } from '../../hooks/useApi';

const ArchiveManager: React.FC = () => {
  const [archivedResources, setArchivedResources] = useState<ArchivedResource[]>([]);
  const [selectedResource, setSelectedResource] = useState<ArchivedResource | null>(null);
  const [archiveDialog, setArchiveDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | 'archived' | 'scheduled'>('all');
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<number | null>(null);
  
  const { callApi, loading, error } = useApi();

  useEffect(() => {
    loadArchivedResources();
  }, [filter]);

  const loadArchivedResources = async () => {
    const result = await callApi({
      method: 'GET',
      url: '/archive/resources',
    });
    
    if (result.success) {
      setArchivedResources(result.data);
    }
  };

  const handleOpenArchiveDialog = (resource?: any) => {
    setSelectedResource(resource || null);
    setArchiveDialog(true);
    setScheduleDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now
  };

  const handleArchiveResource = async () => {
    if (!selectedResource || !scheduleDate) return;
    
    const result = await callApi({
      method: 'POST',
      url: `/archive/resources/${selectedResource.id}`,
      data: { 
        scheduleDeletion: scheduleDate.toISOString(),
        reason: 'Manual archive by admin'
      },
    });
    
    if (result.success) {
      setArchiveDialog(false);
      loadArchivedResources();
    }
  };

  const handleOpenDeleteDialog = (resourceId: number) => {
    setResourceToDelete(resourceId);
    setDeleteDialog(true);
  };

  const handlePermanentDelete = async () => {
    if (!resourceToDelete) return;
    
    const result = await callApi({
      method: 'DELETE',
      url: `/archive/${resourceToDelete}/permanent`,
    });
    
    if (result.success) {
      setDeleteDialog(false);
      setResourceToDelete(null);
      loadArchivedResources();
    }
  };

  const handleOpenRestoreDialog = (resource: ArchivedResource) => {
    setSelectedResource(resource);
    setRestoreDialog(true);
  };

  const handleRestoreResource = async () => {
    if (!selectedResource) return;
    
    const result = await callApi({
      method: 'POST',
      url: `/archive/restore/${selectedResource.id}`,
    });
    
    if (result.success) {
      setRestoreDialog(false);
      setSelectedResource(null);
      loadArchivedResources();
    }
  };

  const filteredResources = archivedResources.filter(resource => {
    if (filter === 'archived') return resource.status === 'ARCHIVED';
    if (filter === 'scheduled') return resource.status === 'ARCHIVED' && 
      new Date(resource.deletionScheduledFor) > new Date();
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilDeletion = (dateString: string) => {
    const now = new Date();
    const deletionDate = new Date(dateString);
    const diffTime = deletionDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const stats = {
    totalArchived: archivedResources.length,
    scheduledForDeletion: archivedResources.filter(r => 
      r.status === 'ARCHIVED' && new Date(r.deletionScheduledFor) > new Date()
    ).length,
    permanentlyDeleted: archivedResources.filter(r => r.status === 'DELETED').length,
    storageSaved: '1.2 GB', // This would come from API
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Archive Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            UC-MNT-001: Archive old content and manage storage
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.totalArchived}
                </Typography>
                <Typography color="text.secondary">
                  Total Archived
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.scheduledForDeletion}
                </Typography>
                <Typography color="text.secondary">
                  Scheduled for Deletion
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.permanentlyDeleted}
                </Typography>
                <Typography color="text.secondary">
                  Permanently Deleted
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.storageSaved}
                </Typography>
                <Typography color="text.secondary">
                  Storage Saved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controls */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter Resources</InputLabel>
                <Select
                  value={filter}
                  label="Filter Resources"
                  onChange={(e: SelectChangeEvent) => setFilter(e.target.value as any)}
                >
                  <MenuItem value="all">All Archived Resources</MenuItem>
                  <MenuItem value="archived">Currently Archived</MenuItem>
                  <MenuItem value="scheduled">Scheduled for Deletion</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ArchiveIcon />}
                onClick={() => handleOpenArchiveDialog()}
              >
                Archive New Resource
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={loadArchivedResources}
                disabled={loading}
              >
                Refresh List
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Archived Resources Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Resource</TableCell>
                  <TableCell>Archived Date</TableCell>
                  <TableCell>Deletion Scheduled</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {resource.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {resource.description.substring(0, 60)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDate(resource.archivedAt)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon fontSize="small" />
                        <Typography variant="body2">
                          {formatDate(resource.deletionScheduledFor)}
                        </Typography>
                        {resource.status === 'ARCHIVED' && (
                          <Chip 
                            label={`${getDaysUntilDeletion(resource.deletionScheduledFor)} days`}
                            size="small"
                            color="warning"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {resource.status === 'ARCHIVED' ? (
                        <Chip label="Archived" color="primary" size="small" />
                      ) : (
                        <Chip label="Deleted" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        45.2 MB
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        title="Download Archived Copy"
                        disabled={resource.status === 'DELETED'}
                      >
                        <DownloadIcon />
                      </IconButton>
                      {resource.status === 'ARCHIVED' && (
                        <>
                          <IconButton
                            size="small"
                            title="Restore Resource"
                            onClick={() => handleOpenRestoreDialog(resource)}
                          >
                            <RestoreIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="Permanent Delete"
                            onClick={() => handleOpenDeleteDialog(resource.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Archive Dialog */}
        <Dialog open={archiveDialog} onClose={() => setArchiveDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Archive Resource</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select a resource to archive and schedule its deletion date.
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Resource</InputLabel>
              <Select
                label="Select Resource"
                value={selectedResource?.id || ''}
                onChange={(e) => {
                  // In real app, load resources list
                }}
              >
                <MenuItem value={1}>VAT Compliance Handbook 2023</MenuItem>
                <MenuItem value={2}>Income Tax Guide 2022</MenuItem>
                <MenuItem value={3}>Old Webinar Recording</MenuItem>
              </Select>
            </FormControl>

            <DatePicker
              label="Schedule Deletion Date"
              value={scheduleDate}
              onChange={setScheduleDate}
              minDate={new Date()}
              slotProps={{ textField: { fullWidth: true } }}
            />
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              Resources will be permanently deleted on this date and cannot be recovered.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setArchiveDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleArchiveResource}
              disabled={loading || !selectedResource || !scheduleDate}
            >
              {loading ? 'Archiving...' : 'Archive Resource'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Permanent Delete</DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              This action cannot be undone. The resource will be permanently deleted from the system.
            </Alert>
            <Typography variant="body2">
              Are you sure you want to permanently delete this archived resource?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handlePermanentDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Restore Dialog */}
        <Dialog open={restoreDialog} onClose={() => setRestoreDialog(false)}>
          <DialogTitle>Restore Resource</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              This will restore the resource to the active library.
            </Alert>
            <Typography variant="body2" paragraph>
              Restoring: <strong>{selectedResource?.title}</strong>
            </Typography>
            <Typography variant="body2">
              The resource will be available for users immediately after restoration.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRestoreDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleRestoreResource}
              disabled={loading}
            >
              {loading ? 'Restoring...' : 'Restore Resource'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default ArchiveManager;