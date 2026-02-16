import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { notificationsAPI, CreateNotificationRequest } from '../../api/notifications';
import { useAuth } from '../../hooks/useAuth'

const NotificationComposer: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateNotificationRequest>({
    title: '',
    message: '',
    notificationType: 'EMAIL',
    priority: 'MEDIUM',
    targetAudience: 'ALL_TAXPAYERS',
    scheduledFor: undefined,
  });

  const audienceOptions = [
    { value: 'ALL_TAXPAYERS', label: 'All Taxpayers' },
    { value: 'SME', label: 'Small & Medium Enterprises' },
    { value: 'INDIVIDUAL', label: 'Individual Taxpayers' },
    { value: 'NEW_TAXPAYERS', label: 'New Taxpayers (Registered < 30 days)' },
    { value: 'WEBINAR_REGISTERED', label: 'Webinar Registrants' },
    { value: 'COURSE_COMPLETED', label: 'Completed Specific Course' },
    { value: 'INACTIVE_USERS', label: 'Inactive Users (Last login > 90 days)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.message.trim()) {
        throw new Error('Message is required');
      }

      await notificationsAPI.sendNotification(formData);
      
      setSuccess(true);
      setFormData({
        title: '',
        message: '',
        notificationType: 'EMAIL',
        priority: 'MEDIUM',
        targetAudience: 'ALL_TAXPAYERS',
        scheduledFor: undefined,
      });
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNow = async () => {
    const dataToSend = { ...formData, scheduledFor: undefined };
    await notificationsAPI.sendNotification(dataToSend);
  };

  const handleSchedule = async () => {
    if (!formData.scheduledFor) {
      setError('Please select a schedule time');
      return;
    }
    await notificationsAPI.sendNotification(formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Compose Notification
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          UC-ADM-002: Send educational notifications to targeted audiences
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Notification scheduled successfully!
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notification Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  multiline
                  rows={5}
                  required
                  disabled={loading}
                  helperText="Enter the notification message that will be sent to users"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Notification Type</InputLabel>
                  <Select
                    value={formData.notificationType}
                    label="Notification Type"
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      notificationType: e.target.value as any 
                    })}
                    disabled={loading}
                  >
                    <MenuItem value="EMAIL">Email</MenuItem>
                    <MenuItem value="SMS">SMS</MenuItem>
                    <MenuItem value="IN_APP">In-App Notification</MenuItem>
                    <MenuItem value="SYSTEM">System Notification</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      priority: e.target.value as any 
                    })}
                    disabled={loading}
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="URGENT">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={formData.targetAudience}
                    label="Target Audience"
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      targetAudience: e.target.value 
                    })}
                    disabled={loading}
                  >
                    {audienceOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Schedule Options
                </Typography>
                <RadioGroup
                  value={formData.scheduledFor ? 'SCHEDULED' : 'IMMEDIATE'}
                  onChange={(e) => {
                    if (e.target.value === 'IMMEDIATE') {
                      setFormData({ ...formData, scheduledFor: undefined });
                    }
                  }}
                >
                  <FormControlLabel 
                    value="IMMEDIATE" 
                    control={<Radio />} 
                    label="Send Immediately" 
                  />
                  <FormControlLabel 
                    value="SCHEDULED" 
                    control={<Radio />} 
                    label="Schedule for Later" 
                  />
                </RadioGroup>
              </Grid>

              {formData.scheduledFor !== undefined && (
                <Grid item xs={12}>
                  <DateTimePicker
                    label="Schedule Date & Time"
                    value={formData.scheduledFor ? new Date(formData.scheduledFor) : null}
                    onChange={(date) => setFormData({ 
                      ...formData, 
                      scheduledFor: date ? date.toISOString() : undefined 
                    })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Preview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>To:</strong> {audienceOptions.find(a => a.value === formData.targetAudience)?.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Type:</strong> {formData.notificationType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Priority:</strong> {formData.priority}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Schedule:</strong> {formData.scheduledFor ? 
                        new Date(formData.scheduledFor).toLocaleString() : 'Send Immediately'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={() => {
                      setFormData({
                        title: '',
                        message: '',
                        notificationType: 'EMAIL',
                        priority: 'MEDIUM',
                        targetAudience: 'ALL_TAXPAYERS',
                        scheduledFor: undefined,
                      });
                    }}
                  >
                    Clear
                  </Button>
                  
                  {formData.scheduledFor ? (
                    <Button
                      variant="contained"
                      startIcon={<ScheduleIcon />}
                      onClick={handleSchedule}
                      disabled={loading || !formData.title || !formData.message}
                    >
                      {loading ? 'Scheduling...' : 'Schedule Notification'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<SendIcon />}
                      onClick={handleSendNow}
                      disabled={loading || !formData.title || !formData.message}
                    >
                      {loading ? 'Sending...' : 'Send Now'}
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default NotificationComposer;