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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Avatar,
  Switch,
  TablePagination,
  InputAdornment,
  Fade,
  Zoom,
  CircularProgress,
  Snackbar,
  SelectChangeEvent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  userType: string;
  active: boolean;
  createdAt: string;
  phoneNumber?: string;
  taxNumber?: string;
  companyName?: string;
}

const UserRoleManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const roles = [
    'TAXPAYER',
    'CONTENT_ADMIN',
    'TRAINING_ADMIN',
    'COMM_OFFICER',
    'MANAGER',
    'SYSTEM_ADMIN',
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:8080/api/users');
      const userData = response.data.data || response.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err: any) {
      console.error('Error loading users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await axios.put(`http://localhost:8080/users/${userId}`, {
        userType: newRole,
      });
      
      setSnackbar({
        open: true,
        message: 'User role updated successfully!',
        severity: 'success',
      });
      
      await loadUsers();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update role',
        severity: 'error',
      });
    }
  };

  const handleStatusToggle = async (userId: number, currentStatus: boolean) => {
    try {
      await axios.patch(`http://localhost:8080/users/${userId}/status`, {
        active: !currentStatus,
      });
      
      setSnackbar({
        open: true,
        message: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`,
        severity: 'success',
      });
      
      await loadUsers();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update status',
        severity: 'error',
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      await axios.put(`http://localhost:8080/users/${selectedUser.id}`, {
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        phoneNumber: selectedUser.phoneNumber,
        userType: selectedUser.userType,
      });
      
      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success',
      });
      
      setEditDialogOpen(false);
      await loadUsers();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update user',
        severity: 'error',
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.userType === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.active).length,
    inactive: users.filter(u => !u.active).length,
    admins: users.filter(u => u.userType?.includes('ADMIN')).length,
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'TAXPAYER': '#667eea',
      'CONTENT_ADMIN': '#F59E0B',
      'TRAINING_ADMIN': '#10B981',
      'COMM_OFFICER': '#3B82F6',
      'MANAGER': '#8B5CF6',
      'SYSTEM_ADMIN': '#EF4444',
    };
    return colors[role] || '#667eea';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              User & Role Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage users, assign roles, and control access permissions
            </Typography>
          </Box>
        </Fade>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total Users', value: stats.total, icon: <PeopleIcon />, color: '#667eea' },
            { label: 'Active Users', value: stats.active, icon: <CheckIcon />, color: '#10B981' },
            { label: 'Inactive Users', value: stats.inactive, icon: <BlockIcon />, color: '#EF4444' },
            { label: 'Admin Users', value: stats.admins, icon: <AdminIcon />, color: '#F59E0B' },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Zoom in timeout={600 + index * 100}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderTop: `4px solid ${stat.color}`,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 24px ${stat.color}40`,
                      borderColor: stat.color,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        background: `${stat.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                </Paper>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Search and Filter Section */}
        <Fade in timeout={1000}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Role</InputLabel>
                  <Select
                    value={filterRole}
                    onChange={(e: SelectChangeEvent) => setFilterRole(e.target.value)}
                    label="Filter by Role"
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#fff',
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                    },
                  }}
                >
                  Add User
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Users Table */}
        <Fade in timeout={1200}>
          <Paper
            sx={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error">
                  {error}
                </Alert>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: '#f9fafb' }}>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>User</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Email</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Role</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>Joined</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }} align="right">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((user, index) => (
                          <TableRow
                            key={user.id}
                            sx={{
                              '&:hover': {
                                background: '#f9fafb',
                              },
                              animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
                              '@keyframes fadeIn': {
                                from: { opacity: 0, transform: 'translateY(10px)' },
                                to: { opacity: 1, transform: 'translateY(0)' },
                              },
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  sx={{
                                    background: `linear-gradient(135deg, ${getRoleColor(user.userType)} 0%, ${getRoleColor(user.userType)}dd 100%)`,
                                    width: 40,
                                    height: 40,
                                  }}
                                >
                                  <PersonIcon />
                                </Avatar>
                                <Box>
                                  <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>
                                    {user.fullName || user.username}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    @{user.username}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.userType?.replace('_', ' ')}
                                sx={{
                                  background: `${getRoleColor(user.userType)}15`,
                                  color: getRoleColor(user.userType),
                                  border: `1px solid ${getRoleColor(user.userType)}40`,
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={user.active}
                                onChange={() => handleStatusToggle(user.id, user.active)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#10B981',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#10B981',
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={() => handleEditUser(user)}
                                sx={{
                                  color: '#667eea',
                                  '&:hover': {
                                    background: 'rgba(102, 126, 234, 0.1)',
                                  },
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                sx={{
                                  color: '#EF4444',
                                  '&:hover': {
                                    background: 'rgba(239, 68, 68, 0.1)',
                                  },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={filteredUsers.length}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                  sx={{
                    borderTop: '1px solid #e5e7eb',
                  }}
                />
              </>
            )}
          </Paper>
        </Fade>

        {/* Edit User Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle sx={{ color: '#fff', fontWeight: 700, fontSize: '1.5rem' }}>
            Edit User
            <IconButton
              onClick={() => setEditDialogOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#fff',
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={selectedUser?.fullName || ''}
                    onChange={(e) =>
                      setSelectedUser(prev => prev ? { ...prev, fullName: e.target.value } : null)
                    }
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    InputProps={{
                      sx: {
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#fff',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={selectedUser?.email || ''}
                    onChange={(e) =>
                      setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)
                    }
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    InputProps={{
                      sx: {
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#fff',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={selectedUser?.phoneNumber || ''}
                    onChange={(e) =>
                      setSelectedUser(prev => prev ? { ...prev, phoneNumber: e.target.value } : null)
                    }
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    InputProps={{
                      sx: {
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#fff',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Role</InputLabel>
                    <Select
                      value={selectedUser?.userType || ''}
                      onChange={(e: SelectChangeEvent) =>
                        setSelectedUser(prev => prev ? { ...prev, userType: e.target.value } : null)
                      }
                      label="Role"
                      sx={{
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#fff',
                        },
                      }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
              sx={{
                color: '#fff',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                },
              }}
            >
              Save Changes
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
              background: snackbar.severity === 'success' 
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UserRoleManagement;
