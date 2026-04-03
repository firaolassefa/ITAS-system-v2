-- ============================================================
-- FIX 1: Change all TAXPAYER users to TAXPAYER
-- ============================================================
UPDATE users 
SET user_type = 'TAXPAYER' 
WHERE user_type = 'TAXPAYER';

-- Verify
SELECT id, username, full_name, user_type 
FROM users 
WHERE user_type IN ('TAXPAYER', 'TAXPAYER');

-- ============================================================
-- FIX 2: Fix "Untitled Course" - courses need real titles
-- ============================================================
-- Check what courses exist
SELECT id, title, description FROM courses;

-- ============================================================
-- FIX 3: Fix "0 of 0 modules" - add modules to courses
-- ============================================================
-- Check modules per course
SELECT c.id, c.title, COUNT(m.id) as module_count
FROM courses c
LEFT JOIN modules m ON m.course_id = c.id
GROUP BY c.id, c.title;

-- ============================================================
-- FIX 4: Add sample quiz questions for final exam
-- (Run this AFTER you have real courses and modules)
-- ============================================================
-- Check quiz questions per module
SELECT 
    c.title as course,
    m.title as module,
    COUNT(q.id) as quiz_questions
FROM courses c
JOIN modules m ON m.course_id = c.id
LEFT JOIN questions q ON q.module_id = m.id AND q.is_practice = false
GROUP BY c.id, c.title, m.id, m.title
ORDER BY c.id, m.module_order;
