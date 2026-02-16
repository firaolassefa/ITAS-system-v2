import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Chip,
  Paper,
  SelectChangeEvent,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../api/courses';
import { COURSE_CATEGORIES } from '../../utils/constants';

const PublicCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await coursesAPI.getAllCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || course.category === categoryFilter;
    const matchesDifficulty = !difficultyFilter || course.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading courses...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom>
            Browse Courses
          </Typography>
          <Typography variant="h6">
            Explore our tax education courses. Sign up to enroll and track your progress.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          You're browsing as a guest. <Button color="primary" onClick={() => navigate('/login')}>Sign in</Button> to enroll in courses and track your progress.
        </Alert>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search courses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e: SelectChangeEvent) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {COURSE_CATEGORIES.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficultyFilter}
                  label="Difficulty"
                  onChange={(e: SelectChangeEvent) => setDifficultyFilter(e.target.value)}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="BEGINNER">Beginner</MenuItem>
                  <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                  <MenuItem value="ADVANCED">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setDifficultyFilter('');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results */}
        {filteredCourses.length === 0 ? (
          <Alert severity="info">
            No courses found matching your criteria. Try adjusting your filters.
          </Alert>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {filteredCourses.length} courses available
            </Typography>
            
            <Grid container spacing={3}>
              {filteredCourses.map((course) => (
                <Grid item xs={12} md={6} lg={4} key={course.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={course.category} size="small" color="primary" />
                        <Chip label={course.difficulty} size="small" variant="outlined" />
                        <Chip label={`${course.duration} hours`} size="small" />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<LoginIcon />}
                        onClick={() => navigate('/login')}
                      >
                        Sign in to Enroll
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default PublicCourses;
