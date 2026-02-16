-- =====================================================
-- ITAS 8-ROLE SYSTEM - SAMPLE USERS
-- Complete test users for all 8 distinct roles
-- =====================================================

-- Clear existing data
DELETE FROM user_roles;
DELETE FROM users WHERE id > 0;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE user_roles_id_seq RESTART WITH 1;

-- =====================================================
-- 1. TAXPAYER USERS
-- =====================================================

INSERT INTO users (username, email, password_hash, full_name, user_type, tax_number, company_name, is_active, is_verified, created_at) VALUES
('taxpayer1', 'taxpayer1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', 'TAXPAYER', 'TIN001234567', 'Doe Enterprises', true, true, CURRENT_TIMESTAMP),
('taxpayer2', 'taxpayer2@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', 'TAXPAYER', 'TIN002345678', 'Smith Trading', true, true, CURRENT_TIMESTAMP),
('individual1', 'individual1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Michael Johnson', 'TAXPAYER', 'TIN003456789', NULL, true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- 2. MOR STAFF USERS (Ministry of Revenue Staff)
-- =====================================================

INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('morstaff1', 'morstaff1@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Wilson', 'MOR_STAFF', true, true, CURRENT_TIMESTAMP),
('morstaff2', 'morstaff2@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'David Brown', 'MOR_STAFF', true, true, CURRENT_TIMESTAMP),
('morstaff3', 'morstaff3@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lisa Anderson', 'MOR_STAFF', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- 3. CONTENT ADMINISTRATOR
-- =====================================================

INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('contentadmin', 'contentadmin@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Emily Davis', 'CONTENT_ADMIN', true, true, CURRENT_TIMESTAMP),
('contentadmin2', 'contentadmin2@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Robert Miller', 'CONTENT_ADMIN', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- 4. TRAINING ADMINISTRATOR
-- =====================================================

INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('trainingadmin', 'trainingadmin@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jennifer Garcia', 'TRAINING_ADMIN', true, true, CURRENT_TIMESTAMP),
('trainingadmin2', 'trainingadmin2@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Thomas Martinez', 'TRAINING_ADMIN', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- 5. COMMUNICATION OFFICER
-- =====================================================

INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('commofficer', 'commofficer@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Amanda Rodriguez', 'COMM_OFFICER', true, true, CURRENT_TIMESTAMP),
('commofficer2', 'commofficer2@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kevin Lee', 'COMM_OFFICER', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- 6. MANAGER (Analytics & Reports)
-- =====================================================

INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('manager', 'manager@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Patricia Taylor', 'MANAGER', true, true, CURRENT_TIMESTAMP),
('manager2', 'manager2@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Christopher White', 'MANAGER', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- 7. SYSTEM ADMINISTRATOR
-- =====================================================

INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('systemadmin', 'systemadmin@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Daniel Thompson', 'SYSTEM_ADMIN', true, true, CURRENT_TIMESTAMP),
('systemadmin2', 'systemadmin2@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Michelle Harris', 'SYSTEM_ADMIN', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- 8. AUDITOR
-- =====================================================

INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('auditor', 'auditor@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Steven Clark', 'AUDITOR', true, true, CURRENT_TIMESTAMP),
('auditor2', 'auditor2@mor.gov.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nancy Lewis', 'AUDITOR', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- SAMPLE COURSES AND RESOURCES
-- =====================================================

-- Insert sample courses
INSERT INTO courses (title, description, category, difficulty_level, estimated_duration, is_active, created_at) VALUES
('Tax Filing Basics', 'Learn the fundamentals of tax filing in Ethiopia', 'Basic Tax Education', 'BEGINNER', 120, true, CURRENT_TIMESTAMP),
('VAT Compliance Guide', 'Comprehensive guide to VAT compliance for businesses', 'Business Tax', 'INTERMEDIATE', 180, true, CURRENT_TIMESTAMP),
('Income Tax for Individuals', 'Personal income tax filing and compliance', 'Personal Tax', 'BEGINNER', 90, true, CURRENT_TIMESTAMP),
('Business Registration Process', 'Step-by-step business registration guide', 'Business Setup', 'BEGINNER', 60, true, CURRENT_TIMESTAMP),
('Advanced Tax Planning', 'Strategic tax planning for businesses', 'Advanced Tax', 'ADVANCED', 240, true, CURRENT_TIMESTAMP);

-- Insert sample resources
INSERT INTO resources (title, description, file_path, file_type, file_size, category, tags, is_active, created_at) VALUES
('Tax Filing Handbook 2024', 'Complete handbook for tax filing procedures', '/resources/tax-filing-handbook-2024.pdf', 'PDF', 2048000, 'Guides', 'tax,filing,handbook,2024', true, CURRENT_TIMESTAMP),
('VAT Calculation Tutorial', 'Video tutorial on VAT calculations', '/resources/vat-tutorial.mp4', 'VIDEO', 52428800, 'Tutorials', 'vat,calculation,tutorial,video', true, CURRENT_TIMESTAMP),
('Business Tax Forms', 'Collection of business tax forms', '/resources/business-tax-forms.pdf', 'PDF', 1536000, 'Forms', 'business,tax,forms', true, CURRENT_TIMESTAMP),
('Income Tax Examples', 'Examples of income tax calculations', '/resources/income-tax-examples.pdf', 'PDF', 1024000, 'Examples', 'income,tax,examples', true, CURRENT_TIMESTAMP);

-- =====================================================
-- TEST USER CREDENTIALS SUMMARY
-- =====================================================

/*
LOGIN CREDENTIALS FOR TESTING (Password: 'password' for all users):

1. TAXPAYERS:
   - taxpayer1 / password (John Doe - Business Owner)
   - taxpayer2 / password (Jane Smith - Business Owner)
   - individual1 / password (Michael Johnson - Individual)

2. MOR STAFF:
   - morstaff1 / password (Sarah Wilson)
   - morstaff2 / password (David Brown)
   - morstaff3 / password (Lisa Anderson)

3. CONTENT ADMIN:
   - contentadmin / password (Emily Davis)
   - contentadmin2 / password (Robert Miller)

4. TRAINING ADMIN:
   - trainingadmin / password (Jennifer Garcia)
   - trainingadmin2 / password (Thomas Martinez)

5. COMMUNICATION OFFICER:
   - commofficer / password (Amanda Rodriguez)
   - commofficer2 / password (Kevin Lee)

6. MANAGER:
   - manager / password (Patricia Taylor)
   - manager2 / password (Christopher White)

7. SYSTEM ADMIN:
   - systemadmin / password (Daniel Thompson)
   - systemadmin2 / password (Michelle Harris)

8. AUDITOR:
   - auditor / password (Steven Clark)
   - auditor2 / password (Nancy Lewis)

Each role has specific dashboard access and permissions as defined in the 8-role system.
*/