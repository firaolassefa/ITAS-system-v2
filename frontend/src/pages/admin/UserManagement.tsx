import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  userType: string;
  active: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    userType: 'TAXPAYER',
    active: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('itas_token');
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        password: '',
        userType: user.userType,
        active: user.active,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        fullName: '',
        email: '',
        password: '',
        userType: 'TAXPAYER',
        active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('itas_token');
      const url = editingUser 
        ? `${API_BASE_URL}/users/${editingUser.id}`
        : `${API_BASE_URL}/users`;
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseDialog();
        loadUsers();
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('itas_token');
      await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getUserTypeColor = (type: string) => {
    const colors: any = {
      TAXPAYER: 'primary',
      SYSTEM_ADMIN: 'error',
      CONTENT_ADMIN: 'warning',
      TRAINING_ADMIN: 'info',
      COMM_OFFICER: 'success',
      MANAGER: 'secondary',
    };
    return colors[type] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.userType} 
                    color={getUserTypeColor(user.userType)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.active ? 'Active' : 'Inactive'} 
                    color={user.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            margin="normal"
            disabled={!!editingUser}
          />
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          {!editingUser && (
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
            />
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>User Type</InputLabel>
            <Select
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
            >
              <MenuItem value="TAXPAYER">Taxpayer</MenuItem>
              <MenuItem value="SYSTEM_ADMIN">System Admin</MenuItem>
              <MenuItem value="CONTENT_ADMIN">Content Admin</MenuItem>
              <MenuItem value="TRAINING_ADMIN">Training Admin</MenuItem>
              <MenuItem value="COMM_OFFICER">Communication Officer</MenuItem>
              <MenuItem value="MANAGER">Manager</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.value as boolean })}
            >
              <MenuItem value={true as any}>Active</MenuItem>
              <MenuItem value={false as any}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
