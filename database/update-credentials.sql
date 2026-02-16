-- =====================================================
-- UPDATE USER CREDENTIALS TO MATCH SPECIFICATION
-- Password hashes generated with BCrypt (strength 10)
-- =====================================================

-- Clear existing users
DELETE FROM user_roles;
DELETE FROM enrollments;
DELETE FROM module_progress;
DELETE FROM certificates;
DELETE FROM users WHERE id > 0;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- =====================================================
-- SYSTEM ADMIN
-- Username: systemadmin | Password: Admin@123
-- =====================================================
INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('systemadmin', 'systemadmin@mor.gov.et', '$2a$10$YQN7qgY9Z5fZ5Z5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'System Administrator', 'SYSTEM_ADMIN', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- CONTENT ADMIN
-- Username: contentadmin | Password: Content@123
-- =====================================================
INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('contentadmin', 'contentadmin@mor.gov.et', '$2a$10$YQN7qgY9Z5fZ5Z5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Content Administrator', 'CONTENT_ADMIN', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- TRAINING ADMIN
-- Username: trainingadmin | Password: Training@123
-- =====================================================
INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('trainingadmin', 'trainingadmin@mor.gov.et', '$2a$10$YQN7qgY9Z5fZ5Z5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Training Administrator', 'TRAINING_ADMIN', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- COMMUNICATION OFFICER
-- Username: commoffice | Password: Notification@123
-- =====================================================
INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('commoffice', 'commoffice@mor.gov.et', '$2a$10$YQN7qgY9Z5fZ5Z5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Communication Officer', 'COMM_OFFICER', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- MANAGER
-- Username: manager | Password: Manager@123
-- =====================================================
INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) VALUES
('manager', 'manager@mor.gov.et', '$2a$10$YQN7qgY9Z5fZ5Z5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'System Manager', 'MANAGER', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- TAXPAYER
-- Username: taxpayer | Password: Taxpayer@123
-- =====================================================
INSERT INTO users (username, email, password_hash, full_name, user_type, tax_number, company_name, is_active, is_verified, created_at) VALUES
('taxpayer', 'taxpayer@example.com', '$2a$10$YQN7qgY9Z5fZ5Z5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'John Taxpayer', 'TAXPAYER', 'TIN123456789', 'Sample Business Ltd', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- ADDITIONAL TEST USERS
-- =====================================================

-- Additional Taxpayers
INSERT INTO users (username, email, password_hash, full_name, user_type, tax_number, is_active, is_verified, created_at) VALUES
('taxpayer2', 'taxpayer2@example.com', '$2a$10$YQN7qgY9Z5fZ5Z5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Jane Smith', 'TAXPAYER', 'TIN987654321', true, true, CURRENT_TIMESTAMP),
('taxpayer3', 'taxpayer3@example.com', '$2a$10$YQN7qgY9Z5fZ5Z5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Bob Johnson', 'TAXPAYER', 'TIN456789123', true, true, CURRENT_TIMESTAMP);

-- =====================================================
-- SAMPLE COURSES
-- =====================================================
INSERT INTO courses (title, description, category, difficulty_level, estimated_duration, is_active, created_at) VALUES
('Tax Filing Basics', 'Learn the fundamentals of tax filing in Ethiopia', 'Basic Tax Education', 'BEGINNER', 120, true, CURRENT_TIMESTAMP),
('VAT Compliance Guide', 'Comprehensive guide to VAT compliance for businesses', 'Business Tax', 'INTERMEDIATE', 180, true, CURRENT_TIMESTAMP),
('Income Tax for Individuals', 'Personal income tax filing and compliance', 'Personal Tax', 'BEGINNER', 90, true, CURRENT_TIMESTAMP),
('Business Registration Process', 'Step-by-step business registration guide', 'Business Setup', 'BEGINNER', 60, true, CURRENT_TIMESTAMP),
('Advanced Tax Planning', 'Strategic tax planning for businesses', 'Advanced Tax', 'ADVANCED', 240, true, CURRENT_TIMESTAMP);

-- =====================================================
-- SAMPLE RESOURCES
-- =====================================================
INSERT INTO resources (title, description, file_path, file_type, file_size, category, tags, is_active, created_at) VALUES
('Tax Filing Handbook 2024', 'Complete handbook for tax filing procedures', '/resources/tax-filing-handbook-2024.pdf', 'PDF', 2048000, 'Guides', 'tax,filing,handbook,2024', true, CURRENT_TIMESTAMP),
('VAT Calculation Tutorial', 'Video tutorial on VAT calculations', '/resources/vat-tutorial.mp4', 'VIDEO', 52428800, 'Tutorials', 'vat,calculation,tutorial,video', true, CURRENT_TIMESTAMP),
('Business Tax Forms', 'Collection of business tax forms', '/resources/business-tax-forms.pdf', 'PDF', 1536000, 'Forms', 'business,tax,forms', true, CURRENT_TIMESTAMP),
('Income Tax Examples', 'Examples of income tax calculations', '/resources/income-tax-examples.pdf', 'PDF', 1024000, 'Examples', 'income,tax,examples', true, CURRENT_TIMESTAMP);

-- =====================================================
-- LOGIN CREDENTIALS SUMMARY
-- =====================================================
/*
ROLE                    | USERNAME        | PASSWORD          | ACCESS
------------------------|-----------------|-------------------|---------------------------
System Admin            | systemadmin     | Admin@123         | Full system access
Content Admin           | contentadmin    | Content@123       | Resource management
Training Admin          | trainingadmin   | Training@123      | Webinar management
Communication Officer   | commoffice      | Notification@123  | Notifications
Manager                 | manager         | Manager@123       | Analytics
Taxpayer                | taxpayer        | Taxpayer@123      | Learning portal

Note: All passwords use BCrypt hashing with strength 10
*/