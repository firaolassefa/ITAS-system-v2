import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Login as LoginIcon, Home as HomeIcon } from '@mui/icons-material';

const PublicLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            ITAS Tax Education Portal
          </Typography>
          <Button color="inherit" startIcon={<HomeIcon />} onClick={() => navigate('/')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate('/public/courses')}>
            Browse Courses
          </Button>
          <Button color="inherit" variant="outlined" startIcon={<LoginIcon />} onClick={() => navigate('/login')} sx={{ ml: 2 }}>
            Sign In
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'grey.200' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} ITAS Tax Education Portal. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;
