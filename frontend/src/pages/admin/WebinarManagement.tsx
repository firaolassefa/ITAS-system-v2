import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, TextField, Button,
  Grid, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Fade, Zoom, Avatar, SelectChangeEvent, CircularProgress, Alert, Snackbar,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoCall as VideoIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { webinarApi, Webinar } from '../../api/webinars';

const WebinarManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    totalRegistered: 0,
    avgAttendance: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [webinarData, setWebinarData] = useState({
    title: '',
    description: '',
    scheduleDate: new Date(),
    scheduleTime: new Date(),
    durationMinutes: 60,
    maxAttendees: 100,
    presenters: [''],
    targetAudience: 'ALL_TAXPAYERS',
    meetingLink: '',
  });

  useEffect(() => {
    loadWebinars();
    loadStats();
  }, []);

  const loadWebinars = async () => {
    try {
      setLoading(true);
      const response = await webinarApi.getAll();
      
      // Handle different response structures
      let webinarData = [];
      if (response.data) {
        if (response.data.content) {
          // Page object
          webinarData = response.data.content;
        } else if (Array.isArray(response.data)) {
          // Direct array
          webinarData = response.data;
        }
      } else if (response.content) {
        // Page object at root
        webinarData = response.content;
      } else if (Array.isArray(response)) {
        // Direct array at root
        webinarData = response;
      }
      
      setWebinars(Array.isArray(webinarData) ? webinarData : []);
      setError('');
    } catch (err: any) {
      console.error('Error loading webinars:', err);
      setError(err.response?.data?.message || 'Failed to load webinars');
      setWebinars([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await webinarApi.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSchedule = async () => {
    try {
      // Validation
      if (!webinarData.title || webinarData.title.length < 5) {
        setSnackbar({
          open: true,
          message: 'Title must be at least 5 characters',
          severity: 'error',
        });
        return;
      }

      if (!webinarData.description || webinarData.description.length < 20) {
        setSnackbar({
          open: true,
          message: 'Description must be at least 20 characters',
          severity: 'error',
        });
        return;
      }

      const filteredPresenters = webinarData.presenters.filter(p => p.trim() !== '');
      if (filteredPresenters.length === 0) {
        setSnackbar({
          open: true,
          message: 'At least one presenter is required',
          severity: 'error',
        });
        return;
      }

      // Combine date and time into a single datetime
      const scheduleDateTime = new Date(webinarData.scheduleDate);
      const timeDate = new Date(webinarData.scheduleTime);
      scheduleDateTime.setHours(timeDate.getHours());
      scheduleDateTime.setMinutes(timeDate.getMinutes());
      scheduleDateTime.setSeconds(0);
      scheduleDateTime.setMilliseconds(0);

      const webinarPayload = {
        title: webinarData.title,
        description: webinarData.description,
        scheduleTime: scheduleDateTime.toISOString(),
        durationMinutes: webinarData.durationMinutes,
        maxAttendees: webinarData.maxAttendees,
        presenters: filteredPresenters,
        targetAudience: webinarData.targetAudience,
        meetingLink: webinarData.meetingLink || undefined,
      };

      await webinarApi.create(webinarPayload);
      setSnackbar({
        open: true,
        message: 'Webinar scheduled successfully!',
        severity: 'success',
      });
      setOpenDialog(false);
      // Reset form
      setWebinarData({
        title: '',
        description: '',
        scheduleDate: new Date(),
        scheduleTime: new Date(),
        durationMinutes: 60,
        maxAttendees: 100,
        presenters: [''],
        targetAudience: 'ALL_TAXPAYERS',
        meetingLink: '',
      });
      loadWebinars();
      loadStats();
    } catch (err: any) {
      console.error('Error scheduling webinar:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to schedule webinar',
        severity: 'error',
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minHeight: '100vh', background: '#ffffff', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Fade in timeout={800}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                  Webinar Management
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Schedule and manage educational webinars for taxpayers
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}
                sx={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', px: 3, py: 1.5, fontWeight: 600, borderRadius: 2,
                  '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }
                }}>
                Schedule New Webinar
              </Button>
            </Box>
          </Fade>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { label: 'Total Webinars', value: stats.total, icon: <VideoIcon />, color: '#667eea' },
              { label: 'Upcoming', value: stats.upcoming, icon: <ScheduleIcon />, color: '#10B981' },
              { label: 'Total Registered', value: stats.totalRegistered, icon: <PeopleIcon />, color: '#F59E0B' },
              { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: <EventIcon />, color: '#8B5CF6' },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in timeout={600 + index * 100}>
                  <Paper sx={{ p: 3, background: 'white', border: '1px solid #e5e7eb', borderTop: `4px solid ${stat.color}`, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: `0 12px 24px ${stat.color}40` }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>{stat.value}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{stat.label}</Typography>
                      </Box>
                      <Box sx={{ width: 56, height: 56, borderRadius: 2, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                        {stat.icon}
                      </Box>
                    </Box>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          {/* Webinar List */}
          <Fade in timeout={1200}>
            <Paper sx={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ p: 4 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              ) : webinars.length === 0 ? (
                <Box sx={{ p: 8, textAlign: 'center' }}>
                  <VideoIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">No webinars scheduled yet</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Click "Schedule New Webinar" to create your first webinar</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: '#f9fafb' }}>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Webinar</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Date & Time</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Presenters</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Attendees</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }} align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {webinars.map((webinar, index) => (
                        <TableRow key={webinar.id} sx={{ '&:hover': { background: '#f9fafb' }, animation: `fadeIn 0.5s ease ${index * 0.1}s both` }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width: 48, height: 48 }}>
                                <VideoIcon />
                              </Avatar>
                              <Box>
                                <Typography sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>{webinar.title}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{webinar.description}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>{new Date(webinar.scheduleTime).toLocaleDateString()}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{new Date(webinar.scheduleTime).toLocaleTimeString()} • {webinar.durationMinutes} min</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {webinar.presenters?.map((p, i) => (
                                <Chip key={i} label={p} size="small" sx={{ background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.3)', fontWeight: 600 }} />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{webinar.registeredCount || webinar.registered || 0}/{webinar.maxAttendees}</Typography>
                              <Box sx={{ width: '100%', height: 6, background: '#e5e7eb', borderRadius: 3, mt: 0.5, overflow: 'hidden' }}>
                                <Box sx={{ width: `${(((webinar.registeredCount || webinar.registered || 0) / webinar.maxAttendees) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)', borderRadius: 3, transition: 'width 0.5s ease' }} />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={webinar.status} sx={{ background: webinar.status === 'UPCOMING' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(156, 163, 175, 0.15)', color: webinar.status === 'UPCOMING' ? '#10B981' : '#9CA3AF', border: `1px solid ${webinar.status === 'UPCOMING' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(156, 163, 175, 0.3)'}`, fontWeight: 600 }} />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" sx={{ color: '#667eea', '&:hover': { background: 'rgba(102, 126, 234, 0.1)' } }}>
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#EF4444', '&:hover': { background: 'rgba(239, 68, 68, 0.1)' } }}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Fade>

          {/* Schedule Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth
            PaperProps={{ sx: { background: 'white', borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' } }}>
            <DialogTitle sx={{ color: 'text.primary', fontWeight: 700, fontSize: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              Schedule New Webinar
              <IconButton onClick={() => setOpenDialog(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Webinar Title" required value={webinarData.title} onChange={(e) => setWebinarData({ ...webinarData, title: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Description" multiline rows={3} value={webinarData.description} onChange={(e) => setWebinarData({ ...webinarData, description: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker label="Date" value={webinarData.scheduleDate} onChange={(date) => setWebinarData({ ...webinarData, scheduleDate: date || new Date() })} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={6}>
                  <TimePicker label="Time" value={webinarData.scheduleTime} onChange={(time) => setWebinarData({ ...webinarData, scheduleTime: time || new Date() })} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Duration (minutes)" type="number" value={webinarData.durationMinutes} onChange={(e) => setWebinarData({ ...webinarData, durationMinutes: parseInt(e.target.value) })} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Max Attendees" type="number" value={webinarData.maxAttendees} onChange={(e) => setWebinarData({ ...webinarData, maxAttendees: parseInt(e.target.value) })} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Target Audience</InputLabel>
                    <Select value={webinarData.targetAudience} label="Target Audience" onChange={(e: SelectChangeEvent) => setWebinarData({ ...webinarData, targetAudience: e.target.value })}>
                      <MenuItem value="ALL_TAXPAYERS">All Taxpayers</MenuItem>
                      <MenuItem value="SME">Small & Medium Enterprises</MenuItem>
                      <MenuItem value="INDIVIDUAL">Individual Taxpayers</MenuItem>
                      <MenuItem value="NEW_TAXPAYERS">New Taxpayers</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Presenter Name" 
                    required
                    value={webinarData.presenters[0] || ''} 
                    onChange={(e) => setWebinarData({ ...webinarData, presenters: [e.target.value] })}
                    helperText="Enter the name of the webinar presenter"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Meeting Link (Optional)" 
                    value={webinarData.meetingLink} 
                    onChange={(e) => setWebinarData({ ...webinarData, meetingLink: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                    helperText="Zoom, Google Meet, or other meeting platform link"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
              <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary', '&:hover': { background: '#f9fafb' } }}>Cancel</Button>
              <Button onClick={handleSchedule} variant="contained" sx={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', fontWeight: 600, px: 3,
                '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }
              }}>Schedule Webinar</Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ background: snackbar.severity === 'success' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#fff', fontWeight: 600 }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default WebinarManagement;
