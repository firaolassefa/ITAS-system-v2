import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  Close as CloseIcon,
  School as CourseIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { coursesAPI } from '../api/courses';
import { certificatesAPI } from '../api/certificates';
import axios from 'axios';

interface ProfileProps {
  user: any;
  onUserUpdate?: (updatedUser: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUserUpdate }) => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Profile Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    taxNumber: user.taxNumber || '',
    companyName: user.companyName || '',
  });
  
  // Change Password Dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  // Notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [enrollmentsRes, certificatesRes] = await Promise.all([
        coursesAPI.getUserEnrollments(user.id),
        certificatesAPI.getUserCertificates(user.id),
      ]);
      setEnrollments(enrollmentsRes.data || []);
      setCertificates(certificatesRes.data || []);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      taxNumber: user.taxNumber || '',
      companyName: user.companyName || '',
    });
    setEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/users/${user.id}`, editForm);
      if (response.data.data) {
        setSnackbar({
          open: true,
          message: 'Profile updated successfully!',
          severity: 'success',
        });
        if (onUserUpdate) {
          onUserUpdate({ ...user, ...editForm });
        }
        setEditDialogOpen(false);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error',
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New passwords do not match',
        severity: 'error',
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 6 characters',
        severity: 'error',
      });
      return;
    }

    try {
      await axios.patch(`http://localhost:8080/users/${user.id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      setSnackbar({
        open: true,
        message: 'Password changed successfully!',
        severity: 'success',
      });
      setPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to change password',
        severity: 'error',
      });
    }
  };

  const stats = {
    enrolledCourses: enrollments.length,
    completedCourses: enrollments.filter(e => e.status === 'COMPLETED').length,
    certificates: certificates.length,
    averageProgress: enrollments.length > 0
      ? enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length
      : 0,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUserTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'TAXPAYER': 'Taxpayer',
      'CONTENT_ADMIN': 'Content Administrator',
      'TRAINING_ADMIN': 'Training Administrator',
      'COMM_OFFICER': 'Communication Officer',
      'MANAGER': 'Manager',
      'SYSTEM_ADMIN': 'System Administrator',
      'AUDITOR': 'Auditor',
      'STAFF': 'Staff Member',
    };
    return labels[type] || type;
  };

  const getRoleColor = (type: string) => {
    const colors: Record<string, string> = {
      'TAXPAYER': '#667eea',
      'CONTENT_ADMIN': '#F59E0B',
      'TRAINING_ADMIN': '#F59E0B',
      'COMM_OFFICER': '#F59E0B',
      'MANAGER': '#F59E0B',
      'SYSTEM_ADMIN': '#EF4444',
      'AUDITOR': '#10B981',
      'STAFF': '#10B981',
    };
    return colors[type] || '#667eea';
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${getRoleColor(user.userType)} 0%, ${getRoleColor(user.userType)}99 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and view your progress
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - User Info Card */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              borderTop: `3px solid ${getRoleColor(user.userType)}`,
              borderRadius: '16px',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Avatar & Basic Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    background: `linear-gradient(135deg, ${getRoleColor(user.userType)} 0%, ${getRoleColor(user.userType)}99 100%)`,
                    fontSize: '3rem',
                    fontWeight: 700,
                    boxShadow: `0 8px 32px ${getRoleColor(user.userType)}40`,
                  }}
                >
                  {user.fullName?.charAt(0) || 'U'}
                </Avatar>
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, textAlign: 'center' }}>
                {user.fullName}
              </Typography>
              
              <Chip
                label={getUserTypeLabel(user.userType)}
                sx={{
                  mb: 3,
                  background: `linear-gradient(135deg, ${getRoleColor(user.userType)} 0%, ${getRoleColor(user.userType)}99 100%)`,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 2,
                  boxShadow: `0 4px 12px ${getRoleColor(user.userType)}30`,
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                  sx={{
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${getRoleColor(user.userType)} 0%, ${getRoleColor(user.userType)}99 100%)`,
                    fontWeight: 600,
                    py: 1.2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 24px ${getRoleColor(user.userType)}40`,
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => setPasswordDialogOpen(true)}
                  sx={{
                    borderRadius: '12px',
                    borderColor: getRoleColor(user.userType),
                    color: getRoleColor(user.userType),
                    fontWeight: 600,
                    py: 1.2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: getRoleColor(user.userType),
                      background: `${getRoleColor(user.userType)}10`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Password
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(102, 126, 234, 0.1)' }} />

            {/* User Details */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
                <PersonIcon sx={{ mr: 2, color: getRoleColor(user.userType), mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Username
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {user.username}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
                <EmailIcon sx={{ mr: 2, color: getRoleColor(user.userType), mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>

              {user.phoneNumber && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
                  <PhoneIcon sx={{ mr: 2, color: getRoleColor(user.userType), mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.phoneNumber}
                    </Typography>
                  </Box>
                </Box>
              )}

              {user.taxNumber && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
                  <BadgeIcon sx={{ mr: 2, color: getRoleColor(user.userType), mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Tax Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.taxNumber}
                    </Typography>
                  </Box>
                </Box>
              )}

              {user.companyName && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
                  <BusinessIcon sx={{ mr: 2, color: getRoleColor(user.userType), mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Company
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.companyName}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CalendarIcon sx={{ mr: 2, color: getRoleColor(user.userType), mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Member Since
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatDate(user.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Overall Progress Card */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  borderTop: '3px solid #667eea',
                  borderRadius: '16px',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Learning Progress
                    </Typography>
                    <TrendingIcon sx={{ fontSize: 40, color: '#667eea' }} />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Overall Progress
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {Math.round(stats.averageProgress)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.averageProgress}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        background: 'rgba(102, 126, 234, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 6,
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={0}
                sx={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderTop: '3px solid #667eea',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <CourseIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
                    {stats.enrolledCourses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Enrolled Courses
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={0}
                sx={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderTop: '3px solid #10B981',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <AssignmentIcon sx={{ fontSize: 48, color: '#10B981', mb: 2 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#10B981', mb: 1 }}>
                    {stats.completedCourses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={0}
                sx={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderTop: '3px solid #F59E0B',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(245, 158, 11, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <TrophyIcon sx={{ fontSize: 48, color: '#F59E0B', mb: 2 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#F59E0B', mb: 1 }}>
                    {stats.certificates}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Certificates
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={0}
                sx={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderTop: '3px solid #8B5CF6',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <TrendingIcon sx={{ fontSize: 48, color: '#8B5CF6', mb: 2 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#8B5CF6', mb: 1 }}>
                    {Math.round(stats.averageProgress)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Avg Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Edit Profile
            </Typography>
            <IconButton onClick={() => setEditDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={editForm.fullName}
              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={editForm.phoneNumber}
              onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
              sx={{ mb: 2 }}
            />
            {user.userType === 'TAXPAYER' && (
              <>
                <TextField
                  fullWidth
                  label="Tax Number"
                  value={editForm.taxNumber}
                  onChange={(e) => setEditForm({ ...editForm, taxNumber: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Company Name"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ borderRadius: '12px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${getRoleColor(user.userType)} 0%, ${getRoleColor(user.userType)}99 100%)`,
              fontWeight: 600,
              px: 3,
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Change Password
            </Typography>
            <IconButton onClick={() => setPasswordDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      edge="end"
                    >
                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      edge="end"
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Password must be at least 6 characters"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      edge="end"
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={passwordForm.confirmPassword !== '' && passwordForm.newPassword !== passwordForm.confirmPassword}
              helperText={
                passwordForm.confirmPassword !== '' && passwordForm.newPassword !== passwordForm.confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setPasswordDialogOpen(false)}
            sx={{ borderRadius: '12px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained"
            startIcon={<LockIcon />}
            disabled={
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              passwordForm.newPassword !== passwordForm.confirmPassword
            }
            sx={{
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${getRoleColor(user.userType)} 0%, ${getRoleColor(user.userType)}99 100%)`,
              fontWeight: 600,
              px: 3,
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
