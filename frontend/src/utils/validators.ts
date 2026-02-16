import * as yup from 'yup';
import { useState } from 'react';
// Common validation patterns
export const PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^\+?[\d\s-]+$/,
  TAX_NUMBER: /^[A-Z0-9-]+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  FILE_NAME: /^[a-zA-Z0-9_\-. ]+$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
} as const;

// Common validation messages
export const MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  TAX_NUMBER: 'Please enter a valid tax number',
  USERNAME: 'Username must be 3-20 characters (letters, numbers, _, -)',
  PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
  MIN_VALUE: (min: number) => `Must be at least ${min}`,
  MAX_VALUE: (max: number) => `Must be at most ${max}`,
  URL: 'Please enter a valid URL',
  FILE_TYPE: (types: string[]) => `File type must be one of: ${types.join(', ')}`,
  FILE_SIZE: (maxSize: number) => `File size must be less than ${maxSize}MB`,
  DATE_FUTURE: 'Date must be in the future',
  DATE_PAST: 'Date must be in the past',
} as const;

// User validation schemas
export const userSchemas = {
  login: yup.object({
    username: yup.string()
      .required(MESSAGES.REQUIRED)
      .matches(PATTERNS.USERNAME, MESSAGES.USERNAME),
    password: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(8, MESSAGES.MIN_LENGTH(8)),
  }),

  register: yup.object({
    username: yup.string()
      .required(MESSAGES.REQUIRED)
      .matches(PATTERNS.USERNAME, MESSAGES.USERNAME),
    email: yup.string()
      .required(MESSAGES.REQUIRED)
      .matches(PATTERNS.EMAIL, MESSAGES.EMAIL),
    password: yup.string()
      .required(MESSAGES.REQUIRED)
      .matches(PATTERNS.PASSWORD, MESSAGES.PASSWORD),
    fullName: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(2, MESSAGES.MIN_LENGTH(2))
      .max(100, MESSAGES.MAX_LENGTH(100)),
    taxNumber: yup.string()
      .matches(PATTERNS.TAX_NUMBER, MESSAGES.TAX_NUMBER),
    companyName: yup.string()
      .max(200, MESSAGES.MAX_LENGTH(200)),
    phoneNumber: yup.string()
      .matches(PATTERNS.PHONE, MESSAGES.PHONE),
  }),

  profile: yup.object({
    fullName: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(2, MESSAGES.MIN_LENGTH(2))
      .max(100, MESSAGES.MAX_LENGTH(100)),
    email: yup.string()
      .required(MESSAGES.REQUIRED)
      .matches(PATTERNS.EMAIL, MESSAGES.EMAIL),
    phoneNumber: yup.string()
      .matches(PATTERNS.PHONE, MESSAGES.PHONE),
    companyName: yup.string()
      .max(200, MESSAGES.MAX_LENGTH(200)),
    address: yup.string()
      .max(500, MESSAGES.MAX_LENGTH(500)),
  }),

  passwordChange: yup.object({
    currentPassword: yup.string()
      .required(MESSAGES.REQUIRED),
    newPassword: yup.string()
      .required(MESSAGES.REQUIRED)
      .matches(PATTERNS.PASSWORD, MESSAGES.PASSWORD)
      .notOneOf([yup.ref('currentPassword')], 'New password must be different from current password'),
    confirmPassword: yup.string()
      .required(MESSAGES.REQUIRED)
      .oneOf([yup.ref('newPassword')], 'Passwords must match'),
  }),
};

// Course validation schemas
export const courseSchemas = {
  create: yup.object({
    title: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(5, MESSAGES.MIN_LENGTH(5))
      .max(200, MESSAGES.MAX_LENGTH(200)),
    description: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(20, MESSAGES.MIN_LENGTH(20))
      .max(2000, MESSAGES.MAX_LENGTH(2000)),
    category: yup.string()
      .required(MESSAGES.REQUIRED),
    difficulty: yup.string()
      .required(MESSAGES.REQUIRED)
      .oneOf(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    durationHours: yup.number()
      .required(MESSAGES.REQUIRED)
      .min(1, MESSAGES.MIN_VALUE(1))
      .max(100, MESSAGES.MAX_VALUE(100)),
    modules: yup.array()
      .of(yup.string().required(MESSAGES.REQUIRED))
      .min(1, 'At least one module is required')
      .max(20, 'Maximum 20 modules allowed'),
    published: yup.boolean()
      .default(false),
  }),

  module: yup.object({
    title: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(5, MESSAGES.MIN_LENGTH(5))
      .max(200, MESSAGES.MAX_LENGTH(200)),
    content: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(50, MESSAGES.MIN_LENGTH(50)),
    durationMinutes: yup.number()
      .required(MESSAGES.REQUIRED)
      .min(5, MESSAGES.MIN_VALUE(5))
      .max(240, MESSAGES.MAX_VALUE(240)),
    order: yup.number()
      .required(MESSAGES.REQUIRED)
      .min(1, MESSAGES.MIN_VALUE(1)),
  }),
};

// Resource validation schemas
export const resourceSchemas = {
  upload: yup.object({
    title: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(5, MESSAGES.MIN_LENGTH(5))
      .max(200, MESSAGES.MAX_LENGTH(200)),
    description: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(20, MESSAGES.MIN_LENGTH(20))
      .max(1000, MESSAGES.MAX_LENGTH(1000)),
    resourceType: yup.string()
      .required(MESSAGES.REQUIRED)
      .oneOf(['PDF', 'VIDEO', 'ARTICLE', 'GUIDE', 'PRESENTATION']),
    category: yup.string()
      .required(MESSAGES.REQUIRED),
    audience: yup.string()
      .required(MESSAGES.REQUIRED)
      .oneOf(['ALL', 'TAXPAYER', 'STAFF', 'SME', 'INDIVIDUAL']),
    file: yup.mixed()
      .required('File is required'),
  }),

  file: yup.object().shape({
    name: yup.string()
      .required()
      .matches(PATTERNS.FILE_NAME, 'Invalid file name'),
    size: yup.number()
      .max(100 * 1024 * 1024, 'File size must be less than 100MB'),
    type: yup.string()
      .oneOf([
        'application/pdf',
        'video/mp4',
        'video/mpeg',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ], 'Unsupported file type'),
  }),
};

// Webinar validation schemas
export const webinarSchemas = {
  schedule: yup.object({
    title: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(5, MESSAGES.MIN_LENGTH(5))
      .max(200, MESSAGES.MAX_LENGTH(200)),
    description: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(20, MESSAGES.MIN_LENGTH(20))
      .max(2000, MESSAGES.MAX_LENGTH(2000)),
    scheduleTime: yup.date()
      .required(MESSAGES.REQUIRED)
      .min(new Date(), MESSAGES.DATE_FUTURE),
    durationMinutes: yup.number()
      .required(MESSAGES.REQUIRED)
      .min(15, MESSAGES.MIN_VALUE(15))
      .max(240, MESSAGES.MAX_VALUE(240)),
    presenters: yup.array()
      .of(yup.string().required(MESSAGES.REQUIRED))
      .min(1, 'At least one presenter is required'),
    maxAttendees: yup.number()
      .required(MESSAGES.REQUIRED)
      .min(1, MESSAGES.MIN_VALUE(1))
      .max(1000, MESSAGES.MAX_VALUE(1000)),
    targetAudience: yup.string()
      .required(MESSAGES.REQUIRED),
    meetingLink: yup.string()
      .matches(PATTERNS.URL, MESSAGES.URL),
  }),
};

// Notification validation schemas
export const notificationSchemas = {
  send: yup.object({
    title: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(5, MESSAGES.MIN_LENGTH(5))
      .max(200, MESSAGES.MAX_LENGTH(200)),
    message: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(10, MESSAGES.MIN_LENGTH(10))
      .max(5000, MESSAGES.MAX_LENGTH(5000)),
    notificationType: yup.string()
      .required(MESSAGES.REQUIRED)
      .oneOf(['EMAIL', 'SMS', 'SYSTEM', 'IN_APP']),
    priority: yup.string()
      .required(MESSAGES.REQUIRED)
      .oneOf(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    targetAudience: yup.string()
      .required(MESSAGES.REQUIRED),
    scheduledFor: yup.date()
      .min(new Date(), MESSAGES.DATE_FUTURE),
  }),
};

// Role validation schemas
export const roleSchemas = {
  create: yup.object({
    name: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(3, MESSAGES.MIN_LENGTH(3))
      .max(50, MESSAGES.MAX_LENGTH(50))
      .matches(/^[a-zA-Z0-9_\s]+$/, 'Role name can only contain letters, numbers, spaces and underscores'),
    description: yup.string()
      .required(MESSAGES.REQUIRED)
      .min(10, MESSAGES.MIN_LENGTH(10))
      .max(500, MESSAGES.MAX_LENGTH(500)),
    permissions: yup.array()
      .of(yup.string().required())
      .min(1, 'At least one permission is required'),
  }),
};

// Utility functions
export const ValidatorUtils = {
  // Validate form data against schema
  validate: async <T>(schema: yup.Schema<T>, data: any): Promise<{ valid: boolean; errors: Record<string, string>; data?: T }> => {
    try {
      const validatedData = await schema.validate(data, { abortEarly: false });
      return { valid: true, errors: {}, data: validatedData };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach(err => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        return { valid: false, errors };
      }
      return { valid: false, errors: { _form: 'Validation failed' } };
    }
  },

  // Validate file
  validateFile: (file: File, options: { 
    allowedTypes?: string[];
    maxSize?: number;
    minSize?: number;
  } = {}): { valid: boolean; error?: string } => {
    const { allowedTypes = [], maxSize = 100 * 1024 * 1024, minSize = 0 } = options;

    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: `File type must be one of: ${allowedTypes.join(', ')}` 
      };
    }

    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB` 
      };
    }

    if (file.size < minSize) {
      return { 
        valid: false, 
        error: `File size must be at least ${Math.round(minSize / 1024)}KB` 
      };
    }

    return { valid: true };
  },

  // Validate email
  validateEmail: (email: string): boolean => {
    return PATTERNS.EMAIL.test(email);
  },

  // Validate phone
  validatePhone: (phone: string): boolean => {
    return PATTERNS.PHONE.test(phone.replace(/\s/g, ''));
  },

  // Validate tax number
  validateTaxNumber: (taxNumber: string): boolean => {
    return PATTERNS.TAX_NUMBER.test(taxNumber);
  },

  // Validate password strength
  validatePasswordStrength: (password: string): { 
    valid: boolean; 
    score: number; 
    feedback: string[];
  } => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    else feedback.push('Password should be at least 8 characters');

    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase letters');

    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase letters');

    // Number check
    if (/\d/.test(password)) score++;
    else feedback.push('Add numbers');

    // Special character check
    if (/[@$!%*?&]/.test(password)) score++;
    else feedback.push('Add special characters (@$!%*?&)');

    const valid = score >= 4;
    return { valid, score, feedback };
  },

  // Format validation errors for display
  formatErrors: (errors: Record<string, string>): string[] => {
    return Object.values(errors);
  },

  // Sanitize input
  sanitize: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>"'&]/g, '')
      .trim();
  },

  // Generate password
  generatePassword: (length: number = 12): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  },

  // Format phone number
  formatPhone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  },

  // Format date for display
  formatDate: (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

// React hook for form validation
export const useValidation = <T extends yup.Schema<any>>(schema: T) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = async (field: string, value: any) => {
    try {
      await schema.validateAt(field, { [field]: value });
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors(prev => ({ ...prev, [field]: error.message }));
      }
      return false;
    }
  };

  const validateForm = async (data: any) => {
    const result = await ValidatorUtils.validate(schema, data);
    setErrors(result.errors);
    setIsValid(result.valid);
    return result;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: string): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  const reset = () => {
    setErrors({});
    setTouched({});
    setIsValid(false);
  };

  return {
    errors,
    touched,
    isValid,
    validateField,
    validateForm,
    handleBlur,
    getFieldError,
    reset,
  };
};

// Custom validation rules
yup.addMethod(yup.string, 'taxNumber', function(message = MESSAGES.TAX_NUMBER) {
  return this.matches(PATTERNS.TAX_NUMBER, message);
});

yup.addMethod(yup.string, 'phone', function(message = MESSAGES.PHONE) {
  return this.matches(PATTERNS.PHONE, message);
});

yup.addMethod(yup.string, 'password', function(message = MESSAGES.PASSWORD) {
  return this.matches(PATTERNS.PASSWORD, message);
});

yup.addMethod(yup.date, 'future', function(message = MESSAGES.DATE_FUTURE) {
  return this.min(new Date(), message);
});

yup.addMethod(yup.date, 'past', function(message = MESSAGES.DATE_PAST) {
  return this.max(new Date(), message);
});

// Export all schemas
export const schemas = {
  user: userSchemas,
  course: courseSchemas,
  resource: resourceSchemas,
  webinar: webinarSchemas,
  notification: notificationSchemas,
  role: roleSchemas,
} as const;

export type UserLogin = yup.InferType<typeof userSchemas.login>;
export type UserRegister = yup.InferType<typeof userSchemas.register>;
export type CourseCreate = yup.InferType<typeof courseSchemas.create>;
export type WebinarSchedule = yup.InferType<typeof webinarSchemas.schedule>;