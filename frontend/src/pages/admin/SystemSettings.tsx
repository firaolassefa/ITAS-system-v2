import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationIcon,
  Storage as StorageIcon,
  Email as EmailIcon,
  Backup as BackupIcon,
  Update as UpdateIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'ITAS Tax Education System',
    systemDescription: 'Internal Tax Affairs Support System for taxpayer education and training',
    maintenanceMode: false,
    allowRegistration: true,
    
    // Security Settings
    sessionTimeout: 30,
    passwordMinLength: 8,
    requirePasswordChange: false,
    enableTwoFactor: false,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationRetention: 30,
    
    // System Settings
    maxFileSize: 100,
    backupFrequency: 'daily',
    logRetention: 90,
    cacheTimeout: 60,
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: 'smtp.itas.gov',
    smtpPort: 587,
    username: 'noreply@itas.gov',
    password: '',
    encryption: 'TLS',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Save settings logic would go here
    showSnackbar('Settings saved successfully', 'success');
  };

  const handleTestEmail = () => {
    // Test email configuration logic would go here
    showSnackbar('Test email sent successfully', 'success');
  };

  const handleBackupNow = () => {
    // Trigger backup logic would go here
    showSnackbar('Backup initiated successfully', 'success');
  };

  const handleClearCache = () => {
    // Clear cache logic would go here
    showSnackbar('Cache cleared successfully', 'success');
  };

  const systemStats = [
    { label: 'System Uptime', value: '15 days, 4 hours', color: 'success' },
    { label: 'Active Users', value: '142', color: 'primary' },
    { label: 'Database Size', value: '2.4 GB', color: 'info' },
    { label: 'Storage Used', value: '45%', color: 'warning' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        System Settings
      </Typography>

      {/* System Status */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon color="primary" />
          System Status
        </Typography>
        <Grid container spacing={2}>
          {systemStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color={`${stat.color}.main`}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card sx={{ borderRadius: 3 }}>
              <CardHeader
                title="General Settings"
                avatar={<SettingsIcon color="primary" />}
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="System Name"
                    value={settings.systemName}
                    onChange={(e) => handleSettingChange('systemName', e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="System Description"
                    value={settings.systemDescription}
                    onChange={(e) => handleSettingChange('systemDescription', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      />
                    }
                    label="Maintenance Mode"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.allowRegistration}
                        onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                      />
                    }
                    label="Allow User Registration"
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card sx={{ borderRadius: 3 }}>
              <CardHeader
                title="Security Settings"
                avatar={<SecurityIcon color="secondary" />}
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Minimum Password Length"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                    fullWidth
                    size="small"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.requirePasswordChange}
                        onChange={(e) => handleSettingChange('requirePasswordChange', e.target.checked)}
                      />
                    }
                    label="Require Password Change (90 days)"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableTwoFactor}
                        onChange={(e) => handleSettingChange('enableTwoFactor', e.target.checked)}
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card sx={{ borderRadius: 3 }}>
              <CardHeader
                title="Notification Settings"
                avatar={<NotificationIcon color="info" />}
                action={
                  <IconButton onClick={() => setOpenEmailDialog(true)}>
                    <EditIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      />
                    }
                    label="SMS Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      />
                    }
                    label="Push Notifications"
                  />
                  <TextField
                    label="Notification Retention (days)"
                    type="number"
                    value={settings.notificationRetention}
                    onChange={(e) => handleSettingChange('notificationRetention', parseInt(e.target.value))}
                    fullWidth
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    onClick={handleTestEmail}
                    size="small"
                  >
                    Test Email Configuration
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* System Maintenance */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{ borderRadius: 3 }}>
              <CardHeader
                title="System Maintenance"
                avatar={<StorageIcon color="warning" />}
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Max File Size (MB)"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                    fullWidth
                    size="small"
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                      label="Backup Frequency"
                    >
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Log Retention (days)"
                    type="number"
                    value={settings.logRetention}
                    onChange={(e) => handleSettingChange('logRetention', parseInt(e.target.value))}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Cache Timeout (minutes)"
                    type="number"
                    value={settings.cacheTimeout}
                    onChange={(e) => handleSettingChange('cacheTimeout', parseInt(e.target.value))}
                    fullWidth
                    size="small"
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<BackupIcon />}
                      onClick={handleBackupNow}
                      size="small"
                      fullWidth
                    >
                      Backup Now
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<UpdateIcon />}
                      onClick={handleClearCache}
                      size="small"
                      fullWidth
                    >
                      Clear Cache
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleSaveSettings}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
            }}
          >
            Save All Settings
          </Button>
        </motion.div>
      </Box>

      {/* Email Configuration Dialog */}
      <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Email Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="SMTP Server"
              value={emailConfig.smtpServer}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpServer: e.target.value }))}
              fullWidth
            />
            <TextField
              label="SMTP Port"
              type="number"
              value={emailConfig.smtpPort}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
              fullWidth
            />
            <TextField
              label="Username"
              value={emailConfig.username}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, username: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={emailConfig.password}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, password: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Encryption</InputLabel>
              <Select
                value={emailConfig.encryption}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, encryption: e.target.value }))}
                label="Encryption"
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="TLS">TLS</MenuItem>
                <MenuItem value="SSL">SSL</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
          <Button onClick={() => { setOpenEmailDialog(false); showSnackbar('Email configuration saved', 'success'); }} variant="contained">
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemSettings;