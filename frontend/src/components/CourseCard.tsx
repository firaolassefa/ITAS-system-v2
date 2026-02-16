import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  LinearProgress,
} from '@mui/material';
import { Schedule, Book, ArrowForward } from '@mui/icons-material';

interface CourseCardProps {
  course: any;
  onEnroll: () => void;
  isEnrolled?: boolean;
  progress?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  isEnrolled = false,
  progress = 0,
}) => {
  // Add null checks to prevent errors
  if (!course) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography variant="h6">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Chip label={course.category || 'General'} color="primary" size="small" />
          <Chip label={course.difficulty || 'Beginner'} color="secondary" size="small" />
        </Box>
        
        <Typography variant="h6" gutterBottom>
          {course.title || 'Untitled Course'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {course.description || 'No description available'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Schedule fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">{course.durationHours || 0}h</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Book fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">{course.modules?.length || 0} modules</Typography>
          </Box>
        </Box>
        
        {isEnrolled && progress > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2">{Math.round(progress)}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        {isEnrolled ? (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
          >
            {progress === 100 ? 'Review' : 'Continue'}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={onEnroll}
            disabled={!course.published}
          >
            {course.published ? 'Enroll Now' : 'Coming Soon'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CourseCard;
