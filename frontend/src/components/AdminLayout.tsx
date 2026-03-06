import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography,
  Avatar, Menu, MenuItem, Divider, Chip, useTheme, alpha,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, Upload as UploadIcon,
  Analytics as AnalyticsIcon, People as PeopleIcon, Settings as SettingsIcon,
  School as CourseIcon, ExitToApp as LogoutIcon, Person as ProfileIcon,
  CloudUpload as CloudUploadIcon, Quiz as QuizIcon, AccountBalance,
} from '@mui/icons-material';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import { useThemeMode } from '../theme/ThemeContext';

interface AdminLayoutProps {
  user: any;
  onLogout: () => void;
}

const drawerWidth = 260;

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode } = useThemeMode();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/admin/system-dashboard';
    
    switch(user.userType) {
      case 'SYSTEM_ADMIN': return '/admin/system-dashboard';
      case 'CONTENT_ADMIN': return '/admin/content-dashboard';
      case 'TRAINING_ADMIN': return '/admin/training-dashboard';
      case 'COMM_OFFICER': return '/admin/comm-dashboard';
      case 'MANAGER': return '/admin/manager-dashboard';
      case 'AUDITOR': return '/admin/auditor-dashboard';
      default: return '/admin/system-dashboard';
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: getDashboardPath() },
    { text: 'Course Management', icon: <CourseIcon />, path: '/admin/course-management', roles: ['CONTENT_ADMIN', 'SYSTEM_ADMIN'] },
    { text: 'Module Content', icon: <CloudUploadIcon />, path: '/admin/module-content', roles: ['CONTENT_ADMIN', 'SYSTEM_ADMIN'] },
    { text: 'Resource Management', icon: <CloudUploadIcon />, path: '/admin/resource-upload', roles: ['CONTENT_ADMIN', 'SYSTEM_ADMIN'] },
    { text: 'Question Management', icon: <QuizIcon />, path: '/admin/question-management', roles: ['CONTENT_ADMIN', 'TRAINING_ADMIN', 'SYSTEM_ADMIN'] },
    { text: 'Webinar Management', icon: <UploadIcon />, path: '/admin/webinar-management', roles: ['TRAINING_ADMIN', 'SYSTEM_ADMIN'] },
    { text: 'Notification Center', icon: <SettingsIcon />, path: '/admin/notification-center', roles: ['COMM_OFFICER', 'SYSTEM_ADMIN'] },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics', roles: ['MANAGER', 'AUDITOR', 'SYSTEM_ADMIN'] },
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/user-role-management', roles: ['SYSTEM_ADMIN'] },
  ].filter(item => !item.roles || item.roles.includes(user?.userType || ''));

  const drawer = (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: mode === 'light' ? '#1e3a8a' : '#1e293b',
        color: 'white',
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'center', 
          flexDirection: 'column', 
          py: 3,
          gap: 1,
          borderBottom: '1px solid',
          borderColor: alpha('#fff', 0.1),
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            bgcolor: alpha('#fff', 0.1),
            backdropFilter: 'blur(10px)',
            border: '2px solid',
            borderColor: alpha('#fff', 0.2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <AccountBalance sx={{ color: '#f59e0b', fontSize: 32 }} />
        </Box>
        <Typography 
          variant="h6" 
          sx={{
            fontWeight: 800,
            color: 'white',
            letterSpacing: '0.5px',
          }}
        >
          ITAS Admin
        </Typography>
        <Chip 
          label={user?.userType?.replace('_', ' ') || 'Administrator'}
          size="small"
          sx={{
            bgcolor: alpha('#f59e0b', 0.2),
            color: '#fbbf24',
            fontWeight: 600,
            border: '1px solid',
            borderColor: alpha('#f59e0b', 0.3),
          }}
        />
      </Toolbar>
      
      <List sx={{ px: 2, py: 2, flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '12px',
                transition: 'all 0.3s',
                color: 'white',
                '&.Mui-selected': {
                  bgcolor: alpha('#f59e0b', 0.2),
                  borderLeft: '4px solid #f59e0b',
                  '&:hover': {
                    bgcolor: alpha('#f59e0b', 0.3),
                  },
                },
                '&:hover': {
                  bgcolor: alpha('#fff', 0.05),
                },
                py: 1.5,
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? '#fbbf24' : alpha('#fff', 0.7),
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  fontSize: '0.95rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: alpha('#fff', 0.1) }}>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), display: 'block', textAlign: 'center' }}>
          ITAS v2.0 • Ministry of Revenue
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: mode === 'light' ? '#1e3a8a' : '#1e293b',
          borderBottom: '1px solid',
          borderColor: alpha('#fff', 0.1),
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              System Administration
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Welcome, {user?.fullName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            <NotificationBell userRole={user?.userType} userId={user?.id} />
            
            <IconButton color="inherit" onClick={() => navigate('/profile')}>
              <ProfileIcon />
            </IconButton>

            <Box
              sx={{
                ml: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 0.5,
                borderRadius: '12px',
                bgcolor: alpha('#fff', 0.1),
                border: '1px solid',
                borderColor: alpha('#fff', 0.2),
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: alpha('#fff', 0.15),
                },
              }}
              onClick={handleMenuOpen}
            >
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.fullName}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Administrator
                </Typography>
              </Box>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: '#f59e0b',
                  fontWeight: 700,
                }}
              >
                {user?.fullName?.charAt(0) || 'A'}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: '12px',
              bgcolor: mode === 'light' ? '#1e3a8a' : '#1e293b',
              color: 'white',
              minWidth: 220,
            },
          }}
        >
          <MenuItem onClick={() => navigate('/profile')} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <ProfileIcon fontSize="small" sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>
          <Divider sx={{ borderColor: alpha('#fff', 0.1) }} />
          <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
