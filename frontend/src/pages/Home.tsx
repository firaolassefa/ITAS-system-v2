import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
} from '@mui/material';
import { School, MenuBook, VideoLibrary, Login as LoginIcon, PersonAdd } from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <School sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ITAS Tax Education System
          </Typography>
          <Button color="inherit" startIcon={<LoginIcon />} onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button color="inherit" startIcon={<PersonAdd />} onClick={() => navigate('/register')}>
            Register
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to ITAS Tax Education
          </Typography>
          <Typography variant="h5" paragraph>
            Learn about Ethiopian tax laws, regulations, and compliance requirements
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 2 }}
              onClick={() => navigate('/public/courses')}
            >
              Browse Courses
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          What We Offer
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <MenuBook sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Tax Courses
                </Typography>
                <Typography>
                  Comprehensive courses on Ethiopian tax laws, VAT, income tax, and more
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" onClick={() => navigate('/public/courses')}>
                  View Courses
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <VideoLibrary sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Learning Resources
                </Typography>
                <Typography>
                  Videos, documents, and guides to help you understand tax compliance
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" onClick={() => navigate('/public/resources')}>
                  View Resources
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <School sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Get Certified
                </Typography>
                <Typography>
                  Complete courses and assessments to earn certificates of completion
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" onClick={() => navigate('/register')}>
                  Sign Up Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Ready to Start Learning?
          </Typography>
          <Typography variant="body1" paragraph>
            Create a free account to enroll in courses, track your progress, and earn certificates
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/register')}
          >
            Register Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 3, mt: 'auto' }}>
        <Container>
          <Typography variant="body2" align="center">
            © 2026 ITAS Tax Education System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
