import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  School as TeacherIcon,
  Description as ContentIcon,
  Notifications as NotificationIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { userRolesAPI, UserRole } from '../../api/userRoles';
import { useApi } from '../../hooks/useApi';
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS, getRoleDisplayName, getRoleDescription } from '../../utils/roles';

const RoleManager: React.FC = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  
  const { callApi, loading } = useApi();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const result = await callApi({ method: 'GET', url: '/roles' });
    if (result.success) {
      setRoles(result.data);
    }
  };

  const handleOpenDialog = (role?: UserRole) => {
    if (role) {
      setEditingRole(role);
      setRoleForm({
        name: role.name,
        description: role.description,
        permissions: [...role.permissions],
      });
    } else {
      setEditingRole(null);
      setRoleForm({
        name: '',
        description: '',
        permissions: [],
      });
    }
    setDialogOpen(true);
  };

  const handleSaveRole = async () => {
    // Validate
    if (!roleForm.name.trim()) {
      setError('Role name is required');
      return;
    }

    const method = editingRole ? 'PUT' : 'POST';
    const url = editingRole ? `/roles/${editingRole.id}` : '/roles';
    
    const result = await callApi({
      method,
      url,
      data: roleForm,
    });
    
    if (result.success) {
      setDialogOpen(false);
      loadRoles();
      setError(null);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (window.confirm('Are you sure you want to delete this role? Users with this role will lose access.')) {
      const result = await callApi({
        method: 'DELETE',
        url: `/roles/${roleId}`,
      });
      
      if (result.success) {
        loadRoles();
      }
    }
  };

  const handlePermissionToggle = (permission: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const permissionCategories = {
    'Content Management': [
      PERMISSIONS.VIEW_RESOURCES,
      PERMISSIONS.DOWNLOAD_RESOURCES,
      PERMISSIONS.UPLOAD_RESOURCES,
      PERMISSIONS.UPDATE_RESOURCES,
      PERMISSIONS.ARCHIVE_RESOURCES,
    ],
    'Learning Management': [
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.ENROLL_COURSES,
      PERMISSIONS.COMPLETE_MODULES,
    ],
    'Training Administration': [
      PERMISSIONS.SCHEDULE_WEBINARS,
      PERMISSIONS.MANAGE_WEBINARS,
    ],
    'Communication': [
      PERMISSIONS.SEND_NOTIFICATIONS,
    ],
    'Analytics & Reporting': [
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.EXPORT_REPORTS,
    ],
    'System Administration': [
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_ROLES,
      PERMISSIONS.SYSTEM_CONFIG,
    ],
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case ROLES.TAXPAYER: return <PersonIcon />;
      case ROLES.CONTENT_ADMIN: return <ContentIcon />;
      case ROLES.TRAINING_ADMIN: return <TeacherIcon />;
      case ROLES.COMM_OFFICER: return <NotificationIcon />;
      case ROLES.SYSTEM_ADMIN: return <AdminIcon />;
      case ROLES.MANAGER: return <AnalyticsIcon />;
      case ROLES.AUDITOR: return <SettingsIcon />;
      default: return <PersonIcon />;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case ROLES.TAXPAYER: return 'primary';
      case ROLES.CONTENT_ADMIN: return 'success';
      case ROLES.TRAINING_ADMIN: return 'warning';
      case ROLES.COMM_OFFICER: return 'info';
      case ROLES.SYSTEM_ADMIN: return 'error';
      case ROLES.MANAGER: return 'secondary';
      case ROLES.AUDITOR: return 'default';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Role Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage system roles and permissions
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* System Default Roles */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">System Default Roles</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Custom Role
              </Button>
            </Box>

            <Grid container spacing={2}>
              {Object.values(ROLES).map((role) => {
                const displayName = getRoleDisplayName(role);
                const description = getRoleDescription(role);
                const permissions = ROLE_PERMISSIONS[role];
                
                return (
                  <Grid item xs={12} md={6} lg={4} key={role}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ color: `${getRoleColor(role)}.main`, mr: 2 }}>
                            {getRoleIcon(role)}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1">
                              {displayName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {role}
                            </Typography>
                          </Box>
                          <Chip label="System" size="small" variant="outlined" />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {description}
                        </Typography>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          Key Permissions:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {permissions.slice(0, 4).map((perm) => (
                            <Chip key={perm} label={perm} size="small" />
                          ))}
                          {permissions.length > 4 && (
                            <Tooltip title={`${permissions.slice(4).join(', ')}`}>
                              <Chip label={`+${permissions.length - 4}`} size="small" />
                            </Tooltip>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        {/* Custom Roles Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Custom Roles
            </Typography>
            
            {roles.filter(r => !Object.values(ROLES).includes(r.name as any)).length === 0 ? (
              <Alert severity="info">
                No custom roles created yet. Click "Add Custom Role" to create one.
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Role Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Permissions</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles
                      .filter(r => !Object.values(ROLES).includes(r.name as any))
                      .map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <Typography variant="subtitle2">{role.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {role.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {role.permissions.slice(0, 3).map((perm) => (
                                <Chip key={perm} label={perm} size="small" />
                              ))}
                              {role.permissions.length > 3 && (
                                <Chip label={`+${role.permissions.length - 3}`} size="small" />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {new Date(role.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(role)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteRole(role.id)}
                            >
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
        </Grid>
      </Grid>

      {/* Role Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {editingRole ? 'Edit Role' : 'Create Custom Role'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role Name"
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                placeholder="e.g., Junior Content Admin"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                multiline
                rows={2}
                placeholder="Describe the role's purpose and responsibilities"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Permissions
              </Typography>
              
              {Object.entries(permissionCategories).map(([category, permissions]) => (
                <Paper key={category} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {category}
                  </Typography>
                  <FormGroup row>
                    {permissions.map((permission) => (
                      <Grid item xs={12} sm={6} md={4} key={permission}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={roleForm.permissions.includes(permission)}
                              onChange={() => handlePermissionToggle(permission)}
                            />
                          }
                          label={permission}
                        />
                      </Grid>
                    ))}
                  </FormGroup>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveRole}
            disabled={loading || !roleForm.name.trim()}
          >
            {loading ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoleManager;