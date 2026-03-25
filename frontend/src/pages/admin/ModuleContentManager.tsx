import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, TextField, Button,
  Alert, CircularProgress, MenuItem, Chip, LinearProgress, Paper,
  Tabs, Tab, alpha, IconButton, Tooltip,
} from '@mui/material';
import {
  CloudUpload, VideoLibrary, PictureAsPdf, Save, Delete,
  Link as LinkIcon, CheckCircle, OpenInNew,
} from '@mui/icons-material';
import { modulesAPI } from '../../api/modules';
import { coursesAPI } from '../../api/courses';
import { apiClient } from '../../utils/axiosConfig';

const BLUE = '#339af0';
const GOLD = '#f59e0b';

// ── Reusable upload zone ──────────────────────────────────────────────────────
interface UploadZoneProps {
  label: string;
  accept: string;
  acceptLabel: string;
  icon: React.ReactNode;
  color: string;
  file: File | null;
  currentUrl: string;
  urlValue: string;
  uploading: boolean;
  uploadProgress: number;
  disabled: boolean;
  onFileSelect: (f: File) => void;
  onFileClear: () => void;
  onUpload: () => void;
  onUrlChange: (v: string) => void;
  onUrlSave: () => void;
  saving: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  label, accept, acceptLabel, icon, color, file, currentUrl,
  urlValue, uploading, uploadProgress, disabled,
  onFileSelect, onFileClear, onUpload, onUrlChange, onUrlSave, saving,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<0 | 1>(0); // 0 = file, 1 = url
  const [dragOver, setDragOver] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const s = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + s[i];
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const f = e.dataTransfer.files[0];
    if (f) onFileSelect(f);
  };

  return (
    <Paper elevation={0} sx={{
      border: `1px solid ${alpha(color, 0.25)}`,
      borderRadius: 3, overflow: 'hidden',
    }}>
      {/* Header */}
      <Box sx={{
        px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5,
        borderBottom: `1px solid ${alpha(color, 0.15)}`,
        bgcolor: alpha(color, 0.04),
      }}>
        <Box sx={{ color }}>{icon}</Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{label}</Typography>
        {currentUrl && (
          <Chip icon={<CheckCircle sx={{ fontSize: 14 }} />} label="Content set"
            size="small" sx={{ ml: 'auto', bgcolor: alpha(color, 0.1), color, fontWeight: 600,
              border: `1px solid ${alpha(color, 0.3)}` }} />
        )}
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 3, pt: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
          mb: 2, minHeight: 36,
          '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' },
          '& .Mui-selected': { color },
          '& .MuiTabs-indicator': { bgcolor: color, height: 2 },
        }}>
          <Tab icon={<CloudUpload sx={{ fontSize: 16 }} />} iconPosition="start" label="Upload File" />
          <Tab icon={<LinkIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Paste URL" />
        </Tabs>

        {/* Tab 0 — File Upload */}
        {tab === 0 && (
          <Box sx={{ pb: 3 }}>
            <input ref={inputRef} type="file" hidden accept={accept}
              onChange={e => { if (e.target.files?.[0]) onFileSelect(e.target.files[0]); e.target.value = ''; }}
              disabled={disabled} />

            {!file ? (
              <Box
                onDragOver={e => { e.preventDefault(); if (!disabled) setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
                sx={{
                  border: `2px dashed ${dragOver ? color : alpha(color, 0.3)}`,
                  borderRadius: 2, p: 4, textAlign: 'center', cursor: disabled ? 'not-allowed' : 'pointer',
                  bgcolor: dragOver ? alpha(color, 0.06) : alpha(color, 0.02),
                  transition: 'all 0.2s',
                  '&:hover': !disabled ? { borderColor: color, bgcolor: alpha(color, 0.05) } : {},
                }}
              >
                <CloudUpload sx={{ fontSize: 40, color: disabled ? '#ccc' : alpha(color, 0.5), mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, color: disabled ? 'text.disabled' : 'text.primary', mb: 0.5 }}>
                  {disabled ? 'Select a module first' : 'Drag & drop or click to browse'}
                </Typography>
                <Typography variant="caption" color="text.secondary">{acceptLabel}</Typography>
              </Box>
            ) : (
              <Box sx={{ border: `1px solid ${alpha(color, 0.3)}`, borderRadius: 2, p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: uploading ? 2 : 0 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: alpha(color, 0.1),
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                    {icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{formatSize(file.size)}</Typography>
                  </Box>
                  {!uploading && (
                    <Tooltip title="Remove">
                      <IconButton size="small" onClick={onFileClear} sx={{ color: '#ef4444' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                {uploading && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Uploading...</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color }}>{uploadProgress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={uploadProgress}
                      sx={{ height: 6, borderRadius: 3, bgcolor: alpha(color, 0.1),
                        '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 } }} />
                  </Box>
                )}
                {!uploading && (
                  <Button fullWidth variant="contained" onClick={onUpload} sx={{
                    mt: 2, bgcolor: color, fontWeight: 700, textTransform: 'none',
                    '&:hover': { bgcolor: alpha(color, 0.85) },
                  }}>
                    Upload {label}
                  </Button>
                )}
              </Box>
            )}

            {/* Current content preview */}
            {currentUrl && !file && (
              <Box sx={{ mt: 2, p: 2, bgcolor: alpha(color, 0.04), borderRadius: 2,
                border: `1px solid ${alpha(color, 0.15)}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle sx={{ color, fontSize: 18 }} />
                <Typography variant="caption" sx={{ flex: 1, color: 'text.secondary',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Current: {currentUrl}
                </Typography>
                <Tooltip title="Open in new tab">
                  <IconButton size="small" onClick={() => window.open(currentUrl, '_blank')} sx={{ color }}>
                    <OpenInNew fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        )}

        {/* Tab 1 — URL */}
        {tab === 1 && (
          <Box sx={{ pb: 3 }}>
            <TextField fullWidth size="small" label={`${label} URL`}
              placeholder="https://... or /uploads/modules/..."
              value={urlValue} onChange={e => onUrlChange(e.target.value)}
              disabled={disabled}
              InputProps={{
                startAdornment: <LinkIcon sx={{ mr: 1, color: alpha(color, 0.6), fontSize: 18 }} />,
              }}
              sx={{ mb: 2,
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: color },
                '& .MuiInputLabel-root.Mui-focused': { color },
              }} />
            <Button fullWidth variant="contained" startIcon={saving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Save />}
              onClick={onUrlSave} disabled={disabled || !urlValue.trim() || saving}
              sx={{ bgcolor: color, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: alpha(color, 0.85) } }}>
              {saving ? 'Saving...' : 'Save URL'}
            </Button>
            {currentUrl && (
              <Box sx={{ mt: 2, p: 2, bgcolor: alpha(color, 0.04), borderRadius: 2,
                border: `1px solid ${alpha(color, 0.15)}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle sx={{ color, fontSize: 18 }} />
                <Typography variant="caption" sx={{ flex: 1, color: 'text.secondary',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Current: {currentUrl}
                </Typography>
                <Tooltip title="Open in new tab">
                  <IconButton size="small" onClick={() => window.open(currentUrl, '_blank')} sx={{ color }}>
                    <OpenInNew fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ModuleContentManager: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedModule, setSelectedModule] = useState<number | ''>('');
  const [videoUrl, setVideoUrl] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<'video' | 'document' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState<'video' | 'document' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (selectedCourse) loadModules(selectedCourse as number); }, [selectedCourse]);
  useEffect(() => { if (selectedModule) loadModuleDetails(selectedModule as number); }, [selectedModule]);

  const loadCourses = async () => {
    try { const r = await coursesAPI.getAllCourses(); setCourses(r.data || []); }
    catch (e) { console.error(e); }
  };

  const loadModules = async (courseId: number) => {
    try {
      const r = await modulesAPI.getModulesByCourse(courseId);
      setModules(Array.isArray(r) ? r : []);
      setSelectedModule(''); setVideoUrl(''); setContentUrl('');
      setVideoFile(null); setDocumentFile(null);
    } catch (e) { console.error(e); }
  };

  const loadModuleDetails = async (moduleId: number) => {
    try {
      const r = await modulesAPI.getModuleById(moduleId);
      const d = r.data || r;
      setVideoUrl(d.videoUrl || '');
      setContentUrl(d.contentUrl || '');
      setVideoFile(null); setDocumentFile(null);
    } catch (e) { console.error(e); }
  };

  const handleUpload = async (file: File, type: 'video' | 'document') => {
    if (!selectedModule) return;
    setUploading(type); setMessage(null); setUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('contentType', type);
      await apiClient.post(`/modules/${selectedModule}/upload-content`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setUploadProgress(e.total ? Math.round((e.loaded * 100) / e.total) : 0);
        },
      });
      setMessage({ type: 'success', text: `${type === 'video' ? 'Video' : 'Document'} uploaded successfully!` });
      if (type === 'video') setVideoFile(null); else setDocumentFile(null);
      await loadModuleDetails(selectedModule as number);
    } catch (e: any) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Upload failed' });
    } finally { setUploading(null); setUploadProgress(0); }
  };

  const handleSaveUrl = async (type: 'video' | 'document') => {
    if (!selectedModule) return;
    setSaving(type); setMessage(null);
    try {
      await modulesAPI.updateModule(selectedModule as number, {
        videoUrl: type === 'video' ? videoUrl || null : undefined,
        contentUrl: type === 'document' ? contentUrl || null : undefined,
      });
      setMessage({ type: 'success', text: `${type === 'video' ? 'Video' : 'Document'} URL saved!` });
      await loadModuleDetails(selectedModule as number);
    } catch (e: any) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Save failed' });
    } finally { setSaving(null); }
  };

  const selectedModuleData = modules.find(m => m.id === selectedModule);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: BLUE }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Module Content Manager</Typography>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left — Module selector */}
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ border: `1px solid ${alpha(BLUE, 0.15)}`, borderRadius: 3, position: 'sticky', top: 16 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Select Module</Typography>
              <TextField fullWidth select label="Course" value={selectedCourse}
                onChange={e => setSelectedCourse(Number(e.target.value) || '')} sx={{ mb: 2 }}
                size="small">
                <MenuItem value="">Choose course...</MenuItem>
                {courses.map(c => <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>)}
              </TextField>
              <TextField fullWidth select label="Module" value={selectedModule}
                onChange={e => setSelectedModule(Number(e.target.value) || '')}
                disabled={!selectedCourse} size="small">
                <MenuItem value="">Choose module...</MenuItem>
                {modules.map(m => <MenuItem key={m.id} value={m.id}>{m.title}</MenuItem>)}
              </TextField>

              {selectedModuleData && (
                <Box sx={{ mt: 2.5, p: 2, bgcolor: alpha(BLUE, 0.05), borderRadius: 2,
                  border: `1px solid ${alpha(BLUE, 0.15)}` }}>
                  <Typography variant="caption" color="text.secondary">Selected</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.3 }}>
                    {selectedModuleData.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    {videoUrl && <Chip label="Video ✓" size="small" sx={{ bgcolor: alpha(BLUE, 0.1), color: BLUE, fontWeight: 600, fontSize: '0.7rem' }} />}
                    {contentUrl && <Chip label="Document ✓" size="small" sx={{ bgcolor: alpha(GOLD, 0.1), color: GOLD, fontWeight: 600, fontSize: '0.7rem' }} />}
                    {!videoUrl && !contentUrl && <Typography variant="caption" color="text.secondary">No content yet</Typography>}
                  </Box>
                </Box>
              )}

              {!selectedModule && (
                <Box sx={{ mt: 3, textAlign: 'center', py: 3 }}>
                  <CloudUpload sx={{ fontSize: 40, color: alpha(BLUE, 0.2), mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Select a course and module to manage its content
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right — Upload zones */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <UploadZone
              label="Video"
              accept="video/*"
              acceptLabel="MP4, AVI, MOV, WebM — max 100 MB"
              icon={<VideoLibrary />}
              color={BLUE}
              file={videoFile}
              currentUrl={videoUrl}
              urlValue={videoUrl}
              uploading={uploading === 'video'}
              uploadProgress={uploadProgress}
              disabled={!selectedModule}
              onFileSelect={setVideoFile}
              onFileClear={() => setVideoFile(null)}
              onUpload={() => videoFile && handleUpload(videoFile, 'video')}
              onUrlChange={setVideoUrl}
              onUrlSave={() => handleSaveUrl('video')}
              saving={saving === 'video'}
            />

            <UploadZone
              label="Document"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              acceptLabel="PDF, DOC, DOCX, PPT, PPTX — max 100 MB"
              icon={<PictureAsPdf />}
              color={GOLD}
              file={documentFile}
              currentUrl={contentUrl}
              urlValue={contentUrl}
              uploading={uploading === 'document'}
              uploadProgress={uploadProgress}
              disabled={!selectedModule}
              onFileSelect={setDocumentFile}
              onFileClear={() => setDocumentFile(null)}
              onUpload={() => documentFile && handleUpload(documentFile, 'document')}
              onUrlChange={setContentUrl}
              onUrlSave={() => handleSaveUrl('document')}
              saving={saving === 'document'}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModuleContentManager;
