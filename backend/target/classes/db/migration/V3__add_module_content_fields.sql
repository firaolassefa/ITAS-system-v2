-- Add rich content fields to modules table
ALTER TABLE modules ADD COLUMN IF NOT EXISTS lesson_content TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS learning_objectives TEXT;

-- Add comments for documentation
COMMENT ON COLUMN modules.lesson_content IS 'Rich HTML content for the lesson';
COMMENT ON COLUMN modules.learning_objectives IS 'What students will learn in this module';
