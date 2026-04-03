-- Check and fix user for login

-- Step 1: Check if user exists
SELECT id, username, full_name, email, user_type, is_active 
FROM users 
WHERE username = 'taxpayer';

-- Step 2: If user doesn't exist or password is wrong, update/create user
-- Password: password123 (bcrypt encoded)
INSERT INTO users (username, password, full_name, email, user_type, is_active, created_at)
VALUES (
    'taxpayer', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', 
    'Tax Agent User', 
    'taxpayer@example.com', 
    'TAXPAYER', 
    true, 
    NOW()
)
ON CONFLICT (username) 
DO UPDATE SET 
    password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO',
    user_type = 'TAXPAYER',
    is_active = true,
    full_name = 'Tax Agent User';

-- Step 3: Verify the user
SELECT id, username, full_name, email, user_type, is_active 
FROM users 
WHERE username = 'taxpayer';

-- Step 4: Check if user has roles
SELECT u.username, ur.role_name, ur.permissions
FROM users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.username = 'taxpayer';

-- Step 5: Add basic role if missing
INSERT INTO user_roles (user_id, role_name, permissions, assigned_at)
SELECT 
    u.id,
    'TAXPAYER',
    'VIEW_COURSES,ENROLL_COURSES,VIEW_RESOURCES,DOWNLOAD_RESOURCES,COMPLETE_MODULES',
    NOW()
FROM users u
WHERE u.username = 'taxpayer'
AND NOT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = u.id
);

-- Final verification
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.user_type,
    u.is_active,
    ur.role_name,
    ur.permissions
FROM users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.username = 'taxpayer';
