import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// Theme
import { ThemeProvider } from './theme/ThemeContext';

// Layout Components (loaded eagerly — needed immediately)
import TaxpayerLayout from './components/TaxpayerLayout';
import AdminLayout from './components/AdminLayout';
import StaffLayout from './components/StaffLayout';

// Auth pages (loaded eagerly — first thing user sees)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// All other pages — lazy loaded (only downloaded when navigated to)
const ModernHome = lazy(() => import('./pages/public/ModernHome'));
const PublicCourses = lazy(() => import('./pages/public/Courses'));
const PublicResources = lazy(() => import('./pages/public/Resources'));

const TaxpayerDashboard = lazy(() => import('./pages/taxpayer/Dashboard'));
const TaxpayerCourses = lazy(() => import('./pages/taxpayer/Courses'));
const CourseDetail = lazy(() => import('./pages/taxpayer/CourseDetail'));
const ModuleLesson = lazy(() => import('./pages/taxpayer/ModuleLesson'));
const TaxpayerResources = lazy(() => import('./pages/taxpayer/Resources'));
const TaxpayerCertificates = lazy(() => import('./pages/taxpayer/Certificates'));
const PracticeQuestions = lazy(() => import('./pages/taxpayer/PracticeQuestions'));
const ModuleQuiz = lazy(() => import('./pages/taxpayer/ModuleQuiz'));
const FinalExam = lazy(() => import('./pages/taxpayer/FinalExam'));
const TakeAssessment = lazy(() => import('./pages/taxpayer/TakeAssessment'));
const PracticeQuiz = lazy(() => import('./pages/taxpayer/PracticeQuiz'));

const SystemAdminDashboard = lazy(() => import('./pages/admin/SystemAdminDashboard'));
const ContentAdminDashboard = lazy(() => import('./pages/admin/ContentAdminDashboard'));
const TrainingAdminDashboard = lazy(() => import('./pages/admin/TrainingAdminDashboard'));
const CommOfficerDashboard = lazy(() => import('./pages/admin/CommOfficerDashboard'));
const ManagerDashboard = lazy(() => import('./pages/admin/ManagerDashboard'));
const AuditorDashboard = lazy(() => import('./pages/admin/AuditorDashboard'));
const UploadResource = lazy(() => import('./pages/admin/UploadResource'));
const ResourceManagement = lazy(() => import('./pages/admin/ResourceManagement'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const ResourceVersion = lazy(() => import('./pages/admin/ResourceVersion'));
const WebinarManagement = lazy(() => import('./pages/admin/WebinarManagement'));
const NotificationCenter = lazy(() => import('./pages/admin/NotificationCenter'));
const UserRoleManagement = lazy(() => import('./pages/admin/UserRoleManagement'));
const CourseManagement = lazy(() => import('./pages/admin/CourseManagement'));
const ResourceUpload = lazy(() => import('./pages/admin/ResourceUpload'));
const QuestionManagement = lazy(() => import('./pages/admin/QuestionManagement'));
const AssessmentManagement = lazy(() => import('./pages/admin/AssessmentManagement'));
const CertificateManagement = lazy(() => import('./pages/admin/CertificateManagement'));
const ModuleContentManager = lazy(() => import('./pages/admin/ModuleContentManager'));

const Profile = lazy(() => import('./pages/Profile'));
const MORStaffDashboard = lazy(() => import('./pages/staff/Dashboard'));
const InternalTraining = lazy(() => import('./pages/staff/InternalTraining'));
const StaffCertificates = lazy(() => import('./pages/staff/Certificates'));
const StaffCompliance = lazy(() => import('./pages/staff/Compliance'));
const StaffAssessments = lazy(() => import('./pages/staff/Assessments'));
const PlaceholderPage = lazy(() => import('./components/PlaceholderPage'));

// Loading fallback
const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress sx={{ color: '#339af0' }} />
  </Box>
);

function App() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('itas_user');
    const token = localStorage.getItem('itas_token');
    
    // If user exists but no token, clear user data
    if (saved && !token) {
      localStorage.removeItem('itas_user');
      return null;
    }
    
    // If token exists but no user, clear token
    if (token && !saved) {
      localStorage.removeItem('itas_token');
      return null;
    }
    
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData: any, token: string) => {
    console.log('🟢 handleLogin called');
    console.log('   User data:', userData);
    console.log('   Token:', token?.substring(0, 20) + '...');
    
    localStorage.setItem('itas_user', JSON.stringify(userData));
    localStorage.setItem('itas_token', token);
    setUser(userData);
    
    console.log('   ✅ User and token saved to localStorage');
    console.log('   ✅ User state updated');
  };

  const handleLogout = () => {
    localStorage.removeItem('itas_user');
    localStorage.removeItem('itas_token');
    setUser(null);
  };

  // Get dashboard based on user role - 8 Role System
  const getDashboardRoute = (userType: string) => {
    switch(userType) {
      case 'TAX_AGENT':
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
    <ThemeProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
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
            <ProtectedRoute allowedRoles={['TAX_AGENT', 'TAXPAYER']}>
              <TaxpayerLayout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<TaxpayerDashboard user={user} />} />
            <Route path="courses" element={<TaxpayerCourses user={user} />} />
            <Route path="course/:id" element={<CourseDetail />} />
            <Route path="courses/:courseId/modules/:moduleId/lesson" element={<ModuleLesson />} />
            <Route path="courses/:courseId/modules/:moduleId/practice" element={<PracticeQuestions />} />
            <Route path="courses/:courseId/modules/:moduleId/quiz" element={<ModuleQuiz />} />
            <Route path="module/:moduleId/practice" element={<PracticeQuestions />} />
            <Route path="module/:moduleId/practice-quiz" element={<PracticeQuiz />} />
            <Route path="module/:moduleId/quiz" element={<ModuleQuiz />} />
            <Route path="course/:courseId/final-exam" element={<FinalExam />} />
            <Route path="courses/:courseId/final-exam" element={<FinalExam />} />
            <Route path="assessment/:assessmentId" element={<TakeAssessment />} />
            <Route path="resources" element={<TaxpayerResources user={user} />} />
            <Route path="certificates" element={<TaxpayerCertificates />} />
          </Route>

          {/* MOR Staff Routes */}
          <Route path="/staff" element={
            <StaffRoute>
              <StaffLayout />
            </StaffRoute>
          }>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<MORStaffDashboard user={user} />} />
            <Route path="training" element={<InternalTraining />} />
            <Route path="internal-training" element={<InternalTraining />} />
            <Route path="courses" element={<TaxpayerCourses user={user} />} />
            <Route path="course/:id" element={<CourseDetail />} />
            <Route path="courses/:courseId" element={<CourseDetail />} />
            <Route path="courses/:courseId/modules/:moduleId/lesson" element={<ModuleLesson />} />
            <Route path="courses/:courseId/modules/:moduleId/practice" element={<PracticeQuestions />} />
            <Route path="courses/:courseId/modules/:moduleId/quiz" element={<ModuleQuiz />} />
            <Route path="module/:moduleId/practice" element={<PracticeQuestions />} />
            <Route path="module/:moduleId/practice-quiz" element={<PracticeQuiz />} />
            <Route path="module/:moduleId/quiz" element={<ModuleQuiz />} />
            <Route path="course/:courseId/final-exam" element={<FinalExam />} />
            <Route path="courses/:courseId/final-exam" element={<FinalExam />} />
            <Route path="assessment/:assessmentId" element={<TakeAssessment />} />
            <Route path="progress" element={<PlaceholderPage title="My Progress" />} />
            <Route path="assessments" element={<StaffAssessments />} />
            <Route path="certificates" element={<StaffCertificates />} />
            <Route path="compliance" element={<StaffCompliance />} />
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
            <Route path="resource-management" element={
              <ProtectedRoute allowedRoles={['CONTENT_ADMIN', 'SYSTEM_ADMIN']}>
                <ResourceManagement />
              </ProtectedRoute>
            } />
            <Route path="resource-version" element={
              <ProtectedRoute allowedRoles={['CONTENT_ADMIN', 'SYSTEM_ADMIN']}>
                <ResourceVersion />
              </ProtectedRoute>
            } />
            <Route path="course-management" element={
              <ProtectedRoute allowedRoles={['CONTENT_ADMIN', 'SYSTEM_ADMIN']}>
                <CourseManagement />
              </ProtectedRoute>
            } />
            <Route path="resource-upload" element={
              <ProtectedRoute allowedRoles={['CONTENT_ADMIN', 'SYSTEM_ADMIN']}>
                <ResourceUpload />
              </ProtectedRoute>
            } />
            <Route path="question-management" element={
              <ProtectedRoute allowedRoles={['CONTENT_ADMIN', 'TRAINING_ADMIN', 'SYSTEM_ADMIN']}>
                <QuestionManagement />
              </ProtectedRoute>
            } />
            <Route path="assessment-management" element={
              <ProtectedRoute allowedRoles={['CONTENT_ADMIN', 'TRAINING_ADMIN', 'SYSTEM_ADMIN']}>
                <AssessmentManagement />
              </ProtectedRoute>
            } />
            <Route path="certificate-management" element={
              <ProtectedRoute allowedRoles={['SYSTEM_ADMIN', 'AUDITOR', 'MANAGER']}>
                <CertificateManagement />
              </ProtectedRoute>
            } />
            <Route path="module-content" element={
              <ProtectedRoute allowedRoles={['CONTENT_ADMIN', 'SYSTEM_ADMIN']}>
                <ModuleContentManager />
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
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;

