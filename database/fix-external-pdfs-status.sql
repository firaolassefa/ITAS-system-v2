-- Fix the status of external PDF resources from ACTIVE to PUBLISHED
-- Run this in your Neon PostgreSQL database

UPDATE resources 
SET status = 'PUBLISHED'
WHERE file_path LIKE 'http%' 
  AND status = 'ACTIVE';

-- Verify the update
SELECT id, title, resource_type, status, file_path 
FROM resources 
WHERE file_path LIKE 'http%'
ORDER BY id;
