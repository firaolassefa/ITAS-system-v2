-- Sample Notifications for All Roles
-- Insert sample notifications for testing the notification system

-- System Admin Notifications
INSERT INTO notifications (title, message, link, notification_type, priority, target_audience, role, status, read, sent_count, opened_count, created_at)
VALUES 
('System Update Required', 'Please review the pending user registrations', '/admin/user-role-management', 'IN_APP', 'HIGH', 'SYSTEM_ADMINS', 'SYSTEM_ADMIN', 'SENT', false, 1, 0, NOW()),
('Database Backup Completed', 'Daily database backup completed successfully', NULL, 'SYSTEM', 'LOW', 'SYSTEM_ADMINS', 'SYSTEM_ADMIN', 'SENT', false, 1, 0, NOW() - INTERVAL '2 hours'),
('New User Registration', '3 new users registered today', '/admin/user-role-management', 'IN_APP', 'MEDIUM', 'SYSTEM_ADMINS', 'SYSTEM_ADMIN', 'SENT', false, 1, 0, NOW() - INTERVAL '5 hours');

-- Content Admin Notifications
INSERT INTO notifications (title, message, link, notification_type, priority, target_audience, role, status, read, sent_count, opened_count, created_at)
VALUES 
('Resource Approval Needed', '5 new resources are pending approval', '/admin/content-dashboard', 'IN_APP', 'MEDIUM', 'CONTENT_ADMINS', 'CONTENT_ADMIN', 'SENT', false, 1, 0, NOW()),
('Content Update Available', 'New tax guidelines document uploaded', '/admin/upload-resource', 'IN_APP', 'HIGH', 'CONTENT_ADMINS', 'CONTENT_ADMIN', 'SENT', false, 1, 0, NOW() - INTERVAL '1 hour'),
('Archive Reminder', '10 resources are ready for archiving', '/admin/content-dashboard', 'IN_APP', 'LOW', 'CONTENT_ADMINS', 'CONTENT_ADMIN', 'SENT', false, 1, 0, NOW() - INTERVAL '3 hours');

-- Training Admin Notifications
INSERT INTO notifications (title, message, link, notification_type, priority, target_audience, role, status, read, sent_count, opened_count, created_at)
VALUES 
('Webinar Starting Soon', 'Tax Filing Basics webinar starts in 30 minutes', '/admin/webinar-management', 'IN_APP', 'URGENT', 'TRAINING_ADMINS', 'TRAINING_ADMIN', 'SENT', false, 1, 0, NOW()),
('High Enrollment Alert', 'Advanced Tax Planning course reached 90% capacity', '/admin/training-dashboard', 'IN_APP', 'HIGH', 'TRAINING_ADMINS', 'TRAINING_ADMIN', 'SENT', false, 1, 0, NOW() - INTERVAL '2 hours'),
('Course Completion Report', 'Monthly course completion report is ready', '/admin/training-dashboard', 'IN_APP', 'MEDIUM', 'TRAINING_ADMINS', 'TRAINING_ADMIN', 'SENT', false, 1, 0, NOW() - INTERVAL '4 hours');

-- Communication Officer Notifications
INSERT INTO notifications (title, message, link, notification_type, priority, target_audience, role, status, read, sent_count, opened_count, created_at)
VALUES 
('Campaign Completed', 'Your email campaign has been sent to 500 users', '/admin/notification-center', 'IN_APP', 'LOW', 'COMM_OFFICERS', 'COMM_OFFICER', 'SENT', false, 1, 0, NOW()),
('High Open Rate Alert', 'Tax Deadline Reminder campaign has 85% open rate', '/admin/comm-dashboard', 'IN_APP', 'MEDIUM', 'COMM_OFFICERS', 'COMM_OFFICER', 'SENT', false, 1, 0, NOW() - INTERVAL '1 hour'),
('Scheduled Campaign Ready', 'Your scheduled campaign will be sent tomorrow', '/admin/notification-center', 'IN_APP', 'LOW', 'COMM_OFFICERS', 'COMM_OFFICER', 'SENT', false, 1, 0, NOW() - INTERVAL '6 hours');

-- Manager Notifications
INSERT INTO notifications (title, message, link, notification_type, priority, target_audience, role, status, read, sent_count, opened_count, created_at)
VALUES 
('Monthly Report Ready', 'Your monthly analytics report is now available', '/admin/analytics', 'IN_APP', 'MEDIUM', 'MANAGERS', 'MANAGER', 'SENT', false, 1, 0, NOW()),
('Performance Milestone', 'System reached 1000 active users this month', '/admin/manager-dashboard', 'IN_APP', 'HIGH', 'MANAGERS', 'MANAGER', 'SENT', false, 1, 0, NOW() - INTERVAL '3 hours'),
('Quarterly Review Due', 'Q1 performance review is due next week', '/admin/analytics', 'IN_APP', 'MEDIUM', 'MANAGERS', 'MANAGER', 'SENT', false, 1, 0, NOW() - INTERVAL '5 hours');

-- Taxpayer Notifications
INSERT INTO notifications (title, message, link, notification_type, priority, target_audience, role, status, read, sent_count, opened_count, created_at)
VALUES 
('New Course Available', 'Check out our new Advanced Tax Planning course', '/taxpayer/courses', 'IN_APP', 'LOW', 'ALL_TAXPAYERS', 'TAXPAYER', 'SENT', false, 1, 0, NOW()),
('Certificate Ready', 'Your Tax Filing Basics certificate is ready to download', '/taxpayer/dashboard', 'IN_APP', 'MEDIUM', 'ALL_TAXPAYERS', 'TAXPAYER', 'SENT', false, 1, 0, NOW() - INTERVAL '1 hour'),
('Course Reminder', 'You have 2 courses in progress. Continue learning!', '/taxpayer/courses', 'IN_APP', 'LOW', 'ALL_TAXPAYERS', 'TAXPAYER', 'SENT', false, 1, 0, NOW() - INTERVAL '4 hours'),
('Tax Deadline Approaching', 'Tax filing deadline is in 7 days', '/taxpayer/resources', 'IN_APP', 'URGENT', 'ALL_TAXPAYERS', 'TAXPAYER', 'SENT', false, 1, 0, NOW() - INTERVAL '2 hours');

-- MOR Staff Notifications (if using MOR_STAFF role)
INSERT INTO notifications (title, message, link, notification_type, priority, target_audience, role, status, read, sent_count, opened_count, created_at)
VALUES 
('Internal Training Update', 'New compliance training module available', '/staff/internal-training', 'IN_APP', 'MEDIUM', 'MOR_STAFF', 'MOR_STAFF', 'SENT', false, 1, 0, NOW()),
('Mandatory Training Reminder', 'Complete your annual compliance training by end of month', '/staff/compliance', 'IN_APP', 'HIGH', 'MOR_STAFF', 'MOR_STAFF', 'SENT', false, 1, 0, NOW() - INTERVAL '3 hours');

-- Auditor Notifications (if using AUDITOR role)
INSERT INTO notifications (title, message, link, notification_type, priority, target_audience, role, status, read, sent_count, opened_count, created_at)
VALUES 
('Audit Report Available', 'Q1 system audit report is ready for review', '/admin/auditor-dashboard', 'IN_APP', 'HIGH', 'AUDITORS', 'AUDITOR', 'SENT', false, 1, 0, NOW()),
('Compliance Alert', 'Review required for recent system changes', '/admin/auditor-dashboard', 'IN_APP', 'URGENT', 'AUDITORS', 'AUDITOR', 'SENT', false, 1, 0, NOW() - INTERVAL '1 hour');

-- Verify the notifications
SELECT 
    role,
    COUNT(*) as notification_count,
    SUM(CASE WHEN read = false THEN 1 ELSE 0 END) as unread_count
FROM notifications
GROUP BY role
ORDER BY role;
