-- Safe cleanup of dummy courses
-- Run each block separately in your DB tool

-- Step 1: Find dummy course IDs
SELECT id, title FROM courses WHERE title IN ('taxpayer', 'tax', 'd', 'one');

-- Step 2: Delete related data first (enrollments, modules, questions)
-- Replace (5,6,11,14,15) with actual IDs from Step 1

-- Delete questions in modules of dummy courses
DELETE FROM questions WHERE module_id IN (
  SELECT id FROM modules WHERE course_id IN (5,6,11,14,15)
);

-- Delete modules of dummy courses
DELETE FROM modules WHERE course_id IN (5,6,11,14,15);

-- Delete enrollments of dummy courses
DELETE FROM enrollments WHERE course_id IN (5,6,11,14,15);

-- Delete the dummy courses
DELETE FROM courses WHERE id IN (5,6,11,14,15);

-- Verify
SELECT id, title FROM courses ORDER BY id;
