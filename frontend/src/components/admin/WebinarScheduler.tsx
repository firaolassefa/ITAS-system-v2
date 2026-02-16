import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { webinarsAPI, CreateWebinarRequest } from '../../api/webinars';
import { useAuth } from '../../hooks/useAuth';

const WebinarScheduler: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  
  // Form state
  const [webinarData, setWebinarData] = useState<CreateWebinarRequest>({
    title: '',
    description: '',
    scheduleTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    durationMinutes: 60,
    presenters: [''],
    maxAttendees: 100,
    targetAudience: 'ALL_TAXPAYERS',
    meetingLink: '',
  });
  
  const [presenterInput, setPresenterInput] = useState('');

  const steps = ['Basic Details', 'Schedule & Audience', 'Review & Schedule'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddPresenter = () => {
    if (presenterInput.trim()) {
      setWebinarData({
        ...webinarData,
        presenters: [...webinarData.presenters, presenterInput.trim()],
      });
      setPresenterInput('');
    }
  };

  const handleRemovePresenter = (index: number) => {
    const newPresenters = [...webinarData.presenters];
    newPresenters.splice(index, 1);
    setWebinarData({ ...webinarData, presenters: newPresenters });
  };

  const handleScheduleWebinar = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!webinarData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!webinarData.description.trim()) {
        throw new Error('Description is required');
      }
      if (webinarData.presenters.length === 0 || webinarData.presenters[0].trim() === '') {
        throw new Error('At least one presenter is required');
      }

      // Convert scheduleTime to ISO string if it's a Date object
      const dataToSend = {
        ...webinarData,
        scheduleTime: new Date(webinarData.scheduleTime).toISOString(),
      };

      await webinarsAPI.scheduleWebinar(dataToSend);
      
      setSuccess('Webinar scheduled successfully! Notifications will be sent to the target audience.');
      
      // Reset form
      setWebinarData({
        title: '',
        description: '',
        scheduleTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 60,
        presenters: [''],
        maxAttendees: 100,
        targetAudience: 'ALL_TAXPAYERS',
        meetingLink: '',
      });
      setActiveStep(0);
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to schedule webinar');
    } finally {
      setLoading(false);
    }
  };

  const audienceOptions = [
    { value: 'ALL_TAXPAYERS', label: 'All Taxpayers' },
    { value: 'SME', label: 'Small & Medium Enterprises' },
    { value: 'INDIVIDUAL', label: 'Individual Taxpayers' },
    { value: 'NEW_TAXPAYERS', label: 'New Taxpayers (Registered < 30 days)' },
    { value: 'ACTIVE_USERS', label: 'Active Users (Logged in last 30 days)' },
    { value: 'INACTIVE_USERS', label: 'Inactive Users (Not logged in > 90 days)' },
    { value: 'COURSE_COMPLETED', label: 'Users who completed specific course' },
  ];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Webinar Title"
                value={webinarData.title}
                onChange={(e) => setWebinarData({ ...webinarData, title: e.target.value })}
                required
                helperText="Clear, descriptive title for the webinar"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={webinarData.description}
                onChange={(e) => setWebinarData({ ...webinarData, description: e.target.value })}
                multiline
                rows={4}
                required
                helperText="Detailed description of what will be covered"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meeting Link (Zoom, Teams, etc.)"
                value={webinarData.meetingLink || ''}
                onChange={(e) => setWebinarData({ ...webinarData, meetingLink: e.target.value })}
                helperText="Optional: Will be sent to registered participants"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Schedule Date & Time"
                  value={new Date(webinarData.scheduleTime)}
                  onChange={(date) => setWebinarData({ 
                    ...webinarData, 
                    scheduleTime: date ? date.toISOString() : webinarData.scheduleTime 
                  })}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={webinarData.durationMinutes}
                onChange={(e) => setWebinarData({ 
                  ...webinarData, 
                  durationMinutes: parseInt(e.target.value) || 60 
                })}
                required
                inputProps={{ min: 15, max: 240 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Attendees"
                type="number"
                value={webinarData.maxAttendees}
                onChange={(e) => setWebinarData({ 
                  ...webinarData, 
                  maxAttendees: parseInt(e.target.value) || 100 
                })}
                required
                inputProps={{ min: 1, max: 1000 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={webinarData.targetAudience}
                  label="Target Audience"
                  onChange={(e) => setWebinarData({ ...webinarData, targetAudience: e.target.value })}
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
                Presenters
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Add Presenter"
                  value={presenterInput}
                  onChange={(e) => setPresenterInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPresenter()}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddPresenter}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {webinarData.presenters.map((presenter, index) => (
                  presenter && (
                    <Chip
                      key={index}
                      label={presenter}
                      onDelete={() => handleRemovePresenter(index)}
                      color="primary"
                    />
                  )
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Webinar Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="body1">{webinarData.title}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">{webinarData.description}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Schedule
                </Typography>
                <Typography variant="body1">
                  {new Date(webinarData.scheduleTime).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {webinarData.durationMinutes} minutes
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Capacity & Audience
                </Typography>
                <Typography variant="body1">
                  Max Attendees: {webinarData.maxAttendees}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target: {audienceOptions.find(a => a.value === webinarData.targetAudience)?.label}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Presenters ({webinarData.presenters.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {webinarData.presenters.map((presenter, index) => (
                    presenter && (
                      <Chip key={index} label={presenter} variant="outlined" />
                    )
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Schedule New Webinar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          UC-ADM-001: Schedule live training sessions for taxpayers
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 3 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleScheduleWebinar}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <ScheduleIcon />}
              >
                {loading ? 'Scheduling...' : 'Schedule Webinar'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && (!webinarData.title || !webinarData.description)) ||
                  (activeStep === 1 && webinarData.presenters.length === 0)
                }
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default WebinarScheduler;