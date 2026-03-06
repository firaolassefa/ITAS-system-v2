import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('itas_theme_mode');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('itas_theme_mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light Mode - Professional Government Colors
                primary: {
                  main: '#1e3a8a', // Navy Blue
                  light: '#3b82f6',
                  dark: '#1e40af',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#d97706', // Gold/Amber
                  light: '#f59e0b',
                  dark: '#b45309',
                  contrastText: '#ffffff',
                },
                background: {
                  default: '#f8fafc',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#1e293b',
                  secondary: '#64748b',
                },
              }
            : {
                // Dark Mode - Professional Dark Theme
                primary: {
                  main: '#3b82f6', // Bright Blue
                  light: '#60a5fa',
                  dark: '#2563eb',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#f59e0b', // Gold
                  light: '#fbbf24',
                  dark: '#d97706',
                  contrastText: '#000000',
                },
                background: {
                  default: '#0f172a', // Dark Navy
                  paper: '#1e293b',
                },
                text: {
                  primary: '#f1f5f9',
                  secondary: '#cbd5e1',
                },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 800,
            letterSpacing: '-0.02em',
          },
          h2: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
          },
          h3: {
            fontWeight: 700,
          },
          h4: {
            fontWeight: 700,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                padding: '10px 24px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
              },
              contained: {
                background: mode === 'light' 
                  ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                '&:hover': {
                  background: mode === 'light'
                    ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
                    : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'light'
                  ? '0 1px 3px rgba(0, 0, 0, 0.05)'
                  : '0 1px 3px rgba(0, 0, 0, 0.3)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
