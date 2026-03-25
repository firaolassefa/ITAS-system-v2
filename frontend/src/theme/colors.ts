// MOR Ethiopia Official Color System
// Based on Ethiopian National Flag Colors

export const ITASColors = {
  // Primary - MOR Blue
  primary: {
    main: '#339af0',      // MOR Blue
    light: '#339af0',
    dark: '#1c7ed6',
    gradient: 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)',
  },
  
  // Secondary - Ethiopian Yellow/Gold (from flag)
  secondary: {
    main: '#FCDD09',      // Ethiopian flag yellow
    light: '#FDE74C',
    dark: '#E8C307',
    gradient: 'linear-gradient(135deg, #FCDD09 0%, #E8C307 100%)',
  },
  
  // Accent - Ethiopian Red (from flag)
  accent: {
    main: '#DA121A',      // Ethiopian flag red
    light: '#E63946',
    dark: '#B01018',
    gradient: 'linear-gradient(135deg, #DA121A 0%, #B01018 100%)',
  },
  
  // National Emblem Colors
  emblem: {
    blue: '#1c7ed6',      // Blue disc from national emblem
    gold: '#FCDD09',      // Golden pentagram
  },
  
  // Accent Colors for Different Roles
  roles: {
    systemAdmin: {
      main: '#DA121A', // Ethiopian Red - High Authority
      gradient: 'linear-gradient(135deg, #DA121A 0%, #B01018 100%)',
    },
    contentAdmin: {
      main: '#FCDD09', // Ethiopian Yellow - Content Creation
      gradient: 'linear-gradient(135deg, #FCDD09 0%, #E8C307 100%)',
    },
    trainingAdmin: {
      main: '#339af0', // MOR Blue - Education
      gradient: 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)',
    },
    commOfficer: {
      main: '#339af0', // MOR Blue - Communication
      gradient: 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)',
    },
    manager: {
      main: '#339af0', // MOR Blue - Management
      gradient: 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)',
    },
    auditor: {
      main: '#DA121A', // Ethiopian Red - Audit
      gradient: 'linear-gradient(135deg, #DA121A 0%, #B01018 100%)',
    },
    taxpayer: {
      main: '#339af0', // MOR Blue - User
      gradient: 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)',
    },
    staff: {
      main: '#339af0', // MOR Blue - Staff
      gradient: 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)',
    },
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#339af0',
  },
  
  // Light Mode
  light: {
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
      elevated: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    border: '#e2e8f0',
    divider: '#e2e8f0',
  },
  
  // Dark Mode
  dark: {
    background: {
      default: '#0f172a',
      paper: '#1e293b',
      elevated: '#334155',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      disabled: '#64748b',
    },
    border: '#334155',
    divider: '#334155',
  },
};

// Sidebar Gradients by Role
export const getSidebarGradient = (role: string, mode: 'light' | 'dark') => {
  const gradients = {
    light: {
      SYSTEM_ADMIN: 'linear-gradient(180deg, #339af0 0%, #DA121A 100%)',
      CONTENT_ADMIN: 'linear-gradient(180deg, #339af0 0%, #FCDD09 100%)',
      TRAINING_ADMIN: 'linear-gradient(180deg, #339af0 0%, #1c7ed6 100%)',
      COMM_OFFICER: 'linear-gradient(180deg, #339af0 0%, #339af0 100%)',
      MANAGER: 'linear-gradient(180deg, #339af0 0%, #1c7ed6 100%)',
      AUDITOR: 'linear-gradient(180deg, #339af0 0%, #DA121A 100%)',
      TAXPAYER: 'linear-gradient(180deg, #339af0 0%, #339af0 100%)',
      MOR_STAFF: 'linear-gradient(180deg, #339af0 0%, #339af0 100%)',
    },
    dark: {
      SYSTEM_ADMIN: 'linear-gradient(180deg, #1e293b 0%, #DA121A 100%)',
      CONTENT_ADMIN: 'linear-gradient(180deg, #1e293b 0%, #FCDD09 100%)',
      TRAINING_ADMIN: 'linear-gradient(180deg, #1e293b 0%, #339af0 100%)',
      COMM_OFFICER: 'linear-gradient(180deg, #1e293b 0%, #339af0 100%)',
      MANAGER: 'linear-gradient(180deg, #1e293b 0%, #339af0 100%)',
      AUDITOR: 'linear-gradient(180deg, #1e293b 0%, #DA121A 100%)',
      TAXPAYER: 'linear-gradient(180deg, #1e293b 0%, #339af0 100%)',
      MOR_STAFF: 'linear-gradient(180deg, #1e293b 0%, #339af0 100%)',
    },
  };
  
  return gradients[mode][role as keyof typeof gradients.light] || gradients[mode].TAXPAYER;
};

// Navbar Gradient
export const getNavbarGradient = (mode: 'light' | 'dark') => {
  return mode === 'light'
    ? 'linear-gradient(135deg, #339af0 0%, #1c7ed6 100%)'
    : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
};


