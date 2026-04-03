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
import ThemeToggle from './ThemeToggle';
import { useThemeMode } from '../theme/ThemeContext';
import { alpha, useTheme } from '@mui/material';
import MORLogo from '../assets/MORLogo';

const drawerWidth = 240;

interface StaffLayoutProps {
  children?: React.ReactNode;
  user?: any;
  onLogout?: () => void;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children, user: userProp, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout: authLogout } = useAuth();
  const theme = useTheme();
  const { mode } = useThemeMode();

  const user = userProp || authUser;
  const logout = onLogout || authLogout;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);
  const handleLogout = () => { handleProfileMenuClose(); logout(); navigate('/login'); };

  const menuItems = [
    { text: 'Dashboard',         icon: <Dashboard />,     path: '/staff/dashboard' },
    { text: 'Internal Training', icon: <Business />,      path: '/staff/internal-training' },
    { text: 'All Courses',       icon: <School />,        path: '/staff/courses' },
    { text: 'My Progress',       icon: <TrendingUp />,    path: '/staff/progress' },
    { text: 'Assessments',       icon: <Assignment />,    path: '/staff/assessments' },
    { text: 'Certificates',      icon: <CardMembership />,path: '/staff/certificates' },
    { text: 'Compliance',        icon: <Security />,      path: '/staff/compliance' },
    { text: 'Resources',         icon: <Assessment />,    path: '/staff/resources' },
    { text: 'Help & Support',    icon: <Help />,          path: '/staff/help' },
  ];

  const SIDEBAR_BG = mode === 'light' ? '#339af0' : '#1e293b';
  const ACTIVE_COLOR = '#f59e0b';

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: SIDEBAR_BG, color: 'white' }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 2,
        borderBottom: `1px solid ${alpha('#fff', 0.12)}` }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: alpha('#fff', 0.15),
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MORLogo width={36} height={36} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
            ITAS Portal
          </Typography>
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), fontWeight: 500 }}>
            MOR Staff
          </Typography>
        </Box>
      </Box>

      {/* Nav items */}
      <List sx={{ px: 2, py: 2, flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '10px', py: 1.3, transition: 'all 0.2s',
                  bgcolor: active ? alpha(ACTIVE_COLOR, 0.18) : 'transparent',
                  borderLeft: active ? `3px solid ${ACTIVE_COLOR}` : '3px solid transparent',
                  '&:hover': { bgcolor: active ? alpha(ACTIVE_COLOR, 0.22) : alpha('#fff', 0.08) },
                }}>
                <ListItemIcon sx={{ minWidth: 38, color: active ? ACTIVE_COLOR : alpha('#fff', 0.85) }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: active ? 700 : 500,
                    color: 'white',
                  }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User info at bottom */}
      <Box sx={{ px: 2, py: 2, borderTop: `1px solid ${alpha('#fff', 0.12)}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
          borderRadius: '10px', bgcolor: alpha('#fff', 0.08) }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: alpha('#fff', 0.2), fontSize: '0.85rem', fontWeight: 700 }}>
            {user?.fullName?.charAt(0) || 'S'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'white',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName || 'Staff Member'}
            </Typography>
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.65) }}>
              MOR Staff
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" elevation={0} sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: mode === 'light' ? 'white' : '#1e293b',
        color: mode === 'light' ? '#1e293b' : 'white',
        borderBottom: `1px solid ${mode === 'light' ? '#e5e7eb' : alpha('#fff', 0.08)}`,
      }}>
        <Toolbar sx={{ py: 0.5 }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: 'inherit' }}>
              Ministry of Revenue — Staff Portal
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            <NotificationBell userRole={user?.userType} userId={user?.id} />
            <Avatar onClick={handleProfileMenuOpen}
              sx={{ width: 38, height: 38, bgcolor: '#339af0', fontSize: '0.9rem',
                fontWeight: 700, cursor: 'pointer', ml: 1 }}>
              {user?.fullName?.charAt(0) || 'S'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" open
          sx={{ display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }}>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
        {children || <Outlet />}
      </Box>

      {/* Profile Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { mt: 1, borderRadius: 2, minWidth: 200,
          bgcolor: mode === 'light' ? 'white' : '#1e293b',
          border: `1px solid ${mode === 'light' ? '#e5e7eb' : '#334155'}` } }}>
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.fullName || 'Staff Member'}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email || ''}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}
          sx={{ py: 1.2, gap: 1.5 }}>
          <AccountCircle fontSize="small" sx={{ color: 'text.secondary' }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.2, gap: 1.5, color: '#ef4444' }}>
          <Logout fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StaffLayout;
