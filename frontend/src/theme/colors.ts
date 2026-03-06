// ITAS Professional Color System
// Government/Tax Authority Theme

export const ITASColors = {
  // Primary - Navy Blue (Authority, Trust, Government)
  primary: {
    main: '#1e3a8a',
    light: '#3b82f6',
    dark: '#1e40af',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
  },
  
  // Secondary - Gold (Excellence, Achievement)
  secondary: {
    main: '#d97706',
    light: '#f59e0b',
    dark: '#b45309',
    gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  },
  
  // Accent Colors for Different Roles
  roles: {
    systemAdmin: {
      main: '#dc2626', // Red - High Authority
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    },
    contentAdmin: {
      main: '#d97706', // Gold - Content Creation
      gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    },
    trainingAdmin: {
      main: '#7c3aed', // Purple - Education
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    },
    commOfficer: {
      main: '#059669', // Green - Communication
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    },
    manager: {
      main: '#1e3a8a', // Navy - Management
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    },
    auditor: {
      main: '#7c3aed', // Purple - Audit
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    },
    taxpayer: {
      main: '#3b82f6', // Blue - User
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    staff: {
      main: '#059669', // Green - Staff
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    },
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
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
      SYSTEM_ADMIN: 'linear-gradient(180deg, #1e3a8a 0%, #dc2626 100%)',
      CONTENT_ADMIN: 'linear-gradient(180deg, #1e3a8a 0%, #d97706 100%)',
      TRAINING_ADMIN: 'linear-gradient(180deg, #1e3a8a 0%, #7c3aed 100%)',
      COMM_OFFICER: 'linear-gradient(180deg, #1e3a8a 0%, #059669 100%)',
      MANAGER: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
      AUDITOR: 'linear-gradient(180deg, #1e3a8a 0%, #7c3aed 100%)',
      TAXPAYER: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)',
      MOR_STAFF: 'linear-gradient(180deg, #1e3a8a 0%, #059669 100%)',
    },
    dark: {
      SYSTEM_ADMIN: 'linear-gradient(180deg, #1e293b 0%, #dc2626 100%)',
      CONTENT_ADMIN: 'linear-gradient(180deg, #1e293b 0%, #d97706 100%)',
      TRAINING_ADMIN: 'linear-gradient(180deg, #1e293b 0%, #7c3aed 100%)',
      COMM_OFFICER: 'linear-gradient(180deg, #1e293b 0%, #059669 100%)',
      MANAGER: 'linear-gradient(180deg, #1e293b 0%, #3b82f6 100%)',
      AUDITOR: 'linear-gradient(180deg, #1e293b 0%, #7c3aed 100%)',
      TAXPAYER: 'linear-gradient(180deg, #1e293b 0%, #3b82f6 100%)',
      MOR_STAFF: 'linear-gradient(180deg, #1e293b 0%, #059669 100%)',
    },
  };
  
  return gradients[mode][role as keyof typeof gradients.light] || gradients[mode].TAXPAYER;
};

// Navbar Gradient
export const getNavbarGradient = (mode: 'light' | 'dark') => {
  return mode === 'light'
    ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
    : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
};
