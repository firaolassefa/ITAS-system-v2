import { Button, ButtonProps, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface InteractiveButtonProps extends ButtonProps {
  children: React.ReactNode;
  glowColor?: string;
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({ 
  children, 
  glowColor,
  sx,
  ...props 
}) => {
  const theme = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const glow = glowColor || theme.palette.primary.main;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onTapStart={() => setIsPressed(true)}
      onTapCancel={() => setIsPressed(false)}
      onTap={() => setIsPressed(false)}
    >
      <Button
        {...props}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transition: 'left 0.6s',
          },
          '&:hover': {
            boxShadow: `0 8px 25px ${alpha(glow, 0.4)}`,
            transform: 'translateY(-2px)',
            '&::before': {
              left: '100%',
            },
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          ...sx,
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default InteractiveButton;