import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import { PlayArrow, School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

interface ContinueLearningProps {
  userId: number;
}

const ContinueLearning: React.FC<ContinueLearningProps> = ({ userId }) => {
  const [inProgressCourses, setInProgressCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadInProgressCourses();
  }, [userId]);

  const loadInProgressCourses = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses/enrollments/${userId}`,
        getAuthHeaders()
      );
      const enrollments = response.data.data || response.data || [];
      
      // Filter courses that are in progress (not completed)
      const inProgress = enrollments.filter(
        (enrollment: any) => enrollment.progress > 0 && enrollment.progress < 100
      );
      
      // Sort by most recently accessed (you can add lastAccessedAt field later)
      setInProgressCourses(inProgress.slice(0, 3)); // Show top 3
    } catch (error) {
      console.error('Failed to load in-progress courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || inProgressCourses.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PlayArrow color="primary" />
        Continue Learning
      </Typography>
      
      <Grid container spacing={2}>
        {inProgressCourses.map((enrollment) => (
          <Grid item xs={12} md={4} key={enrollment.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
              onClick={() => navigate(`/taxpayer/course/${enrollment.course.id}`)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 2 }}>
                  <School color="primary" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {enrollment.course.title}
                    </Typography>
                    <Chip 
                      label={enrollment.course.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {Math.round(enrollment.progress)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={enrollment.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/taxpayer/course/${enrollment.course.id}`);
                  }}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ContinueLearning;
