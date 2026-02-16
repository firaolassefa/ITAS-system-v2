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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as CourseIcon,
  Description as ResourceIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import NotificationBell from './NotificationBell';

interface TaxpayerLayoutProps {
  user: any;
  onLogout: () => void;
}

const drawerWidth = 240;

const TaxpayerLayout: React.FC<TaxpayerLayoutProps> = ({ user, onLogout }) => {
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

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/taxpayer/dashboard' },
    { text: 'Courses', icon: <CourseIcon />, path: '/taxpayer/courses' },
    { text: 'Resources', icon: <ResourceIcon />, path: '/taxpayer/resources' },
  ];

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
            IT
          </Typography>
        </Box>
        <Typography 
          variant="h6" 
          noWrap
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ITAS Portal
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Taxpayer Education
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(102, 126, 234, 0.1)' }} />
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    transform: 'translateX(8px)',
                  },
                },
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateX(8px)',
                },
                py: 1.5,
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? 'white' : '#667eea',
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
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(102, 126, 234, 0.2)',
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
              Taxpayer Portal
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
                  Taxpayer
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
                {user.fullName?.charAt(0) || 'U'}
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
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              minWidth: 200,
              color: 'white',
            },
          }}
        >
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
              borderRight: '1px solid rgba(102, 126, 234, 0.1)',
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
              borderRight: '1px solid rgba(102, 126, 234, 0.1)',
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

export default TaxpayerLayout;