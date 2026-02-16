import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  fullScreen = false,
  size = 40,
}) => {
  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;