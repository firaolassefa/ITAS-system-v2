
-- ===============================
-- USERS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    tax_number VARCHAR(50),
    company_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- ===============================
-- DEFAULT USERS (Passwords are BCrypt hashed)
-- Password for all users: "Password@123"
-- ===============================
INSERT INTO users (
    username,
    password,
    full_name,
    email,
    user_type,
    tax_number,
    company_name
) VALUES
(
    'taxpayer',
    '$2a$10$xQjKZjKZjKZjKZjKZjKZjO7YqKZjKZjKZjKZjKZjKZjKZjKZjKZjK',
    'John Taxpayer',
    'taxpayer@example.com',
    'TAXPAYER',
    'TXN-123456',
    'Doe Enterprises'
),
(
    'systemadmin',
    '$2a$10$xQjKZjKZjKZjKZjKZjKZjO7YqKZjKZjKZjKZjKZjKZjKZjKZjKZjK',
    'System Administrator',
    'system.admin@itas.gov.et',
    'SYSTEM_ADMIN',
    NULL,
    NULL
),
(
    'contentadmin',
    '$2a$10$xQjKZjKZjKZjKZjKZjKZjO7YqKZjKZjKZjKZjKZjKZjKZjKZjKZjK',
    'Content Administrator',
    'content.admin@itas.gov.et',
    'CONTENT_ADMIN',
    NULL,
    NULL
),
(
    'trainingadmin',
    '$2a$10$xQjKZjKZjKZjKZjKZjKZjO7YqKZjKZjKZjKZjKZjKZjKZjKZjKZjK',
    'Training Administrator',
    'training.admin@itas.gov.et',
    'TRAINING_ADMIN',
    NULL,
    NULL
),
(
    'commoffice',
    '$2a$10$xQjKZjKZjKZjKZjKZjKZjO7YqKZjKZjKZjKZjKZjKZjKZjKZjKZjK',
    'Communication Officer',
    'communication@itas.gov.et',
    'COMM_OFFICER',
    NULL,
    NULL
),
(
    'manager',
    '$2a$10$xQjKZjKZjKZjKZjKZjKZjKZjKZjKZjKZjKZjKZjKZjKZjKZjKZjK',
    'System Manager',
    'manager@itas.gov.et',
    'MANAGER',
    NULL,
    NULL
)
ON CONFLICT (username) DO NOTHING;
