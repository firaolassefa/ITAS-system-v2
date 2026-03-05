-- Add assessment type and certificate logic to assessments table

-- Add new columns to assessments table
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS assessment_type VARCHAR(50) DEFAULT 'MODULE_QUIZ';
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS is_final_exam BOOLEAN DEFAULT FALSE;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS max_attempts INTEGER DEFAULT 999;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS time_limit_minutes INTEGER DEFAULT 60;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS show_correct_answers BOOLEAN DEFAULT TRUE;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS certificate_required BOOLEAN DEFAULT FALSE;

-- Update existing assessments to be module quizzes
UPDATE assessments SET assessment_type = 'MODULE_QUIZ', is_final_exam = FALSE WHERE assessment_type IS NULL;

-- Add comments
COMMENT ON COLUMN assessments.assessment_type IS 'Type: MODULE_QUIZ or FINAL_EXAM';
COMMENT ON COLUMN assessments.is_final_exam IS 'TRUE if this is the final exam for certificate';
COMMENT ON COLUMN assessments.max_attempts IS 'Maximum attempts allowed (999 = unlimited for module quizzes)';
COMMENT ON COLUMN assessments.time_limit_minutes IS 'Time limit in minutes';
COMMENT ON COLUMN assessments.show_correct_answers IS 'Show correct answers after completion (TRUE for module quizzes)';
COMMENT ON COLUMN assessments.certificate_required IS 'Must pass this to get certificate';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessments_final_exam ON assessments(is_final_exam);
CREATE INDEX IF NOT EXISTS idx_assessments_course_final ON assessments(course_id, is_final_exam);

-- Add attempt tracking to user_assessments or create new table
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    assessment_id BIGINT NOT NULL,
    attempt_number INTEGER NOT NULL,
    score DOUBLE PRECISION,
    passed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    time_taken_minutes INTEGER,
    answers JSONB,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    UNIQUE(user_id, assessment_id, attempt_number)
);

CREATE INDEX IF NOT EXISTS idx_attempts_user ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_assessment ON assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_assessment ON assessment_attempts(user_id, assessment_id);

-- Update certificates table to link to final exam
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS final_exam_id BIGINT;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS final_exam_score DOUBLE PRECISION;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS final_exam_passed_at TIMESTAMP;

COMMENT ON COLUMN certificates.final_exam_id IS 'The final exam that was passed to earn this certificate';
COMMENT ON COLUMN certificates.final_exam_score IS 'Score achieved on the final exam';
COMMENT ON COLUMN certificates.final_exam_passed_at IS 'When the final exam was passed';

-- Sample data: Create a final exam for existing courses
-- This is optional - just for testing
INSERT INTO assessments (course_id, title, description, passing_score, assessment_type, is_final_exam, max_attempts, time_limit_minutes, show_correct_answers, certificate_required)
SELECT 
    id as course_id,
    CONCAT(title, ' - Final Exam') as title,
    'Complete this final exam to earn your certificate' as description,
    70.0 as passing_score,
    'FINAL_EXAM' as assessment_type,
    TRUE as is_final_exam,
    3 as max_attempts,
    90 as time_limit_minutes,
    FALSE as show_correct_answers,
    TRUE as certificate_required
FROM courses
WHERE NOT EXISTS (
    SELECT 1 FROM assessments a 
    WHERE a.course_id = courses.id 
    AND a.is_final_exam = TRUE
)
LIMIT 5;

-- Success message
SELECT 'Assessment types and certificate logic added successfully!' as message;
