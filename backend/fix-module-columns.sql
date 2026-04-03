-- Run this on your PostgreSQL database to add missing module columns
ALTER TABLE modules ADD COLUMN IF NOT EXISTS lesson_content TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS learning_objectives TEXT;

-- Verify
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'modules' 
ORDER BY ordinal_position;
