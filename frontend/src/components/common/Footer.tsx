import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
} from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} ITAS Tax Education System
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Link href="/privacy" color="text.secondary" variant="body2">
            Privacy Policy
          </Link>
          <Link href="/terms" color="text.secondary" variant="body2">
            Terms of Service
          </Link>
          <Link href="/contact" color="text.secondary" variant="body2">
            Contact Us
          </Link>
          <Link href="/help" color="text.secondary" variant="body2">
            Help Center
          </Link>
        </Box>
        
        <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 2, display: 'block' }}>
          Version 1.0.0 • For official use only
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;