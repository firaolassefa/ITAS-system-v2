-- Migrate registered portal users from TAXPAYER to TAX_AGENT
-- TAXPAYER is now reserved for public landing page users (resources only)
-- TAX_AGENT = registered users with full portal access

UPDATE users SET user_type = 'TAX_AGENT' WHERE user_type = 'TAXPAYER';

-- Verify
SELECT user_type, COUNT(*) FROM users GROUP BY user_type ORDER BY user_type;
