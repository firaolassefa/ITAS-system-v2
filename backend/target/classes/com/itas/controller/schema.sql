-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    user_type VARCHAR(20),
    tax_number VARCHAR(50),
    company_name VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default users if not exist
INSERT INTO users (username, password, full_name, email, user_type, tax_number, company_name) 
VALUES 
('taxpayer', '123', 'John Taxpayer', 'taxpayer@example.com', 'TAXPAYER', 'TXN-123456', 'Doe Enterprises'),
('admin', '123', 'System Admin', 'admin@itas.gov', 'SYSTEM_ADMIN', NULL, NULL)
ON CONFLICT (username) DO NOTHING;
