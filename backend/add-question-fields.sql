-- Add new fields to questions table for W3Schools-style learning system
-- Run this script to update your database schema

-- Add is_practice column (false = quiz/exam, true = practice)
ALTER TABLE questions ADD COLUMN IF NOT EXISTS is_practice BOOLEAN DEFAULT false;

-- Add explanation column for practice questions
ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Update existing questions to be quiz questions by default
UPDATE questions SET is_practice = false WHERE is_practice IS NULL;

-- Add comment for clarity
COMMENT ON COLUMN questions.is_practice IS 'false = quiz/exam question, true = practice question';
COMMENT ON COLUMN questions.explanation IS 'Explanation shown after answering practice questions';
