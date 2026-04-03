-- Fix webinar presenters: replace ElementCollection with a simple column
-- Run this on your Neon database

-- Add the new column
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS presenters_data VARCHAR(1000);

-- Migrate existing data from webinar_presenters table (if it exists)
UPDATE webinars w
SET presenters_data = (
    SELECT STRING_AGG(wp.presenters, ',')
    FROM webinar_presenters wp
    WHERE wp.webinar_id = w.id
)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'webinar_presenters');

-- Drop the old ElementCollection table if it exists
DROP TABLE IF EXISTS webinar_presenters;

-- Verify
SELECT id, title, presenters_data FROM webinars LIMIT 5;
