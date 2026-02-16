import React from 'react';
import { ROLES, PERMISSIONS as BASE_PERMISSIONS } from './roles';

export const PERMISSIONS = {
  ...BASE_PERMISSIONS,
  
  // Action-based permission helpers
  ACTIONS: {
    // Content Management
    UPLOAD_FILE: 'UPLOAD_FILE',
    EDIT_RESOURCE: 'EDIT_RESOURCE',
    DELETE_RESOURCE: 'DELETE_RESOURCE',
    VIEW_RESOURCE_HISTORY: 'VIEW_RESOURCE_HISTORY',
    
    // Course Management
    CREATE_COURSE: 'CREATE_COURSE',
    EDIT_COURSE: 'EDIT_COURSE',
    PUBLISH_COURSE: 'PUBLISH_COURSE',
    VIEW_ENROLLMENTS: 'VIEW_ENROLLMENTS',
    
    // User Management
    CREATE_USER: 'CREATE_USER',
    EDIT_USER: 'EDIT_USER',
    DEACTIVATE_USER: 'DEACTIVATE_USER',
    VIEW_USER_ACTIVITY: 'VIEW_USER_ACTIVITY',
    
    // Webinar Management
    CREATE_WEBINAR: 'CREATE_WEBINAR',
    EDIT_WEBINAR: 'EDIT_WEBINAR',
    CANCEL_WEBINAR: 'CANCEL_WEBINAR',
    VIEW_WEBINAR_ATTENDANCE: 'VIEW_WEBINAR_ATTENDANCE',
    
    // Notification Management
    CREATE_CAMPAIGN: 'CREATE_CAMPAIGN',
    SCHEDULE_NOTIFICATION: 'SCHEDULE_NOTIFICATION',
    VIEW_CAMPAIGN_STATS: 'VIEW_CAMPAIGN_STATS',
    
    // Analytics
    VIEW_REAL_TIME_ANALYTICS: 'VIEW_REAL_TIME_ANALYTICS',
    EXPORT_DATA: 'EXPORT_DATA',
    VIEW_FINANCIAL_REPORTS: 'VIEW_FINANCIAL_REPORTS',
    
    // System
    VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
    MANAGE_SYSTEM_SETTINGS: 'MANAGE_SYSTEM_SETTINGS',
    VIEW_SYSTEM_HEALTH: 'VIEW_SYSTEM_HEALTH',
    
    // Help & Support
    CREATE_HELP_CONTENT: 'CREATE_HELP_CONTENT',
    EDIT_HELP_CONTENT: 'EDIT_HELP_CONTENT',
    VIEW_HELP_ANALYTICS: 'VIEW_HELP_ANALYTICS',
  },
  
  // Page access permissions
  PAGES: {
    // Admin Pages
    ACCESS_ADMIN_DASHBOARD: 'ACCESS_ADMIN_DASHBOARD',
    ACCESS_USER_MANAGEMENT: 'ACCESS_USER_MANAGEMENT',
    ACCESS_ROLE_MANAGEMENT: 'ACCESS_ROLE_MANAGEMENT',
    ACCESS_CONTENT_MANAGEMENT: 'ACCESS_CONTENT_MANAGEMENT',
    ACCESS_COURSE_MANAGEMENT: 'ACCESS_COURSE_MANAGEMENT',
    ACCESS_WEBINAR_MANAGEMENT: 'ACCESS_WEBINAR_MANAGEMENT',
    ACCESS_NOTIFICATION_CENTER: 'ACCESS_NOTIFICATION_CENTER',
    ACCESS_ANALYTICS_DASHBOARD: 'ACCESS_ANALYTICS_DASHBOARD',
    ACCESS_SYSTEM_SETTINGS: 'ACCESS_SYSTEM_SETTINGS',
    ACCESS_AUDIT_LOGS: 'ACCESS_AUDIT_LOGS',
    
    // Taxpayer Pages
    ACCESS_TAXPAYER_DASHBOARD: 'ACCESS_TAXPAYER_DASHBOARD',
    ACCESS_COURSE_CATALOG: 'ACCESS_COURSE_CATALOG',
    ACCESS_RESOURCE_LIBRARY: 'ACCESS_RESOURCE_LIBRARY',
    ACCESS_CERTIFICATES: 'ACCESS_CERTIFICATES',
    ACCESS_PROFILE: 'ACCESS_PROFILE',
    
    // Shared Pages
    ACCESS_HELP_CENTER: 'ACCESS_HELP_CENTER',
    ACCESS_REPORTS: 'ACCESS_REPORTS',
    ACCESS_SETTINGS: 'ACCESS_SETTINGS',
  },
  
  // Feature flags
  FEATURES: {
    ADVANCED_ANALYTICS: 'ADVANCED_ANALYTICS',
    BULK_ACTIONS: 'BULK_ACTIONS',
    API_ACCESS: 'API_ACCESS',
    REAL_TIME_UPDATES: 'REAL_TIME_UPDATES',
    MOBILE_ACCESS: 'MOBILE_ACCESS',
    OFFLINE_MODE: 'OFFLINE_MODE',
    MULTI_LANGUAGE: 'MULTI_LANGUAGE',
    DARK_MODE: 'DARK_MODE',
  },
} as const;

// Permission checking utilities
export const PermissionUtils = {
  // Check if user has permission
  hasPermission: (userPermissions: string[], permission: string): boolean => {
    return userPermissions.includes(permission);
  },
  
  // Check if user has any of the permissions
  hasAnyPermission: (userPermissions: string[], permissions: string[]): boolean => {
    return permissions.some(permission => userPermissions.includes(permission));
  },
  
  // Check if user has all of the permissions
  hasAllPermissions: (userPermissions: string[], permissions: string[]): boolean => {
    return permissions.every(permission => userPermissions.includes(permission));
  },
  
  // Get user's accessible pages based on permissions
  getAccessiblePages: (userPermissions: string[]): string[] => {
    const accessiblePages: string[] = [];
    
    Object.entries(PERMISSIONS.PAGES).forEach(([page, permission]) => {
      if (userPermissions.includes(permission)) {
        accessiblePages.push(page);
      }
    });
    
    return accessiblePages;
  },
  
  // Get user's available actions based on permissions
  getAvailableActions: (userPermissions: string[]): string[] => {
    const availableActions: string[] = [];
    
    Object.entries(PERMISSIONS.ACTIONS).forEach(([action, permission]) => {
      if (userPermissions.includes(permission)) {
        availableActions.push(action);
      }
    });
    
    return availableActions;
  },
  
  // Get user's enabled features based on permissions
  getEnabledFeatures: (userPermissions: string[]): string[] => {
    const enabledFeatures: string[] = [];
    
    Object.entries(PERMISSIONS.FEATURES).forEach(([feature, permission]) => {
      if (userPermissions.includes(permission)) {
        enabledFeatures.push(feature);
      }
    });
    
    return enabledFeatures;
  },
  
  // Get permissions by category
  getPermissionsByCategory: (category: string): string[] => {
    const categoryMap: Record<string, string[]> = {
      'content': [
        PERMISSIONS.UPLOAD_RESOURCES as string,
        PERMISSIONS.UPDATE_RESOURCES as string,
        PERMISSIONS.ARCHIVE_RESOURCES as string,
        PERMISSIONS.VIEW_RESOURCES as string,
        PERMISSIONS.DOWNLOAD_RESOURCES as string,
      ],
      'courses': [
        PERMISSIONS.VIEW_COURSES as string,
        PERMISSIONS.ENROLL_COURSES as string,
        PERMISSIONS.COMPLETE_MODULES as string,
      ],
      'webinars': [
        PERMISSIONS.SCHEDULE_WEBINARS as string,
        PERMISSIONS.MANAGE_WEBINARS as string,
      ],
      'notifications': [
        PERMISSIONS.SEND_NOTIFICATIONS as string,
      ],
      'analytics': [
        PERMISSIONS.VIEW_ANALYTICS as string,
        PERMISSIONS.EXPORT_REPORTS as string,
      ],
      'system': [
        PERMISSIONS.MANAGE_USERS as string,
        PERMISSIONS.MANAGE_ROLES as string,
        PERMISSIONS.SYSTEM_CONFIG as string,
      ],
    };
    
    return categoryMap[category] || [];
  },
  
  // Get permissions for a specific role
  getPermissionsForRole: (role: string): string[] => {
    // Create a mapping from roles to permissions
    const rolePermissionsMap: Record<string, string[]> = {
      TAXPAYER: [PERMISSIONS.VIEW_COURSES as string, PERMISSIONS.ENROLL_COURSES as string, PERMISSIONS.VIEW_RESOURCES as string],
      CONTENT_ADMIN: [PERMISSIONS.UPLOAD_RESOURCES as string, PERMISSIONS.UPDATE_RESOURCES as string, PERMISSIONS.VIEW_RESOURCES as string],
      TRAINING_ADMIN: [PERMISSIONS.VIEW_COURSES as string, PERMISSIONS.ENROLL_COURSES as string],
      COMM_OFFICER: [PERMISSIONS.SEND_NOTIFICATIONS as string],
      SYSTEM_ADMIN: Object.values(PERMISSIONS).filter(v => typeof v === 'string') as string[],
      MANAGER: [PERMISSIONS.VIEW_ANALYTICS as string, PERMISSIONS.EXPORT_REPORTS as string],
      AUDITOR: [PERMISSIONS.VIEW_ANALYTICS as string],
    };
    
    return rolePermissionsMap[role] || [];
  },
  
  // Validate permission format
  isValidPermission: (permission: string): boolean => {
    const allPermissions = [
      ...Object.values(BASE_PERMISSIONS) as string[],
      ...Object.values(PERMISSIONS.ACTIONS),
      ...Object.values(PERMISSIONS.PAGES),
      ...Object.values(PERMISSIONS.FEATURES),
    ];
    return allPermissions.includes(permission);
  },
  
  // Generate permission description
  getPermissionDescription: (permission: string): string => {
    const descriptions: Record<string, string> = {
      // Content Management
      [PERMISSIONS.UPLOAD_RESOURCES as string]: 'Upload new educational resources',
      [PERMISSIONS.UPDATE_RESOURCES as string]: 'Update existing resources',
      [PERMISSIONS.ARCHIVE_RESOURCES as string]: 'Archive old resources',
      [PERMISSIONS.VIEW_RESOURCES as string]: 'View resource library',
      [PERMISSIONS.DOWNLOAD_RESOURCES as string]: 'Download resources',
      
      // Learning Management
      [PERMISSIONS.VIEW_COURSES as string]: 'View course catalog',
      [PERMISSIONS.ENROLL_COURSES as string]: 'Enroll in courses',
      [PERMISSIONS.COMPLETE_MODULES as string]: 'Complete course modules',
      
      // Webinar Management
      [PERMISSIONS.SCHEDULE_WEBINARS as string]: 'Schedule new webinars',
      [PERMISSIONS.MANAGE_WEBINARS as string]: 'Manage existing webinars',
      
      // Communication
      [PERMISSIONS.SEND_NOTIFICATIONS as string]: 'Send notifications to users',
      
      // Analytics
      [PERMISSIONS.VIEW_ANALYTICS as string]: 'View analytics dashboard',
      [PERMISSIONS.EXPORT_REPORTS as string]: 'Export reports and data',
      
      // System Administration
      [PERMISSIONS.MANAGE_USERS as string]: 'Manage user accounts',
      [PERMISSIONS.MANAGE_ROLES as string]: 'Manage roles and permissions',
      [PERMISSIONS.SYSTEM_CONFIG as string]: 'Configure system settings',
    };
    
    return descriptions[permission] || 'No description available';
  },
};

// Hooks for React components
export const usePermissions = () => {
  const checkPermission = (requiredPermission: string, userPermissions: string[]): boolean => {
    return PermissionUtils.hasPermission(userPermissions, requiredPermission);
  };
  
  const checkAnyPermission = (requiredPermissions: string[], userPermissions: string[]): boolean => {
    return PermissionUtils.hasAnyPermission(userPermissions, requiredPermissions);
  };
  
  const checkAllPermissions = (requiredPermissions: string[], userPermissions: string[]): boolean => {
    return PermissionUtils.hasAllPermissions(userPermissions, requiredPermissions);
  };
  
  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    getAccessiblePages: PermissionUtils.getAccessiblePages,
    getAvailableActions: PermissionUtils.getAvailableActions,
    getEnabledFeatures: PermissionUtils.getEnabledFeatures,
  };
};

// Permission guard component
export const PermissionGuard: React.FC<{
  requiredPermission: string | string[];
  userPermissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ requiredPermission, userPermissions, children, fallback }) => {
  const hasAccess = Array.isArray(requiredPermission)
    ? PermissionUtils.hasAnyPermission(userPermissions, requiredPermission)
    : PermissionUtils.hasPermission(userPermissions, requiredPermission);
  
  if (!hasAccess) {
    return <>{fallback || null}</>;
  }
  
  return <>{children}</>;
};

// Higher-order component for permission checking
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: string | string[]
): React.ComponentType<P & { userPermissions: string[] }> {
  const WithPermissionComponent: React.FC<P & { userPermissions: string[] }> = (props) => {
    const { userPermissions, ...restProps } = props;
    
    const hasAccess = Array.isArray(requiredPermission)
      ? PermissionUtils.hasAnyPermission(userPermissions, requiredPermission)
      : PermissionUtils.hasPermission(userPermissions, requiredPermission);
    
    if (!hasAccess) {
      return null;
    }
    
    return <WrappedComponent {...restProps as P} />;
  };
  
  WithPermissionComponent.displayName = `withPermission(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithPermissionComponent;
}