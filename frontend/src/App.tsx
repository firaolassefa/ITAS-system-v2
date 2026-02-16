import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public Pages
import ModernHome from './pages/public/ModernHome';
import PublicCourses from './pages/public/Courses';
import PublicResources from './pages/public/Resources';

// Taxpayer Pages
import TaxpayerDashboard from './pages/taxpayer/Dashboard';
import TaxpayerCourses from './pages/taxpayer/Courses';
import CourseDetail from './pages/taxpayer/CourseDetail';
import TaxpayerResources from './pages/taxpayer/Resources';

// Admin Pages - Different dashboards for each role
import SystemAdminDashboard from './pages/admin/SystemAdminDashboard';
import ContentAdminDashboard from './pages/admin/ContentAdminDashboard';
import TrainingAdminDashboard from './pages/admin/TrainingAdminDashboard';
import CommOfficerDashboard from './pages/admin/CommOfficerDashboard';
import ManagerDashboard from './pages/admin/ManagerDashboard';
import AuditorDashboard from './pages/admin/AuditorDashboard';

import UploadResource from './pages/admin/UploadResource';
import Analytics from './pages/admin/Analytics';
import ResourceVersion from './pages/admin/ResourceVersion';
import WebinarManagement from './pages/admin/WebinarManagement';
import NotificationCenter from './pages/admin/NotificationCenter';
import UserRoleManagement from './pages/admin/UserRoleManagement';

// Shared Pages
import Profile from './pages/Profile';

// Layout Components
import TaxpayerLayout from './components/TaxpayerLayout';
import AdminLayout from './components/AdminLayout';
import StaffLayout from './components/StaffLayout';

// Staff Pages
import MORStaffDashboard from './pages/staff/Dashboard';

// Shared Components
import PlaceholderPage from './components/PlaceholderPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('itas_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData: any, token: string) => {
    localStorage.setItem('itas_user', JSON.stringify(userData));
    localStorage.setItem('itas_token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('itas_user');
    localStorage.removeItem('itas_token');
    setUser(null);
  };

  // Get dashboard based on user role - 8 Role System
  const getDashboardRoute = (userType: string) => {
    switch(userType) {
      case 'TAXPAYER': return '/taxpayer/dashboard';
      case 'MOR_STAFF': return '/staff/dashboard';
      case 'CONTENT_ADMIN': return '/admin/content-dashboard';
      case 'TRAINING_ADMIN': return '/admin/training-dashboard';
      case 'COMM_OFFICER': return '/admin/comm-dashboard';
      case 'MANAGER': return '/admin/manager-dashboard';
      case 'SYSTEM_ADMIN': return '/admin/system-dashboard';
      case 'AUDITOR': return '/admin/auditor-dashboard';
      default: return '/';
    }
  };

  // Protected route wrapper
  const ProtectedRoute = ({ 
    children, 
    requiredRole,
    allowedRoles = []
  }: { 
    children: React.ReactNode;
    requiredRole?: string;
    allowedRoles?: string[];
  }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && user.userType !== requiredRole) {
      return <Navigate to="/unauthorized" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
      return <Navigate to="/unauthorized" />;
    }

    return <>{children}</>;
  };

  // Admin route wrapper - Updated for 8 roles
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const adminRoles = ['CONTENT_ADMIN', 'TRAINING_ADMIN', 'COMM_OFFICER', 'SYSTEM_ADMIN', 'MANAGER', 'AUDITOR'];
    
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (!adminRoles.includes(user.userType)) {
      return <Navigate to="/unauthorized" />;
    }

    return <>{children}</>;
  };

  // Staff route wrapper - New for MOR_STAFF
  const StaffRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user.userType !== 'MOR_STAFF') {
      return <Navigate to="/unauthorized" />;
    }

    return <>{children}</>;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ModernHome />} />
          <Route path="/public/courses" element={<PublicCourses />} />
          <Route path="/public/resources" element={<PublicResources />} />
          
          <Route path="/login" element={
            user ? <Navigate to={getDashboardRoute(user.userType)} /> :
            <Login onLogin={handleLogin} />
          } />
          
          <Route path="/register" element={
            user ? <Navigate to={getDashboardRoute(user.userType)} /> :
            <Register />
          } />

          {/* Taxpayer Routes */}
          <Route path="/taxpayer" element={
            <ProtectedRoute requiredRole="TAXPAYER">
              <TaxpayerLayout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<TaxpayerDashboard user={user} />} />
            <Route path="courses" element={<TaxpayerCourses user={user} />} />
            <Route path="course/:id" element={<CourseDetail />} />
            <Route path="resources" element={<TaxpayerResources user={user} />} />
          </Route>

          {/* MOR Staff Routes */}
          <Route path="/staff" element={
            <StaffRoute>
              <StaffLayout />
            </StaffRoute>
          }>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<MORStaffDashboard />} />
            <Route path="internal-training" element={<PlaceholderPage title="Internal Training" />} />
            <Route path="courses" element={<TaxpayerCourses user={user} />} />
            <Route path="progress" element={<PlaceholderPage title="My Progress" />} />
            <Route path="assessments" element={<PlaceholderPage title="Assessments" />} />
            <Route path="certificates" element={<PlaceholderPage title="Certificates" />} />
            <Route path="compliance" element={<PlaceholderPage title="Compliance" />} />
            <Route path="resources" element={<TaxpayerResources user={user} />} />
            <Route path="help" element={<PlaceholderPage title="Help & Support" />} />
          </Route>

          {/* Admin Routes with Role-Specific Dashboards */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout user={user} onLogout={handleLogout} />
            </AdminRoute>
          }>
            <Route index element={<Navigate to={user ? getDashboardRoute(user.userType).replace('/admin/', '') : 'system-dashboard'} />} />
            
            {/* Generic dashboard route that redirects to role-specific dashboard */}
            <Route path="dashboard" element={
              <Navigate to={user ? getDashboardRoute(user.userType) : '/admin/system-dashboard'} replace />
            } />
            
            {/* Role-Specific Dashboards */}
            <Route path="system-dashboard" element={
              <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                <SystemAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="content-dashboard" element={
              <ProtectedRoute allowedRoles={['CONTENT_ADMIN']}>
                <ContentAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="training-dashboard" element={
              <ProtectedRoute allowedRoles={['TRAINING_ADMIN']}>
                <TrainingAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="comm-dashboard" element={
              <ProtectedRoute allowedRoles={['COMM_OFFICER']}>
                <CommOfficerDashboard />
              </ProtectedRoute>
            } />
            <Route path="manager-dashboard" element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />
            <Route path="auditor-dashboard" element={
              <ProtectedRoute allowedRoles={['AUDITOR']}>
                <AuditorDashboard />
              </ProtectedRoute>
            } />
            
            {/* Content Management Routes */}
            <Route path="upload-resource" element={
              <ProtectedRoute allowedRoles={['CONTENT_ADMIN', 'SYSTEM_ADMIN']}>
                <UploadResource />
              </ProtectedRoute>
            } />
            <Route path="resource-version" element={
              <ProtectedRoute allowedRoles={['CONTENT_ADMIN', 'SYSTEM_ADMIN']}>
                <ResourceVersion />
              </ProtectedRoute>
            } />
            
            {/* Training Admin Routes */}
            <Route path="webinar-management" element={
              <ProtectedRoute allowedRoles={['TRAINING_ADMIN', 'SYSTEM_ADMIN']}>
                <WebinarManagement />
              </ProtectedRoute>
            } />
            
            {/* Communication Officer Routes */}
            <Route path="notification-center" element={
              <ProtectedRoute allowedRoles={['COMM_OFFICER', 'SYSTEM_ADMIN']}>
                <NotificationCenter />
              </ProtectedRoute>
            } />
            
            {/* System Admin Routes */}
            <Route path="user-role-management" element={
              <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                <UserRoleManagement />
              </ProtectedRoute>
            } />
            
            {/* Analytics Routes (Manager, Auditor, System Admin) */}
            <Route path="analytics" element={
              <ProtectedRoute allowedRoles={['MANAGER', 'AUDITOR', 'SYSTEM_ADMIN']}>
                <Analytics />
              </ProtectedRoute>
            } />
          </Route>

          {/* Shared Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile user={user} />
            </ProtectedRoute>
          } />

          {/* Additional Pages */}
          <Route path="/unauthorized" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>401 - Unauthorized</h1>
              <p>You don't have permission to access this page.</p>
              <button onClick={() => window.history.back()}>Go Back</button>
            </div>
          } />

          {/* Catch-all 404 Route */}
          <Route path="*" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <button onClick={() => window.location.href = '/'}>Go Home</button>
            </div>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
