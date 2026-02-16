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
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../api/courses';
import CourseCard from '../../components/taxpayer/CourseCard';
import { COURSE_CATEGORIES } from '../../utils/constants';

interface CoursesProps {
  user: any;
}

const Courses: React.FC<CoursesProps> = ({ user }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        coursesAPI.getAllCourses(),
        coursesAPI.getUserEnrollments(user.id),
      ]);
      setCourses(coursesRes.data || []);
      setEnrollments(enrollmentsRes.data || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
    try {
      await coursesAPI.enroll(user.id, courseId);
      await loadCourses(); // Reload data
      navigate(`/taxpayer/course/${courseId}`);
    } catch (error) {
      console.error('Failed to enroll:', error);
    }
  };

  const isEnrolled = (courseId: number) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  const getProgress = (courseId: number) => {
    const enrollment = enrollments.find(e => e.courseId === courseId);
    return enrollment ? enrollment.progress : 0;
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || course.category === categoryFilter;
    const matchesDifficulty = !difficultyFilter || course.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const enrolledCount = enrollments.length;
  const completedCount = enrollments.filter(e => e.status === 'COMPLETED').length;

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading courses...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header Section */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Course Catalog
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            mb: 3,
            fontWeight: 400,
          }}
        >
          Browse and enroll in tax education courses
        </Typography>
        
        {/* Stats Chips - Modern Futuristic */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderTop: '3px solid #667eea',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
              },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
              {enrolledCount}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Enrolled
            </Typography>
          </Box>
          
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderTop: '3px solid #10B981',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.3)',
              },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#10B981' }}>
              {completedCount}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Completed
            </Typography>
          </Box>
          
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderTop: '3px solid #F59E0B',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(245, 158, 11, 0.3)',
              },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#F59E0B' }}>
              {courses.length}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Available
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters - Glassmorphism */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search courses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: '#667eea' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                  },
                },
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
                sx={{
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                  },
                }}
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
                sx={{
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                  },
                }}
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
              sx={{
                borderRadius: '12px',
                borderColor: '#667eea',
                color: '#667eea',
                py: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#667eea',
                  background: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                },
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      {filteredCourses.length === 0 ? (
        <Alert 
          severity="info"
          sx={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
          }}
        >
          No courses found matching your criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {filteredCourses.length} courses found
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} md={6} lg={4} key={course.id}>
                <CourseCard
                  course={course}
                  onEnroll={() => handleEnroll(course.id)}
                  isEnrolled={isEnrolled(course.id)}
                  progress={getProgress(course.id)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Courses;
