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
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        borderTop: '3px solid #667eea',
        borderRadius: '16px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1 }}>
          <Chip 
            label={course.category} 
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: '8px',
            }}
          />
          <Chip 
            label={course.difficulty} 
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: '8px',
            }}
          />
        </Box>
        
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
          }}
        >
          {course.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
          sx={{ mb: 3 }}
        >
          {course.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Schedule fontSize="small" sx={{ color: '#667eea' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {course.durationHours}h
            </Typography>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Book fontSize="small" sx={{ color: '#667eea' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {course.modules.length} modules
            </Typography>
          </Box>
        </Box>
        
        {isEnrolled && progress > 0 && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Progress
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 700,
                  color: '#667eea',
                }}
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                background: 'rgba(102, 126, 234, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ p: 3, pt: 0 }}>
        {isEnrolled ? (
          <Button
            fullWidth
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            {progress === 100 ? 'Review Course' : 'Continue Learning'}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={onEnroll}
            disabled={!course.published}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              background: course.published 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'rgba(0, 0, 0, 0.12)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: course.published
                  ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                  : 'rgba(0, 0, 0, 0.12)',
                transform: course.published ? 'translateY(-2px)' : 'none',
                boxShadow: course.published ? '0 8px 25px rgba(102, 126, 234, 0.4)' : 'none',
              },
              '&.Mui-disabled': {
                color: 'rgba(0, 0, 0, 0.26)',
              },
            }}
          >
            {course.published ? 'Enroll Now' : 'Coming Soon'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CourseCard;
