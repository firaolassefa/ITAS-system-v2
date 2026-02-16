import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <Box sx={{ p: 4 }}>
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e3f2fd 100%)',
          animation: 'fadeIn 0.5s ease-in',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <ConstructionIcon 
          sx={{ 
            fontSize: 80, 
            color: 'primary.main', 
            mb: 2,
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
            },
          }} 
        />
        
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
          {title}
        </Typography>
        
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            {description}
          </Typography>
        )}
        
        <Button
          variant="contained"
          size="large"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Paper>
    </Box>
  );
};

export default PlaceholderPage;