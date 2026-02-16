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
} from '@mui/material';
import {
  History as HistoryIcon,
  Restore as RestoreIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';

interface ResourceVersion {
  id: number;
  resourceId: number;
  versionNumber: number;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  changes: string;
  createdBy: string;
  createdAt: string;
  isCurrent: boolean;
}

const ResourceVersion: React.FC = () => {
  const [versions, setVersions] = useState<ResourceVersion[]>([]);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [restoreDialog, setRestoreDialog] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<ResourceVersion | null>(null);
  const [restoreNotes, setRestoreNotes] = useState('');
  
  const { callApi, loading, error } = useApi();

  useEffect(() => {
    loadResourceVersions();
  }, []);

  const loadResourceVersions = async () => {
    // Mock data - in real app, call API
    const mockVersions: ResourceVersion[] = [
      {
        id: 1,
        resourceId: 1,
        versionNumber: 3,
        title: 'VAT Compliance Handbook 2024',
        description: 'Complete guide to VAT compliance for small and medium businesses.',
        fileUrl: '/resources/vat-handbook-v3.pdf',
        fileSize: '2.4 MB',
        changes: 'Updated tax rates, added new compliance checklist',
        createdBy: 'Content Admin',
        createdAt: '2024-01-20T10:30:00Z',
        isCurrent: true,
      },
      {
        id: 2,
        resourceId: 1,
        versionNumber: 2,
        title: 'VAT Compliance Handbook 2023',
        description: 'Complete guide to VAT compliance for small and medium businesses.',
        fileUrl: '/resources/vat-handbook-v2.pdf',
        fileSize: '2.3 MB',
        changes: 'Fixed typos, updated contact information',
        createdBy: 'Content Admin',
        createdAt: '2023-07-15T14:20:00Z',
        isCurrent: false,
      },
      {
        id: 3,
        resourceId: 1,
        versionNumber: 1,
        title: 'VAT Compliance Handbook 2023',
        description: 'Complete guide to VAT compliance for small and medium businesses.',
        fileUrl: '/resources/vat-handbook-v1.pdf',
        fileSize: '2.2 MB',
        changes: 'Initial version',
        createdBy: 'Content Admin',
        createdAt: '2023-01-10T09:15:00Z',
        isCurrent: false,
      },
    ];
    
    setVersions(mockVersions);
  };

  const handleRestore = (version: ResourceVersion) => {
    setVersionToRestore(version);
    setRestoreDialog(true);
  };

  const confirmRestore = async () => {
    if (!versionToRestore) return;
    
    // Call API to restore version
    const result = await callApi({
      method: 'POST',
      url: `/resources/${versionToRestore.resourceId}/restore-version`,
      data: { versionId: versionToRestore.id, notes: restoreNotes },
    });
    
    if (result.success) {
      setRestoreDialog(false);
      setRestoreNotes('');
      setVersionToRestore(null);
      loadResourceVersions(); // Refresh list
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Resource Version History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          UC-CM-002: Manage and restore previous versions of resources
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Resource Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Resource: VAT Compliance Handbook 2024
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3 versions available • Last updated: January 20, 2024
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Version List */}
        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Version</TableCell>
                    <TableCell>Changes</TableCell>
                    <TableCell>File Info</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {versions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          v{version.versionNumber}.0
                        </Typography>
                        {version.isCurrent && (
                          <Chip label="Current" size="small" color="primary" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {version.changes}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {version.fileSize}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {version.fileUrl.split('.').pop()?.toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(version.createdAt)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          by {version.createdBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {version.isCurrent ? (
                          <Chip label="Active" color="success" size="small" />
                        ) : (
                          <Chip label="Archived" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" title="View">
                          <ViewIcon />
                        </IconButton>
                        <IconButton size="small" title="Download">
                          <DownloadIcon />
                        </IconButton>
                        {!version.isCurrent && (
                          <IconButton 
                            size="small" 
                            title="Restore this version"
                            onClick={() => handleRestore(version)}
                          >
                            <RestoreIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Version Statistics
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Total Versions</Typography>
                <Typography variant="body2">3</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Current Version</Typography>
                <Typography variant="body2">v3.0</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Last Updated</Typography>
                <Typography variant="body2">20 days ago</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Best Practices
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Always document changes when creating new versions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Keep major versions for significant content changes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Archive old versions after 1 year
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Notify users of important updates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Restore Dialog */}
      <Dialog open={restoreDialog} onClose={() => setRestoreDialog(false)}>
        <DialogTitle>Restore Version</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to restore version {versionToRestore?.versionNumber}.0?
          </Typography>
          <TextField
            fullWidth
            label="Restoration Notes"
            value={restoreNotes}
            onChange={(e) => setRestoreNotes(e.target.value)}
            multiline
            rows={3}
            placeholder="Explain why you're restoring this version..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={confirmRestore}
            disabled={loading}
          >
            {loading ? 'Restoring...' : 'Restore Version'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResourceVersion;