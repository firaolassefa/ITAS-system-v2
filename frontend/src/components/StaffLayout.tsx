import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Assignment,
  CardMembership,
  Help,
  AccountCircle,
  Logout,
  Business,
  Security,
  Assessment,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';

const drawerWidth = 240;

interface StaffLayoutProps {
  children?: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/staff/dashboard',
      description: 'Overview of your training progress',
    },
    {
      text: 'Internal Training',
      icon: <Business />,
      path: '/staff/internal-training',
      description: 'Staff-specific training programs',
    },
    {
      text: 'All Courses',
      icon: <School />,
      path: '/staff/courses',
      description: 'Browse all available courses',
    },
    {
      text: 'My Progress',
      icon: <TrendingUp />,
      path: '/staff/progress',
      description: 'Track your learning progress',
    },
    {
      text: 'Assessments',
      icon: <Assignment />,
      path: '/staff/assessments',
      description: 'Take quizzes and assessments',
    },
    {
      text: 'Certificates',
      icon: <CardMembership />,
      path: '/staff/certificates',
      description: 'View and download certificates',
    },
    {
      text: 'Compliance',
      icon: <Security />,
      path: '/staff/compliance',
      description: 'Monitor compliance status',
    },
    {
      text: 'Resources',
      icon: <Assessment />,
      path: '/staff/resources',
      description: 'Access learning resources',
    },
    {
      text: 'Help & Support',
      icon: <Help />,
      path: '/staff/help',
      description: 'Get help and support',
    },
  ];

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <Toolbar sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Business sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              noWrap
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MOR Staff
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              Internal Portal
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(16, 185, 129, 0.1)' }} />
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <Tooltip key={item.text} title={item.description} placement="right">
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '& .MuiListItemText-secondary': {
                      color: 'rgba(255, 255, 255, 0.8)',
                    },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                      transform: 'translateX(8px)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(16, 185, 129, 0.1)',
                    transform: 'translateX(8px)',
                  },
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{ 
                    color: location.pathname === item.path ? 'white' : '#10B981',
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
                  }}
                  secondary={
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: location.pathname === item.path 
                          ? 'rgba(255, 255, 255, 0.8)' 
                          : 'text.secondary',
                        display: 'block',
                        mt: 0.5,
                      }}
                    >
                      {item.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(16, 185, 129, 0.2)',
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
              ITAS - Ministry of Revenue Staff Portal
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.9,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Welcome back, {user?.fullName || 'Staff Member'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationBell userRole={user?.userType} />
            
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
              onClick={handleProfileMenuOpen}
            >
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {user?.fullName || 'Staff Member'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Staff Portal
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
                {user?.fullName?.charAt(0) || 'S'}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(16, 185, 129, 0.1)',
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
              borderRight: '1px solid rgba(16, 185, 129, 0.1)',
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
        {children || <Outlet />}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
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
            {user?.fullName || 'Staff Member'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {user?.email || 'staff@itas.gov'}
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
            <AccountCircle fontSize="small" sx={{ color: 'white' }} />
          </ListItemIcon>
          Profile
        </MenuItem>
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
            <Logout fontSize="small" sx={{ color: 'white' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StaffLayout;