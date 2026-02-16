-- Insert initial users
INSERT INTO users (username, password, full_name, email, user_type, tax_number, company_name, active, created_at) 
VALUES 
('taxpayer', '123', 'John Taxpayer', 'taxpayer@example.com', 'TAXPAYER', 'TXN-123456', 'Doe Enterprises', true, NOW()),
('admin', '123', 'System Admin', 'admin@itas.gov', 'SYSTEM_ADMIN', NULL, NULL, true, NOW());

-- Insert courses
INSERT INTO courses (title, description, category, difficulty, duration_hours, published) 
VALUES 
('VAT Fundamentals for Beginners', 'Learn basic VAT concepts, registration, and filing procedures.', 'VAT', 'BEGINNER', 4, true),
('Income Tax Calculation', 'Complete guide to calculating and filing income tax returns.', 'INCOME_TAX', 'INTERMEDIATE', 6, true),
('Corporate Tax Compliance', 'Advanced corporate tax obligations and compliance requirements.', 'CORPORATE_TAX', 'ADVANCED', 8, true);

-- Insert resources
INSERT INTO resources (title, description, resource_type, file_url, category, audience, views, downloads, uploaded_at)
VALUES
('VAT Compliance Handbook 2024', 'Complete guide to VAT compliance for small and medium businesses.', 'PDF', '/resources/vat-handbook.pdf', 'VAT', 'ALL', 1250, 890, NOW()),
('How to File Tax Returns Online', 'Step-by-step video tutorial for online tax filing.', 'VIDEO', '/resources/tax-filing.mp4', 'INCOME_TAX', 'TAXPAYER', 3200, 1500, NOW()),
('Tax Deductions Guide', 'Comprehensive list of eligible tax deductions and credits.', 'ARTICLE', '/resources/deductions-guide.pdf', 'INCOME_TAX', 'ALL', 890, 670, NOW());
