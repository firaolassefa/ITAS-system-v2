import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 60 
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          gap: 3,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <CircularProgress
              size={size}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
          </motion.div>
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <CircularProgress
              size={size}
              thickness={2}
              variant="determinate"
              value={25}
              sx={{
                color: theme.palette.secondary.main,
                opacity: 0.3,
              }}
            />
          </motion.div>
        </Box>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            {message}
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default LoadingSpinner;