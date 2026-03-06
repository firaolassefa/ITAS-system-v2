export const USER_TYPES = {
  TAX_AGENT: 'TAX_AGENT',
  CONTENT_ADMIN: 'CONTENT_ADMIN',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
} as const;

export const COURSE_CATEGORIES = ['VAT', 'INCOME_TAX', 'CORPORATE_TAX', 'TCC'] as const;

export const RESOURCE_TYPES = ['PDF', 'VIDEO', 'ARTICLE', 'GUIDE', 'PRESENTATION'] as const;

// Backend API URL - Updated to port 9090
export const API_BASE_URL = 'http://localhost:9090/api';
