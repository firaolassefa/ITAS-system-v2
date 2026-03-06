-- Fix login user - ensure taxpayer user exists with correct type

-- Option 1: Change existing user back to TAXPAYER (if you want to use TAXPAYER)
-- UPDATE users SET user_type = 'TAXPAYER' WHERE username = 'taxpayer';

-- Option 2: Change existing user to TAX_AGENT (recommended - matches our changes)
UPDATE users SET user_type = 'TAX_AGENT' WHERE username = 'taxpayer';

-- Option 3: Create a new TAX_AGENT user if needed
-- INSERT INTO users (username, password, full_name, email, user_type, is_active, created_at)
-- VALUES ('taxagent', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', 'Tax Agent User', 'taxagent@example.com', 'TAX_AGENT', true, NOW())
-- ON CONFLICT (username) DO NOTHING;

-- Verify the change
SELECT id, username, full_name, user_type FROM users WHERE username IN ('taxpayer', 'taxagent');
