export const USER_TYPES = {
  TAXPAYER: 'TAXPAYER',
  CONTENT_ADMIN: 'CONTENT_ADMIN',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
} as const;

export const COURSE_CATEGORIES = ['VAT', 'INCOME_TAX', 'CORPORATE_TAX', 'TCC'] as const;

export const RESOURCE_TYPES = ['PDF', 'VIDEO', 'ARTICLE', 'GUIDE', 'PRESENTATION'] as const;

// ?? CHANGE THIS LINE - Point to your REAL backend
export const API_BASE_URL = 'http://localhost:8080/api';
