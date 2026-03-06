-- =====================================================
-- ADD REALISTIC SAMPLE NOTIFICATIONS FOR COMM OFFICER
-- =====================================================
-- This script adds realistic notification campaigns
-- with proper sent/opened counts for testing
-- =====================================================

-- Clear existing test notifications (optional)
-- DELETE FROM notifications WHERE title LIKE '%Test%' OR title IN ('ioplolkmop', 'uihfnikmwe', 'fdsdfe');

-- Add realistic notification campaigns
INSERT INTO notifications (
    title, 
    message, 
    link, 
    notification_type, 
    priority, 
    target_audience, 
    role, 
    status, 
    read, 
    sent_count, 
    opened_count, 
    created_at
) VALUES
-- Campaign 1: Tax Season Reminder
(
    'Tax Season Reminder - File Before Deadline',
    'Dear Taxpayer, the tax filing deadline is approaching on March 31st. Please ensure all your documents are ready and file your returns on time to avoid penalties.',
    '/taxpayer/dashboard',
    'EMAIL',
    'HIGH',
    'ALL_TAXPAYERS',
    'TAXPAYER',
    'SENT',
    false,
    1250,
    875,
    NOW() - INTERVAL '2 days'
),

-- Campaign 2: New Course Launch
(
    'New Course Available: Advanced VAT Compliance',
    'We are excited to announce a new course on Advanced VAT Compliance. This comprehensive course covers all aspects of VAT regulations and best practices. Enroll now!',
    '/taxpayer/courses',
    'EMAIL',
    'MEDIUM',
    'ALL_TAXPAYERS',
    'TAXPAYER',
    'SENT',
    false,
    980,
    720,
    NOW() - INTERVAL '5 days'
),

-- Campaign 3: Webinar Invitation
(
    'Join Our Live Webinar: Tax Planning Strategies',
    'Join us for an exclusive webinar on Tax Planning Strategies for Small Businesses. Date: March 25, 2026 at 2:00 PM. Register now to secure your spot!',
    '/taxpayer/dashboard',
    'EMAIL',
    'MEDIUM',
    'SME',
    'TAXPAYER',
    'SENT',
    false,
    650,
    520,
    NOW() - INTERVAL '7 days'
),

-- Campaign 4: System Maintenance Notice
(
    'Scheduled System Maintenance - March 20',
    'Please be informed that the ITAS system will undergo scheduled maintenance on March 20, 2026 from 2:00 AM to 6:00 AM. The system will be temporarily unavailable during this period.',
    '/taxpayer/dashboard',
    'IN_APP',
    'HIGH',
    'ALL_TAXPAYERS',
    'TAXPAYER',
    'SENT',
    false,
    2100,
    1890,
    NOW() - INTERVAL '10 days'
),

-- Campaign 5: Certificate Available
(
    'Your Course Certificate is Ready!',
    'Congratulations! You have successfully completed the course. Your certificate is now available for download. Click here to view and download your certificate.',
    '/taxpayer/certificates',
    'IN_APP',
    'MEDIUM',
    'COURSE_COMPLETED',
    'TAXPAYER',
    'SENT',
    false,
    450,
    425,
    NOW() - INTERVAL '3 days'
),

-- Campaign 6: Payment Reminder
(
    'Payment Reminder: Tax Payment Due',
    'This is a friendly reminder that your tax payment is due on March 15, 2026. Please make your payment on time to avoid late fees and penalties.',
    '/taxpayer/dashboard',
    'EMAIL',
    'URGENT',
    'ALL_TAXPAYERS',
    'TAXPAYER',
    'SENT',
    false,
    1800,
    1620,
    NOW() - INTERVAL '1 day'
),

-- Campaign 7: Survey Request
(
    'Help Us Improve: Take Our Quick Survey',
    'Your feedback matters! Please take 2 minutes to complete our survey about your experience with the ITAS platform. Your input helps us serve you better.',
    '/taxpayer/dashboard',
    'IN_APP',
    'LOW',
    'ALL_TAXPAYERS',
    'TAXPAYER',
    'SENT',
    false,
    1500,
    450,
    NOW() - INTERVAL '4 days'
),

-- Campaign 8: New Resource Available
(
    'New Tax Guide Published: 2026 Tax Regulations',
    'A comprehensive guide to the 2026 tax regulations is now available in the Resources section. Download it to stay informed about the latest tax laws and requirements.',
    '/taxpayer/resources',
    'EMAIL',
    'MEDIUM',
    'ALL_TAXPAYERS',
    'TAXPAYER',
    'SENT',
    false,
    1100,
    770,
    NOW() - INTERVAL '6 days'
);

-- Verify the notifications were added
SELECT 
    id,
    title,
    target_audience,
    notification_type,
    sent_count,
    opened_count,
    ROUND((opened_count::numeric / NULLIF(sent_count, 0) * 100), 2) as open_rate_percent,
    created_at
FROM notifications
WHERE status = 'SENT'
ORDER BY created_at DESC
LIMIT 10;

-- Summary statistics
SELECT 
    COUNT(*) as total_campaigns,
    SUM(sent_count) as total_sent,
    SUM(opened_count) as total_opened,
    ROUND(AVG(opened_count::numeric / NULLIF(sent_count, 0) * 100), 2) as avg_open_rate
FROM notifications
WHERE status = 'SENT';

-- =====================================================
-- SAMPLE NOTIFICATIONS ADDED SUCCESSFULLY
-- =====================================================
-- You should now see realistic notification campaigns
-- in the Communication Officer dashboard with proper
-- sent/opened counts and open rates
-- =====================================================
