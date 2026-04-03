import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, LinearProgress,
  Chip, Paper, CircularProgress, Alert, alpha, Stack,
} from '@mui/material';
import { CheckCircle, Lock, PlayArrow, EmojiEvents, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';

const BLUE = '#339af0';
const GOLD = '#f59e0b';

const StaffProgress: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

  useEffect(() => { loadProgress(); }, []);

  const loadProgress = async () => {
    try {
      const r = await apiClient.get(`/courses/enrollments/${user.id}`);
      setEnrollments(r.data.data || r.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalCourses = enrollments.length;
  const completed = enrollments.filter(e => e.progress >= 100).length;
  const inProgress = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
  const avgProgress = totalCourses > 0
    ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / totalCourses)
    : 0;

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress sx={{ color: BLUE }} />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: BLUE }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>My Progress</Typography>
      </Box>

      {/* Summary stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Enrolled', value: totalCourses, icon: <TrendingUp />, color: BLUE },
          { label: 'Completed', value: completed, icon: <CheckCircle />, color: '#10b981' },
          { label: 'In Progress', value: inProgress, icon: <PlayArrow />, color: GOLD },
          { label: 'Avg Progress', value: `${avgProgress}%`, icon: <EmojiEvents />, color: '#8b5cf6' },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper sx={{ p: 2.5, borderRadius: 2, textAlign: 'center',
              border: `1px solid ${alpha(s.color, 0.2)}`, bgcolor: alpha(s.color, 0.04) }}>
              <Box sx={{ color: s.color, mb: 1 }}>{s.icon}</Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Course list */}
      {enrollments.length === 0 ? (
        <Alert severity="info">You are not enrolled in any courses yet.</Alert>
      ) : (
        <Grid container spacing={2}>
          {enrollments.map((enrollment: any) => {
            const progress = Math.round(enrollment.progress || 0);
            const done = progress >= 100;
            const color = done ? '#10b981' : progress > 0 ? BLUE : '#9ca3af';
            return (
              <Grid item xs={12} md={6} key={enrollment.id}>
                <Card elevation={0} sx={{ border: `1px solid ${alpha(color, 0.2)}`,
                  borderLeft: `4px solid ${color}`, borderRadius: 2,
                  transition: 'all 0.2s', cursor: 'pointer',
                  '&:hover': { boxShadow: `0 4px 16px ${alpha(color, 0.15)}` } }}
                  onClick={() => navigate(`/staff/courses/${enrollment.courseId || enrollment.course?.id}`)}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {enrollment.courseTitle || enrollment.course?.title || 'Course'}
                      </Typography>
                      <Chip label={done ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                        size="small"
                        sx={{ fontWeight: 700, fontSize: '0.7rem',
                          bgcolor: alpha(color, 0.12), color: color }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">Progress</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color }}>{progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={progress}
                      sx={{ height: 8, borderRadius: 4, bgcolor: alpha(color, 0.1),
                        '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 } }} />
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

export default StaffProgress;
