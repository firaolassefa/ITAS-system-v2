import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Grid, Card, CardContent, Typography,
  MenuItem, Alert, LinearProgress, Chip, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment,
  Tooltip, alpha, CircularProgress, Stack,
} from '@mui/material';
import {
  CloudUpload, AttachFile, Delete, Edit, Visibility, Download,
  Search, Add, Close, Description, VideoLibrary, AudioFile,
  PictureAsPdf, Folder,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api';
const BLUE = '#339af0';

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const getTypeIcon = (type: string) => {
  switch (type?.toUpperCase()) {
    case 'VIDEO': return <VideoLibrary sx={{ color: '#ef4444' }} />;
    case 'AUDIO': return <AudioFile sx={{ color: '#8b5cf6' }} />;
    case 'PDF': return <PictureAsPdf sx={{ color: '#f59e0b' }} />;
    default: return <Description sx={{ color: BLUE }} />;
  }
};

const emptyForm = {
  title: '', description: '', category: 'VAT',
  resourceType: 'PDF', audience: 'ALL',
};

const ResourceUpload: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Upload / Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // View dialog
  const [viewResource, setViewResource] = useState<any | null>(null);

  useEffect(() => { loadResources(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      resources.filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.resourceType?.toLowerCase().includes(q)
      )
    );
  }, [search, resources]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const r = await axios.get(`${API_BASE_URL}/resources`, getAuthHeaders());
      const data = r.data.data || r.data || [];
      setResources(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setFile(null);
    setMsg(null);
    setUploadProgress(0);
    setDialogOpen(true);
  };

  const openEdit = (res: any) => {
    setEditingId(res.id);
    setFormData({
      title: res.title || '',
      description: res.description || '',
      category: res.category || 'VAT',
      resourceType: res.resourceType || 'PDF',
      audience: res.audience || 'ALL',
    });
    setFile(null);
    setMsg(null);
    setUploadProgress(0);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !file) { setMsg({ type: 'error', text: 'Please select a file' }); return; }
    if (!formData.title.trim()) { setMsg({ type: 'error', text: 'Title is required' }); return; }

    setUploading(true);
    setMsg(null);

    const fd = new FormData();
    if (file) fd.append('file', file);
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('category', formData.category);
    fd.append('resourceType', formData.resourceType);
    fd.append('audience', formData.audience);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/resources/${editingId}`, fd, {
          ...getAuthHeaders(),
          headers: { ...getAuthHeaders().headers, 'Content-Type': 'multipart/form-data' },
        });
        setMsg({ type: 'success', text: 'Resource updated successfully!' });
      } else {
        await axios.post(`${API_BASE_URL}/resources/upload`, fd, {
          ...getAuthHeaders(),
          headers: { ...getAuthHeaders().headers, 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            setUploadProgress(e.total ? Math.round((e.loaded * 100) / e.total) : 0);
          },
        });
        setMsg({ type: 'success', text: 'Resource uploaded successfully!' });
      }
      await loadResources();
      setTimeout(() => { setDialogOpen(false); setMsg(null); }, 1200);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/resources/${id}`, getAuthHeaders());
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleDownload = (id: number) => {
    const token = localStorage.getItem('itas_token');
    window.open(`${API_BASE_URL}/resources/${id}/download?token=${token}`, '_blank');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: BLUE }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Resource Management</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}
          sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' }, fontWeight: 700, px: 3 }}>
          Upload Resource
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Resources', value: resources.length, color: BLUE },
          { label: 'PDFs', value: resources.filter(r => r.resourceType === 'PDF').length, color: '#f59e0b' },
          { label: 'Videos', value: resources.filter(r => r.resourceType === 'VIDEO').length, color: '#ef4444' },
          { label: 'Documents', value: resources.filter(r => r.resourceType === 'DOCUMENT').length, color: '#10b981' },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${alpha(s.color, 0.2)}`,
              bgcolor: alpha(s.color, 0.04), textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3, border: `1px solid ${alpha(BLUE, 0.15)}`, borderRadius: 2 }}>
        <TextField fullWidth size="small" placeholder="Search by title, category, type..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary' }} /></InputAdornment>,
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch('')}><Close fontSize="small" /></IconButton>
              </InputAdornment>
            ) : null,
          }} />
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: 2, border: `1px solid ${alpha(BLUE, 0.1)}`, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: BLUE }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Folder sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {search ? 'No resources match your search' : 'No resources uploaded yet'}
            </Typography>
            {!search && (
              <Button variant="contained" startIcon={<Add />} onClick={openAdd}
                sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
                Upload First Resource
              </Button>
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(BLUE, 0.05) }}>
                  {['Type', 'Title', 'Category', 'Audience', 'Size', 'Views', 'Downloads', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((res) => (
                  <TableRow key={res.id} hover sx={{ '&:hover': { bgcolor: alpha(BLUE, 0.03) } }}>
                    <TableCell>
                      <Tooltip title={res.resourceType}>
                        {getTypeIcon(res.resourceType)}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 220,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {res.title}
                      </Typography>
                      {res.description && (
                        <Typography variant="caption" color="text.secondary"
                          sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', display: 'block' }}>
                          {res.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={res.category} size="small"
                        sx={{ bgcolor: alpha(BLUE, 0.1), color: BLUE, fontWeight: 600, fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={res.audience || 'ALL'} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{formatFileSize(res.fileSize)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{res.viewCount ?? 0}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{res.downloadCount ?? 0}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => setViewResource(res)}
                            sx={{ color: BLUE }}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton size="small" onClick={() => handleDownload(res.id)}
                            sx={{ color: '#10b981' }}>
                            <Download fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(res)}
                            sx={{ color: '#f59e0b' }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(res.id, res.title)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Upload / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setMsg(null); }}
        maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: `3px solid ${BLUE}`, pb: 2 }}>
          {editingId ? '✏️ Edit Resource' : '📤 Upload New Resource'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <form id="resource-form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* File drop zone */}
              <Grid item xs={12}>
                <Box sx={{
                  border: '2px dashed', borderRadius: 2, p: 3, textAlign: 'center',
                  borderColor: file ? '#10b981' : alpha(BLUE, 0.4),
                  bgcolor: file ? alpha('#10b981', 0.04) : alpha(BLUE, 0.02),
                  cursor: 'pointer', transition: 'all 0.2s',
                  '&:hover': { borderColor: BLUE, bgcolor: alpha(BLUE, 0.04) },
                }} onClick={() => document.getElementById('res-file-input')?.click()}>
                  <input id="res-file-input" type="file" hidden
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.zip,.xlsx,.xls"
                    onChange={(e) => { setFile(e.target.files?.[0] || null); setMsg(null); }} />
                  {file ? (
                    <Box>
                      <AttachFile sx={{ fontSize: 36, color: '#10b981', mb: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{file.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize: 40, color: alpha(BLUE, 0.5), mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {editingId ? 'Click to replace file (optional)' : 'Click to select file'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PDF, DOC, PPT, MP4, MP3, ZIP, Excel (max 50MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth required label="Title" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth select label="Category" value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {['VAT', 'INCOME_TAX', 'CORPORATE_TAX', 'CUSTOMS', 'EXCISE', 'GENERAL'].map(c => (
                    <MenuItem key={c} value={c}>{c.replace('_', ' ')}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth select label="Type" value={formData.resourceType}
                  onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}>
                  {['PDF', 'VIDEO', 'AUDIO', 'DOCUMENT', 'PRESENTATION'].map(t => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth select label="Audience" value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}>
                  {['ALL', 'TAXPAYER', 'MOR_STAFF', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(a => (
                    <MenuItem key={a} value={a}>{a.replace('_', ' ')}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              {uploading && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Uploading...</Typography>
                    <Typography variant="caption">{uploadProgress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={uploadProgress}
                    sx={{ height: 6, borderRadius: 3 }} />
                </Grid>
              )}

              {msg && (
                <Grid item xs={12}>
                  <Alert severity={msg.type} onClose={() => setMsg(null)}>{msg.text}</Alert>
                </Grid>
              )}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => { setDialogOpen(false); setMsg(null); }}>Cancel</Button>
          <Button type="submit" form="resource-form" variant="contained" disabled={uploading}
            startIcon={uploading ? <CircularProgress size={18} /> : <CloudUpload />}
            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' }, fontWeight: 700 }}>
            {uploading ? 'Uploading...' : editingId ? 'Save Changes' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewResource} onClose={() => setViewResource(null)}
        maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {viewResource && getTypeIcon(viewResource.resourceType)}
            Resource Details
          </Box>
          <IconButton size="small" onClick={() => setViewResource(null)}><Close /></IconButton>
        </DialogTitle>
        {viewResource && (
          <DialogContent>
            <Stack spacing={2}>
              {[
                { label: 'Title', value: viewResource.title },
                { label: 'Description', value: viewResource.description || '—' },
                { label: 'Category', value: viewResource.category },
                { label: 'Type', value: viewResource.resourceType },
                { label: 'Audience', value: viewResource.audience },
                { label: 'File Name', value: viewResource.fileName || '—' },
                { label: 'File Size', value: formatFileSize(viewResource.fileSize) },
                { label: 'Uploaded By', value: viewResource.uploadedBy || '—' },
                { label: 'Views', value: viewResource.viewCount ?? 0 },
                { label: 'Downloads', value: viewResource.downloadCount ?? 0 },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 110, color: 'text.secondary' }}>
                    {label}:
                  </Typography>
                  <Typography variant="body2">{value}</Typography>
                </Box>
              ))}
            </Stack>
          </DialogContent>
        )}
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setViewResource(null)}>Close</Button>
          <Button variant="outlined" startIcon={<Edit />}
            onClick={() => { openEdit(viewResource); setViewResource(null); }}
            sx={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
            Edit
          </Button>
          <Button variant="contained" startIcon={<Download />}
            onClick={() => handleDownload(viewResource.id)}
            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResourceUpload;
