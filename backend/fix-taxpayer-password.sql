-- Fix taxpayer user password
-- This script updates the taxpayer user password to "password123"
-- The BCrypt hash below is for "password123"

UPDATE users 
SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'taxpayer';

-- Verify the update
SELECT id, username, email, user_type, is_active, 
       substring(password, 1, 30) || '...' as password_preview
FROM users 
WHERE username = 'taxpayer';
