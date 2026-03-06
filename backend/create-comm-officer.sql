-- =====================================================
-- CREATE COMMUNICATION OFFICER USER FOR TESTING
-- =====================================================
-- Username: commofficer
-- Password: password123
-- Email: commofficer@mor.gov.et
-- =====================================================

-- Delete existing user if exists
DELETE FROM users WHERE username = 'commofficer';

-- Create Communication Officer user
-- Password: password123 (BCrypt hash)
INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, is_verified, created_at) 
VALUES (
    'commofficer',
    'commofficer@mor.gov.et',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Amanda Rodriguez',
    'COMM_OFFICER',
    true,
    true,
    CURRENT_TIMESTAMP
);

-- Verify the user was created
SELECT id, username, email, full_name, user_type, is_active 
FROM users 
WHERE username = 'commofficer';

-- =====================================================
-- COMMUNICATION OFFICER CREDENTIALS
-- =====================================================
-- Username: commofficer
-- Password: password123
-- Role: COMM_OFFICER
-- Email: commofficer@mor.gov.et
-- Full Name: Amanda Rodriguez
-- =====================================================
