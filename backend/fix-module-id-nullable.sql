-- Allow module_id to be NULL (required for FINAL_EXAM questions which are course-level)
ALTER TABLE questions ALTER COLUMN module_id DROP NOT NULL;
