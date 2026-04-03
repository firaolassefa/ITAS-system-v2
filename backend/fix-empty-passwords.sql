-- Find users with null or empty passwords
SELECT id, username, email, user_type, password IS NULL as no_password
FROM users
WHERE password IS NULL OR password = '';

-- If you find any, reset their password to 'password123' (BCrypt hash)
-- Replace the WHERE clause with the specific username
-- UPDATE users
-- SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
-- WHERE password IS NULL OR password = '';
-- Note: The hash above = 'password123'
