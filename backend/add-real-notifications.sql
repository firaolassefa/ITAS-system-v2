-- Add real notifications that can be deleted
-- Run this in your PostgreSQL database

-- Clear existing notifications (optional - remove if you want to keep existing ones)
-- DELETE FROM notifications;

-- Reset sequence (optional)
-- ALTER SEQUENCE notifications_id_seq RESTART WITH 1;

-- Insert sample notifications with proper data
INSERT INTO notifications (title, message, link, notification_type, priority, target_audience, role, status, read, sent_count, opened_count, created_at, updated_at, sender_id)
VALUES 
('Tax Filing Deadline Reminder', 'The deadline for Q1 tax filing is approaching. Please ensure all documents are submitted by March 31st.', '/taxpayer/dashboard', 'EMAIL', 'HIGH', 'ALL_TAXPAYERS', 'TAXPAYER', 'SENT', false, 1250, 875, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 1),

('New VAT Guidelines Available', 'Updated VAT guidelines for 2024 are now available in the resource center. Please review the changes.', '/taxpayer/resources', 'IN_APP', 'MEDIUM', 'ALL_TAXPAYERS', 'TAXPAYER', 'SENT', false, 980, 720, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', 1),

('Webinar: Advanced Tax Strategies', 'Join us for an exclusive webinar on advanced tax planning strategies. Register now!', '/taxpayer/webinars', 'EMAIL', 'MEDIUM', 'SME', 'TAXPAYER', 'SENT', false, 650, 520, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', 1),

('System Maintenance Notice', 'The ITAS system will undergo scheduled maintenance on Sunday, 2 AM - 6 AM. Services will be temporarily unavailable.', '/taxpayer/dashboard', 'SYSTEM', 'URGENT', 'ALL', 'ALL', 'SENT', false, 2500, 1800, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 1),

('New Course: Tax Compliance 101', 'A new introductory course on tax compliance is now available. Enroll today to enhance your knowledge!', '/taxpayer/courses', 'EMAIL', 'LOW', 'NEW_TAXPAYERS', 'TAXPAYER', 'SENT', false, 450, 320, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', 1),

('Payment Confirmation', 'Your tax payment has been successfully processed. Receipt #TX-2024-001234', '/taxpayer/payments', 'SMS', 'HIGH', 'INDIVIDUAL', 'TAXPAYER', 'SENT', false, 1, 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', 1),

('Document Upload Required', 'Please upload your supporting documents for the recent tax filing. Deadline: 7 days.', '/taxpayer/documents', 'IN_APP', 'HIGH', 'ALL_TAXPAYERS', 'TAXPAYER', 'SENT', false, 890, 650, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', 1),

('Monthly Tax Newsletter', 'Check out this month''s tax newsletter featuring updates, tips, and important announcements.', '/taxpayer/resources', 'EMAIL', 'LOW', 'ALL_TAXPAYERS', 'TAXPAYER', 'SENT', false, 1500, 450, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', 1);

-- Verify the insertions
SELECT id, title, notification_type, target_audience, sent_count, opened_count, created_at 
FROM notifications 
ORDER BY created_at DESC;
