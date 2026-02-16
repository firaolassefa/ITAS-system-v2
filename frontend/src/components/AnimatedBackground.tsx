import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const AnimatedBackground: React.FC = () => {
  const theme = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      {/* Gradient Orbs */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `conic-gradient(from 0deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20, ${theme.palette.primary.main}20)`,
          filter: 'blur(80px)',
        }}
      />

      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 0.8, 1.1, 1],
          x: [0, -80, 60, 0],
          y: [0, 80, -40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `conic-gradient(from 180deg, ${theme.palette.secondary.main}15, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          filter: 'blur(100px)',
        }}
      />

      <motion.div
        animate={{
          rotate: [0, -360],
          scale: [1, 1.3, 0.9, 1],
          x: [0, 120, -80, 0],
          y: [0, -60, 90, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10, transparent)`,
          filter: 'blur(60px)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.8, 0.4, 0],
            scale: [0, 1, 1.2, 1, 0],
            x: [0, 50, -30, 40, 0],
            y: [0, -40, 30, -20, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}60, ${theme.palette.secondary.main}60)`,
          }}
        />
      ))}

      {/* Mesh Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}15 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}15 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${theme.palette.primary.main}10 0%, transparent 50%)
          `,
        }}
      />
    </Box>
  );
};

export default AnimatedBackground;