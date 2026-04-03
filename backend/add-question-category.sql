-- Add question_category and course_id columns to questions table
-- Run this against your PostgreSQL database

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS question_category VARCHAR(20) DEFAULT 'QUIZ',
  ADD COLUMN IF NOT EXISTS course_id BIGINT;

-- Backfill: mark existing practice questions
UPDATE questions SET question_category = 'PRACTICE' WHERE is_practice = true;
UPDATE questions SET question_category = 'QUIZ' WHERE is_practice = false AND question_category IS NULL;

-- Backfill course_id from module -> course (PostgreSQL syntax)
UPDATE questions q
SET course_id = m.course_id
FROM modules m
WHERE q.module_id = m.id
  AND q.course_id IS NULL;

-- Verify
SELECT question_category, COUNT(*) FROM questions GROUP BY question_category;
