-- Performance indexes for ITAS system
-- Run once on your Neon database

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username   ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_user_type  ON users(user_type);

-- Courses
CREATE INDEX IF NOT EXISTS idx_courses_active   ON courses(is_active);

-- Modules
CREATE INDEX IF NOT EXISTS idx_modules_course   ON modules(course_id);

-- Questions
CREATE INDEX IF NOT EXISTS idx_questions_module   ON questions(module_id);
CREATE INDEX IF NOT EXISTS idx_questions_course   ON questions(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(question_category);

-- Enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_user   ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);

-- Certificates
CREATE INDEX IF NOT EXISTS idx_certs_user         ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certs_course       ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certs_number       ON certificates(certificate_number);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notif_user         ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_read         ON notifications(is_read);

-- Assessment attempts
CREATE INDEX IF NOT EXISTS idx_attempts_user      ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_def       ON assessment_attempts(assessment_definition_id);

-- Composite indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_enrollments_user_progress ON enrollments(user_id, progress);
CREATE INDEX IF NOT EXISTS idx_enrollments_progress      ON enrollments(progress);
CREATE INDEX IF NOT EXISTS idx_modules_course_order      ON modules(course_id, module_order);
