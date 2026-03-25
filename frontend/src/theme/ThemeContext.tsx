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
                // Light Mode
                primary: {
                  main: '#339af0',
                  light: '#339af0',
                  dark: '#1c7ed6',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#f59e0b',
                  light: '#fbbf24',
                  dark: '#d97706',
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
                // Dark Mode
                primary: {
                  main: '#339af0',
                  light: '#38bdf8',
                  dark: '#339af0',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#fbbf24',
                  light: '#fcd34d',
                  dark: '#f59e0b',
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
                  ? 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)'
                  : 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)',
                '&:hover': {
                  background: mode === 'light'
                    ? 'linear-gradient(135deg, #1c7ed6 0%, #339af0 100%)'
                    : 'linear-gradient(135deg, #1c7ed6 0%, #339af0 100%)',
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


