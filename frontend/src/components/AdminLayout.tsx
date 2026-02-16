import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  School as CourseIcon,
  ExitToApp as LogoutIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';
import NotificationBell from './NotificationBell';

interface AdminLayoutProps {
  user: any;
  onLogout: () => void;
}

const drawerWidth = 240;

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Get role-specific dashboard path
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
    { text: 'Upload Resource', icon: <UploadIcon />, path: '/admin/upload-resource', roles: ['CONTENT_ADMIN', 'SYSTEM_ADMIN'] },
    { text: 'Webinar Management', icon: <CourseIcon />, path: '/admin/webinar-management', roles: ['TRAINING_ADMIN', 'SYSTEM_ADMIN'] },
    { text: 'Notification Center', icon: <SettingsIcon />, path: '/admin/notification-center', roles: ['COMM_OFFICER', 'SYSTEM_ADMIN'] },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics', roles: ['MANAGER', 'AUDITOR', 'SYSTEM_ADMIN'] },
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/user-role-management', roles: ['SYSTEM_ADMIN'] },
  ].filter(item => !item.roles || item.roles.includes(user?.userType || ''));

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        backgroundSize: '100% 200%',
        animation: 'gradientShift 8s ease infinite',
        '@keyframes gradientShift': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '0% 100%' },
        },
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'center', 
          flexDirection: 'column', 
          py: 3,
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
          }}
        >
          <SettingsIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Typography 
          variant="h6" 
          noWrap 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          ITAS Admin
        </Typography>
        <Chip 
          label="Administrator" 
          size="small"
          sx={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)',
          }}
        />
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&.Mui-selected': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateX(8px)',
                  },
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateX(8px)',
                },
                py: 1.5,
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 700 : 600,
                  fontSize: '0.95rem',
                  color: 'white',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '0.5px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              System Administration
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.9,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Welcome back, {user.fullName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationBell userRole={user?.userType} />
            
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/profile')}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)',
                },
              }}
            >
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
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                },
              }}
              onClick={handleMenuOpen}
            >
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {user.fullName}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Administrator
                </Typography>
              </Box>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 700,
                }}
              >
                {user.fullName?.charAt(0) || 'A'}
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 8s ease infinite',
              '@keyframes gradientShift': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              minWidth: 220,
              color: 'white',
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user.fullName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {user.email}
            </Typography>
          </Box>
          <MenuItem 
            onClick={() => navigate('/profile')}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <ProfileIcon fontSize="small" sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 0.5 }} />
          <MenuItem 
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                background: 'rgba(255, 68, 68, 0.2)',
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(245, 158, 11, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(245, 158, 11, 0.1)',
            },
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
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;