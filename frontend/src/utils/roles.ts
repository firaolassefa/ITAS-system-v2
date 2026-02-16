// 8-Role System for ITAS Tax Education Platform
export const ROLES = {
  TAXPAYER: 'TAXPAYER',                 // External users accessing tax education
  MOR_STAFF: 'MOR_STAFF',               // Ministry of Revenue staff (internal users)
  CONTENT_ADMIN: 'CONTENT_ADMIN',       // Manages educational content and resources
  TRAINING_ADMIN: 'TRAINING_ADMIN',     // Manages courses and webinars
  COMM_OFFICER: 'COMM_OFFICER',         // Handles notifications and communications
  MANAGER: 'MANAGER',                   // Views analytics and reports (read-only)
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',         // Full system administration
  AUDITOR: 'AUDITOR',                   // System auditing and compliance
} as const;

export type UserRole = keyof typeof ROLES;

// Comprehensive permission definitions based on role requirements
export const PERMISSIONS = {
  // Authentication & Basic Access
  LOGIN_SSO: 'LOGIN_SSO',
  
  // Learning & Education (Taxpayer & MOR Staff)
  SEARCH_RESOURCES: 'SEARCH_RESOURCES',
  WATCH_VIDEOS: 'WATCH_VIDEOS',
  DOWNLOAD_RESOURCES: 'DOWNLOAD_RESOURCES',
  ENROLL_COURSES: 'ENROLL_COURSES',
  COMPLETE_MODULES: 'COMPLETE_MODULES',
  TAKE_QUIZZES: 'TAKE_QUIZZES',
  TRACK_PROGRESS: 'TRACK_PROGRESS',
  DOWNLOAD_CERTIFICATES: 'DOWNLOAD_CERTIFICATES',
  ACCESS_HELP: 'ACCESS_HELP',
  
  // Internal Staff Additional Access (MOR Staff)
  ACCESS_INTERNAL_TRAINING: 'ACCESS_INTERNAL_TRAINING',
  VIEW_STAFF_MATERIALS: 'VIEW_STAFF_MATERIALS',
  TRACK_COMPLIANCE: 'TRACK_COMPLIANCE',
  
  // Content Management (Content Admin)
  UPLOAD_CONTENT: 'UPLOAD_CONTENT',
  CREATE_RESOURCES: 'CREATE_RESOURCES',
  UPDATE_RESOURCES: 'UPDATE_RESOURCES',
  ARCHIVE_CONTENT: 'ARCHIVE_CONTENT',
  DELETE_CONTENT: 'DELETE_CONTENT',
  MANAGE_METADATA: 'MANAGE_METADATA',
  VERSION_CONTROL: 'VERSION_CONTROL',
  
  // Training Management (Training Admin)
  SCHEDULE_WEBINARS: 'SCHEDULE_WEBINARS',
  MANAGE_WEBINARS: 'MANAGE_WEBINARS',
  CREATE_COURSES: 'CREATE_COURSES',
  MANAGE_COURSES: 'MANAGE_COURSES',
  ADD_MODULES: 'ADD_MODULES',
  CREATE_QUIZZES: 'CREATE_QUIZZES',
  MONITOR_ENROLLMENT: 'MONITOR_ENROLLMENT',
  TRACK_ATTENDANCE: 'TRACK_ATTENDANCE',
  
  // Communication Management (Communication Officer)
  CREATE_CAMPAIGNS: 'CREATE_CAMPAIGNS',
  SEND_EMAIL: 'SEND_EMAIL',
  SEND_SMS: 'SEND_SMS',
  TARGET_AUDIENCE: 'TARGET_AUDIENCE',
  SCHEDULE_MESSAGES: 'SCHEDULE_MESSAGES',
  TRACK_DELIVERY: 'TRACK_DELIVERY',
  VIEW_CAMPAIGN_STATS: 'VIEW_CAMPAIGN_STATS',
  
  // Analytics & Reporting (Manager)
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',
  VIEW_USER_STATS: 'VIEW_USER_STATS',
  VIEW_COMPLETION_RATES: 'VIEW_COMPLETION_RATES',
  VIEW_SATISFACTION_SCORES: 'VIEW_SATISFACTION_SCORES',
  EXPORT_REPORTS: 'EXPORT_REPORTS',
  FILTER_REPORTS: 'FILTER_REPORTS',
  VIEW_TRENDS: 'VIEW_TRENDS',
  
  // System Administration (System Admin)
  MANAGE_USERS: 'MANAGE_USERS',
  ASSIGN_ROLES: 'ASSIGN_ROLES',
  CONTROL_ACCESS: 'CONTROL_ACCESS',
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE',
  MANAGE_SSO: 'MANAGE_SSO',
  ARCHIVE_OLD_CONTENT: 'ARCHIVE_OLD_CONTENT',
  MONITOR_LOGS: 'MONITOR_LOGS',
  SYNC_RECORDS: 'SYNC_RECORDS',
  
  // Auditing (Auditor)
  AUDIT_SYSTEM: 'AUDIT_SYSTEM',
  VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
  COMPLIANCE_MONITORING: 'COMPLIANCE_MONITORING',
  SECURITY_REVIEW: 'SECURITY_REVIEW',
  GENERATE_AUDIT_REPORTS: 'GENERATE_AUDIT_REPORTS',
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Role to permissions mapping based on 8-role requirements
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.TAXPAYER]: [
    PERMISSIONS.LOGIN_SSO,
    PERMISSIONS.SEARCH_RESOURCES,
    PERMISSIONS.WATCH_VIDEOS,
    PERMISSIONS.DOWNLOAD_RESOURCES,
    PERMISSIONS.ENROLL_COURSES,
    PERMISSIONS.COMPLETE_MODULES,
    PERMISSIONS.TAKE_QUIZZES,
    PERMISSIONS.TRACK_PROGRESS,
    PERMISSIONS.DOWNLOAD_CERTIFICATES,
    PERMISSIONS.ACCESS_HELP,
  ],
  
  [ROLES.MOR_STAFF]: [
    // All taxpayer permissions PLUS internal staff permissions
    PERMISSIONS.LOGIN_SSO,
    PERMISSIONS.SEARCH_RESOURCES,
    PERMISSIONS.WATCH_VIDEOS,
    PERMISSIONS.DOWNLOAD_RESOURCES,
    PERMISSIONS.ENROLL_COURSES,
    PERMISSIONS.COMPLETE_MODULES,
    PERMISSIONS.TAKE_QUIZZES,
    PERMISSIONS.TRACK_PROGRESS,
    PERMISSIONS.DOWNLOAD_CERTIFICATES,
    PERMISSIONS.ACCESS_HELP,
    PERMISSIONS.ACCESS_INTERNAL_TRAINING,
    PERMISSIONS.VIEW_STAFF_MATERIALS,
    PERMISSIONS.TRACK_COMPLIANCE,
  ],
  
  [ROLES.CONTENT_ADMIN]: [
    PERMISSIONS.LOGIN_SSO,
    PERMISSIONS.SEARCH_RESOURCES,
    PERMISSIONS.UPLOAD_CONTENT,
    PERMISSIONS.CREATE_RESOURCES,
    PERMISSIONS.UPDATE_RESOURCES,
    PERMISSIONS.ARCHIVE_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.MANAGE_METADATA,
    PERMISSIONS.VERSION_CONTROL,
    PERMISSIONS.DOWNLOAD_RESOURCES,
  ],
  
  [ROLES.TRAINING_ADMIN]: [
    PERMISSIONS.LOGIN_SSO,
    PERMISSIONS.SCHEDULE_WEBINARS,
    PERMISSIONS.MANAGE_WEBINARS,
    PERMISSIONS.CREATE_COURSES,
    PERMISSIONS.MANAGE_COURSES,
    PERMISSIONS.ADD_MODULES,
    PERMISSIONS.CREATE_QUIZZES,
    PERMISSIONS.MONITOR_ENROLLMENT,
    PERMISSIONS.TRACK_ATTENDANCE,
    PERMISSIONS.SEARCH_RESOURCES,
  ],
  
  [ROLES.COMM_OFFICER]: [
    PERMISSIONS.LOGIN_SSO,
    PERMISSIONS.CREATE_CAMPAIGNS,
    PERMISSIONS.SEND_EMAIL,
    PERMISSIONS.SEND_SMS,
    PERMISSIONS.TARGET_AUDIENCE,
    PERMISSIONS.SCHEDULE_MESSAGES,
    PERMISSIONS.TRACK_DELIVERY,
    PERMISSIONS.VIEW_CAMPAIGN_STATS,
  ],
  
  [ROLES.MANAGER]: [
    PERMISSIONS.LOGIN_SSO,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_USER_STATS,
    PERMISSIONS.VIEW_COMPLETION_RATES,
    PERMISSIONS.VIEW_SATISFACTION_SCORES,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.FILTER_REPORTS,
    PERMISSIONS.VIEW_TRENDS,
  ],
  
  [ROLES.SYSTEM_ADMIN]: [
    PERMISSIONS.LOGIN_SSO,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.ASSIGN_ROLES,
    PERMISSIONS.CONTROL_ACCESS,
    PERMISSIONS.SYSTEM_MAINTENANCE,
    PERMISSIONS.MANAGE_SSO,
    PERMISSIONS.ARCHIVE_OLD_CONTENT,
    PERMISSIONS.MONITOR_LOGS,
    PERMISSIONS.SYNC_RECORDS,
    // System admin can also access all other permissions when needed
    PERMISSIONS.SEARCH_RESOURCES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_REPORTS,
  ],
  
  [ROLES.AUDITOR]: [
    PERMISSIONS.LOGIN_SSO,
    PERMISSIONS.AUDIT_SYSTEM,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.COMPLIANCE_MONITORING,
    PERMISSIONS.SECURITY_REVIEW,
    PERMISSIONS.GENERATE_AUDIT_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_REPORTS,
  ],
};

// Role descriptions for UI display
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [ROLES.TAXPAYER]: 'External user who uses ITAS for tax purposes and accesses educational materials',
  [ROLES.MOR_STAFF]: 'Internal Ministry of Revenue staff member who uses learning modules',
  [ROLES.CONTENT_ADMIN]: 'Responsible for managing educational materials and resources',
  [ROLES.TRAINING_ADMIN]: 'Manages courses, modules, and live webinars',
  [ROLES.COMM_OFFICER]: 'Handles communication campaigns and notifications',
  [ROLES.MANAGER]: 'High-level role for monitoring performance and generating reports',
  [ROLES.SYSTEM_ADMIN]: 'Technical role managing users and system configuration',
  [ROLES.AUDITOR]: 'System auditing and compliance monitoring role',
};

// Helper functions for role management
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const getRolePermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole] || [];
};

export const isAdminRole = (userRole: UserRole): boolean => {
  const adminRoles: UserRole[] = [
    ROLES.CONTENT_ADMIN,
    ROLES.TRAINING_ADMIN,
    ROLES.COMM_OFFICER,
    ROLES.MANAGER,
    ROLES.SYSTEM_ADMIN,
    ROLES.AUDITOR,
  ];
  return adminRoles.includes(userRole);
};

export const isInternalRole = (userRole: UserRole): boolean => {
  const internalRoles: UserRole[] = [
    ROLES.MOR_STAFF,
    ROLES.CONTENT_ADMIN,
    ROLES.TRAINING_ADMIN,
    ROLES.COMM_OFFICER,
    ROLES.MANAGER,
    ROLES.SYSTEM_ADMIN,
    ROLES.AUDITOR,
  ];
  return internalRoles.includes(userRole);
};

// Get readable role name
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [ROLES.TAXPAYER]: 'Taxpayer',
    [ROLES.MOR_STAFF]: 'MOR Staff',
    [ROLES.CONTENT_ADMIN]: 'Content Administrator',
    [ROLES.TRAINING_ADMIN]: 'Training Administrator',
    [ROLES.COMM_OFFICER]: 'Communication Officer',
    [ROLES.SYSTEM_ADMIN]: 'System Administrator',
    [ROLES.MANAGER]: 'Manager',
    [ROLES.AUDITOR]: 'Auditor',
  };
  
  return displayNames[role] || role;
}

// Get role description
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    [ROLES.TAXPAYER]: 'Individual taxpayers who can access educational resources and courses',
    [ROLES.MOR_STAFF]: 'Internal Ministry of Revenue staff with access to internal training',
    [ROLES.CONTENT_ADMIN]: 'Manages educational content, resources, and materials',
    [ROLES.TRAINING_ADMIN]: 'Schedules and manages webinars and training sessions',
    [ROLES.COMM_OFFICER]: 'Sends notifications and communications to users',
    [ROLES.SYSTEM_ADMIN]: 'Manages system configuration, users, and roles',
    [ROLES.MANAGER]: 'Views analytics and generates reports',
    [ROLES.AUDITOR]: 'Audits system usage and compliance',
  };
  
  return descriptions[role] || '';
}

// Get routes accessible by role
export function getAccessibleRoutes(role: UserRole): string[] {
  const routes: Record<UserRole, string[]> = {
    [ROLES.TAXPAYER]: [
      '/taxpayer/dashboard',
      '/taxpayer/courses',
      '/taxpayer/courses/:id',
      '/taxpayer/resources',
      '/profile',
    ],
    
    [ROLES.MOR_STAFF]: [
      '/staff/dashboard',
      '/staff/internal-training',
      '/staff/courses',
      '/staff/progress',
      '/staff/assessments',
      '/staff/certificates',
      '/staff/compliance',
      '/staff/resources',
      '/staff/help',
      '/profile',
    ],
    
    [ROLES.CONTENT_ADMIN]: [
      '/admin/content-dashboard',
      '/admin/upload-resource',
      '/admin/resource-version',
      '/admin/resources',
      '/profile',
    ],
    
    [ROLES.TRAINING_ADMIN]: [
      '/admin/training-dashboard',
      '/admin/webinar-management',
      '/admin/webinars',
      '/profile',
    ],
    
    [ROLES.COMM_OFFICER]: [
      '/admin/comm-dashboard',
      '/admin/notification-center',
      '/profile',
    ],
    
    [ROLES.MANAGER]: [
      '/admin/manager-dashboard',
      '/admin/analytics',
      '/profile',
    ],
    
    [ROLES.SYSTEM_ADMIN]: [
      '/admin/system-dashboard',
      '/admin/user-role-management',
      '/admin/analytics',
      '/profile',
    ],
    
    [ROLES.AUDITOR]: [
      '/admin/auditor-dashboard',
      '/admin/analytics',
      '/profile',
    ],
  };
  
  return routes[role] || [];
}

// Check if route is accessible by role
export function canAccessRoute(role: UserRole, route: string): boolean {
  const accessibleRoutes = getAccessibleRoutes(role);
  
  // Exact match
  if (accessibleRoutes.includes(route)) {
    return true;
  }
  
  // Pattern match for dynamic routes
  return accessibleRoutes.some(accessibleRoute => {
    if (accessibleRoute.includes(':')) {
      // Convert route pattern to regex
      const pattern = accessibleRoute
        .replace(/:[^/]+/g, '([^/]+)')
        .replace(/\//g, '\\/');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(route);
    }
    return false;
  });
}

// Get menu items for role
export function getMenuItems(role: UserRole) {
  const allMenuItems = {
    taxpayer: [
      { label: 'Dashboard', path: '/taxpayer/dashboard', icon: 'Dashboard' },
      { label: 'Courses', path: '/taxpayer/courses', icon: 'School' },
      { label: 'Resources', path: '/taxpayer/resources', icon: 'Description' },
      { label: 'Certificates', path: '/taxpayer/certificates', icon: 'Verified' },
      { label: 'Profile', path: '/profile', icon: 'Person' },
    ],
    
    staff: [
      { label: 'Dashboard', path: '/staff/dashboard', icon: 'Dashboard' },
      { label: 'Internal Training', path: '/staff/internal-training', icon: 'Business' },
      { label: 'Courses', path: '/staff/courses', icon: 'School' },
      { label: 'Progress', path: '/staff/progress', icon: 'TrendingUp' },
      { label: 'Compliance', path: '/staff/compliance', icon: 'Security' },
      { label: 'Profile', path: '/profile', icon: 'Person' },
    ],
    
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard' },
      { label: 'User Management', path: '/admin/user-role-management', icon: 'People', roles: [ROLES.SYSTEM_ADMIN] as UserRole[] },
      { label: 'Upload Resource', path: '/admin/upload-resource', icon: 'Upload', roles: [ROLES.CONTENT_ADMIN, ROLES.SYSTEM_ADMIN] as UserRole[] },
      { label: 'Resource Version', path: '/admin/resource-version', icon: 'History', roles: [ROLES.CONTENT_ADMIN, ROLES.SYSTEM_ADMIN] as UserRole[] },
      { label: 'Webinar Management', path: '/admin/webinar-management', icon: 'VideoCall', roles: [ROLES.TRAINING_ADMIN, ROLES.SYSTEM_ADMIN] as UserRole[] },
      { label: 'Notification Center', path: '/admin/notification-center', icon: 'Notifications', roles: [ROLES.COMM_OFFICER, ROLES.SYSTEM_ADMIN] as UserRole[] },
      { label: 'Analytics', path: '/admin/analytics', icon: 'Analytics', roles: [ROLES.MANAGER, ROLES.SYSTEM_ADMIN, ROLES.AUDITOR] as UserRole[] },
      { label: 'Profile', path: '/profile', icon: 'Person' },
    ],
  };
  
  if (role === ROLES.TAXPAYER) {
    return allMenuItems.taxpayer;
  } else if (role === ROLES.MOR_STAFF) {
    return allMenuItems.staff;
  } else {
    return allMenuItems.admin.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(role);
    });
  }
}

// Get dashboard statistics based on role
export function getDashboardStats(role: UserRole) {
  const stats: Record<UserRole, Array<{ label: string; key: string }>> = {
    [ROLES.TAXPAYER]: [
      { label: 'Enrolled Courses', key: 'enrolledCourses' },
      { label: 'Completed Courses', key: 'completedCourses' },
      { label: 'Certificates', key: 'certificates' },
      { label: 'Progress', key: 'averageProgress' },
    ],
    
    [ROLES.MOR_STAFF]: [
      { label: 'Total Courses', key: 'totalCourses' },
      { label: 'Completed Courses', key: 'completedCourses' },
      { label: 'Certificates', key: 'certificates' },
      { label: 'Compliance Score', key: 'complianceScore' },
    ],
    
    [ROLES.CONTENT_ADMIN]: [
      { label: 'Total Resources', key: 'totalResources' },
      { label: 'Uploaded This Month', key: 'resourcesThisMonth' },
      { label: 'Total Downloads', key: 'totalDownloads' },
      { label: 'Resource Views', key: 'resourceViews' },
    ],
    
    [ROLES.TRAINING_ADMIN]: [
      { label: 'Scheduled Webinars', key: 'scheduledWebinars' },
      { label: 'Total Registrations', key: 'webinarRegistrations' },
      { label: 'Attendance Rate', key: 'attendanceRate' },
      { label: 'Upcoming Webinars', key: 'upcomingWebinars' },
    ],
    
    [ROLES.COMM_OFFICER]: [
      { label: 'Sent Notifications', key: 'sentNotifications' },
      { label: 'Open Rate', key: 'notificationOpenRate' },
      { label: 'This Month', key: 'notificationsThisMonth' },
      { label: 'Campaigns', key: 'activeCampaigns' },
    ],
    
    [ROLES.MANAGER]: [
      { label: 'Total Users', key: 'totalUsers' },
      { label: 'Active Users', key: 'activeUsers' },
      { label: 'Course Completions', key: 'courseCompletions' },
      { label: 'System Uptime', key: 'systemUptime' },
    ],
    
    [ROLES.SYSTEM_ADMIN]: [
      { label: 'Total Users', key: 'totalUsers' },
      { label: 'System Health', key: 'systemHealth' },
      { label: 'Active Sessions', key: 'activeSessions' },
      { label: 'Storage Usage', key: 'storageUsage' },
    ],
    
    [ROLES.AUDITOR]: [
      { label: 'Audit Logs', key: 'auditLogs' },
      { label: 'Compliance Score', key: 'complianceScore' },
      { label: 'Security Events', key: 'securityEvents' },
      { label: 'User Activities', key: 'userActivities' },
    ],
  };
  
  return stats[role] || stats[ROLES.TAXPAYER];
}
