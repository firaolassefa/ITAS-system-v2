import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
      success: string;
      info: string;
    };
  }

  interface PaletteOptions {
    gradient?: {
      primary?: string;
      secondary?: string;
      success?: string;
      info?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB', // Electric Blue
      light: '#60A5FA',
      dark: '#1E40AF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8B5CF6', // Soft Purple
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981', // Modern green
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B', // Vibrant orange
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444', // Modern red
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#22D3EE', // Neon Cyan
      light: '#67E8F9',
      dark: '#06B6D4',
    },
    background: {
      default: '#0B1220', // Deep Navy
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #2563EB 0%, #8B5CF6 50%, #22D3EE 100%)',
      secondary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #22D3EE 100%)',
      info: 'linear-gradient(135deg, #22D3EE 0%, #2563EB 100%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.06)',
    '0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.08)',
    '0 8px 16px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.1)',
    '0 12px 24px rgba(0,0,0,0.08), 0 6px 12px rgba(0,0,0,0.12)',
    '0 16px 32px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.14)',
    '0 20px 40px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.16)',
    '0 24px 48px rgba(0,0,0,0.14), 0 12px 24px rgba(0,0,0,0.18)',
    '0 28px 56px rgba(0,0,0,0.16), 0 14px 28px rgba(0,0,0,0.2)',
    '0 32px 64px rgba(0,0,0,0.18), 0 16px 32px rgba(0,0,0,0.22)',
    '0 36px 72px rgba(0,0,0,0.2), 0 18px 36px rgba(0,0,0,0.24)',
    '0 40px 80px rgba(0,0,0,0.22), 0 20px 40px rgba(0,0,0,0.26)',
    '0 44px 88px rgba(0,0,0,0.24), 0 22px 44px rgba(0,0,0,0.28)',
    '0 48px 96px rgba(0,0,0,0.26), 0 24px 48px rgba(0,0,0,0.3)',
    '0 52px 104px rgba(0,0,0,0.28), 0 26px 52px rgba(0,0,0,0.32)',
    '0 56px 112px rgba(0,0,0,0.3), 0 28px 56px rgba(0,0,0,0.34)',
    '0 60px 120px rgba(0,0,0,0.32), 0 30px 60px rgba(0,0,0,0.36)',
    '0 64px 128px rgba(0,0,0,0.34), 0 32px 64px rgba(0,0,0,0.38)',
    '0 68px 136px rgba(0,0,0,0.36), 0 34px 68px rgba(0,0,0,0.4)',
    '0 72px 144px rgba(0,0,0,0.38), 0 36px 72px rgba(0,0,0,0.42)',
    '0 76px 152px rgba(0,0,0,0.4), 0 38px 76px rgba(0,0,0,0.44)',
    '0 80px 160px rgba(0,0,0,0.42), 0 40px 80px rgba(0,0,0,0.46)',
    '0 84px 168px rgba(0,0,0,0.44), 0 42px 84px rgba(0,0,0,0.48)',
    '0 88px 176px rgba(0,0,0,0.46), 0 44px 88px rgba(0,0,0,0.5)',
    '0 92px 184px rgba(0,0,0,0.48), 0 46px 92px rgba(0,0,0,0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 32px',
          fontSize: '0.95rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
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
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(37, 99, 235, 0.3)',
            '&::before': {
              left: '100%',
            },
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
            boxShadow: '0 16px 48px rgba(37, 99, 235, 0.5)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: 'rgba(37, 99, 235, 0.5)',
          '&:hover': {
            borderWidth: 2,
            borderColor: '#2563EB',
            background: 'rgba(37, 99, 235, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 60px rgba(37, 99, 235, 0.3)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 2,
            },
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              transform: 'translateY(-2px)',
              '& fieldset': {
                borderColor: 'rgba(37, 99, 235, 0.5)',
              },
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 32px rgba(37, 99, 235, 0.2)',
              '& fieldset': {
                borderColor: '#2563EB',
                borderWidth: 2,
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#94A3B8',
            '&.Mui-focused': {
              color: '#2563EB',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#F8FAFC',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
});