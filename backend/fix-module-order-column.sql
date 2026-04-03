-- Run this on your Neon database to fix the module_order column
-- The modules table has a column named "order" (reserved keyword)
-- This renames it to module_order so Hibernate can map it safely

ALTER TABLE modules RENAME COLUMN "order" TO module_order;

-- Verify
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'modules' 
ORDER BY ordinal_position;
