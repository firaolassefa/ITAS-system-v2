import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, AppBar, Toolbar, alpha, Chip, Paper, IconButton, Tooltip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  School, MenuBook, VideoLibrary, PersonAdd, Login, TrendingUp, People,
  Security, Analytics, Notifications, ArrowForward, PlayArrow, CheckCircle,
  Brightness4, Brightness7, AutoAwesome, Rocket, EmojiEvents, Speed,
  CloudDone, VerifiedUser, Assessment,
} from '@mui/icons-material';

const FuturisticHome: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setStatsVisible(true), 800);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const bgColor = darkMode ? '#0A0F1E' : '#F8FAFC';
  const textPrimary = darkMode ? '#F8FAFC' : '#0A0F1E';
  const textSecondary = darkMode ? alpha('#F8FAFC', 0.7) : '#64748B';
  const cardBg = darkMode ? alpha('#1a1f3a', 0.5) : '#FFFFFF';
  const accentColor = '#00E0FF';

  const features = [
    {
      icon: <School sx={{ fontSize: 48 }} />,
      title: 'Smart Learning',
      description: 'AI-powered course recommendations',
      color: accentColor,
      gradient: 'linear-gradient(135deg, #00E0FF 0%, #0099CC 100%)',
    },
    {
      icon: <Analytics sx={{ fontSize: 48 }} />,
      title: 'Real-Time Analytics',
      description: 'Track performance instantly',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Secure Platform',
      description: 'Enterprise-grade security',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
    {
      icon: <Speed sx={{ fontSize: 48 }} />,
      title: 'Lightning Fast',
      description: 'Optimized performance',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
    {
      icon: <CloudDone sx={{ fontSize: 48 }} />,
      title: 'Cloud Sync',
      description: 'Access anywhere, anytime',
      color: '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 48 }} />,
      title: 'Certified',
      description: 'Industry-recognized certificates',
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: <People />, color: accentColor },
    { value: '95%', label: 'Success Rate', icon: <TrendingUp />, color: '#10B981' },
    { value: '50+', label: 'Courses', icon: <MenuBook />, color: '#8B5CF6' },
    { value: '24/7', label: 'Support', icon: <Assessment />, color: '#F59E0B' },
  ];

  const roles = [
    { name: 'Taxpayer', icon: '👤', desc: 'Learn & Grow', color: accentColor },
    { name: 'Content Admin', icon: '📚', desc: 'Manage Content', color: '#8B5CF6' },
    { name: 'Training Admin', icon: '🎓', desc: 'Schedule Training', color: '#10B981' },
    { name: 'Comm Officer', icon: '📢', desc: 'Send Updates', color: '#F59E0B' },
    { name: 'Manager', icon: '📊', desc: 'View Analytics', color: '#06B6D4' },
    { name: 'System Admin', icon: '⚙️', desc: 'Full Control', color: '#EF4444' },
  ];

  return (
    <Box sx={{ bgcolor: bgColor, minHeight: '100vh', position: 'relative', overflow: 'hidden', transition: 'background-color 0.5s' }}>
