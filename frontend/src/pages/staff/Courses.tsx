import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip,
  LinearProgress, TextField, InputAdornment, CircularProgress,
  Alert, alpha, Paper,
} from '@mui/material';
import { Search, PlayArrow, CheckCircle, School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';

const BLUE = '#339af0';

const StaffCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [coursesRes, enrollRes] = await Promise.all([
        apiClient.get('/courses'),
        apiClient.get(`/courses/enrollments/${user.id}`).catch(() => ({ data: { data: [] } })),
      ]);
      setCourses(coursesRes.data.data || coursesRes.data || []);
      setEnrollments(enrollRes.data.data || enrollRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getEnrollment = (courseId: number) =>
    enrollments.find((e: any) => e.courseId === courseId || e.course?.id === courseId);

  const handleEnroll = async (courseId: number) => {
    try {
      await apiClient.post('/courses/enroll', { userId: user.id, courseId });
      await loadData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to enroll');
    }
  };

  const filtered = courses.filter(c =>
    !search || c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress sx={{ color: BLUE }} />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: BLUE }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>All Courses</Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3, border: `1px solid ${alpha(BLUE, 0.15)}`, borderRadius: 2 }}>
        <TextField fullWidth size="small" placeholder="Search courses..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
      </Paper>

      {filtered.length === 0 ? (
        <Alert severity="info">No courses found.</Alert>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((course: any) => {
            const enrollment = getEnrollment(course.id);
            const progress = Math.round(enrollment?.progress || 0);
            const enrolled = !!enrollment;
            const done = progress >= 100;
            return (
              <Grid item xs={12} md={6} lg={4} key={course.id}>
                <Card elevation={0} sx={{ height: '100%', border: `1px solid ${alpha(BLUE, 0.15)}`,
                  borderRadius: 2, transition: 'all 0.2s',
                  '&:hover': { boxShadow: `0 4px 20px ${alpha(BLUE, 0.15)}`, borderColor: alpha(BLUE, 0.4) } }}>
                  <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Chip label={course.category || 'General'} size="small"
                        sx={{ bgcolor: alpha(BLUE, 0.1), color: BLUE, fontWeight: 600, fontSize: '0.7rem' }} />
                      {done && <Chip icon={<CheckCircle />} label="Completed" size="small"
                        sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981', fontWeight: 600, fontSize: '0.7rem' }} />}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {course.description || 'No description available.'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {course.difficulty && (
                        <Chip label={course.difficulty} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                      )}
                      {course.durationHours && (
                        <Chip label={`${course.durationHours}h`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                      )}
                    </Box>
                    {enrolled && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">Progress</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: BLUE }}>{progress}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progress}
                          sx={{ height: 6, borderRadius: 3, bgcolor: alpha(BLUE, 0.1),
                            '& .MuiLinearProgress-bar': { bgcolor: BLUE } }} />
                      </Box>
                    )}
                    {enrolled ? (
                      <Button variant="contained" fullWidth startIcon={<PlayArrow />}
                        onClick={() => navigate(`/staff/courses/${course.id}`)}
                        sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' }, fontWeight: 700 }}>
                        {done ? 'Review Course' : 'Continue'}
                      </Button>
                    ) : (
                      <Button variant="outlined" fullWidth startIcon={<School />}
                        onClick={() => handleEnroll(course.id)}
                        sx={{ borderColor: BLUE, color: BLUE, fontWeight: 700 }}>
                        Enroll Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default StaffCourses;
