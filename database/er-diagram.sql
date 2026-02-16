-- ===========================================
-- ITAS SYSTEM - DATABASE SCHEMA
-- ===========================================

-- 1. USERS (Primary Entity)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    user_type VARCHAR(20) DEFAULT 'TAXPAYER',
    tax_number VARCHAR(50),
    company_name VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER_ROLES (Role Management - UC-ADM-004)
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT REFERENCES users(id),
    UNIQUE(user_id, role_name)
);

-- 3. COURSES (Learning Management)
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'VAT',
    difficulty VARCHAR(20) DEFAULT 'BEGINNER',
    duration_hours INTEGER DEFAULT 4,
    modules TEXT[], -- Array of module titles
    published BOOLEAN DEFAULT FALSE,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ENROLLMENTS (UC-LMS-001)
CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress DECIMAL(5,2) DEFAULT 0.00, -- Percentage
    status VARCHAR(20) DEFAULT 'ENROLLED',
    completed_at TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- 5. MODULE_PROGRESS (UC-LMS-002, UC-LMS-004)
CREATE TABLE module_progress (
    id BIGSERIAL PRIMARY KEY,
    enrollment_id BIGINT REFERENCES enrollments(id) ON DELETE CASCADE,
    module_index INTEGER,
    module_name VARCHAR(200),
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER,
    attempts INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    UNIQUE(enrollment_id, module_index)
);

-- 6. CERTIFICATES (UC-LMS-003)
CREATE TABLE certificates (
    id BIGSERIAL PRIMARY KEY,
    certificate_id VARCHAR(100) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    download_url VARCHAR(500),
    verified BOOLEAN DEFAULT TRUE,
    metadata JSONB
);

-- 7. RESOURCES (UC-CM-001, UC-CM-003)
CREATE TABLE resources (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type VARCHAR(20) DEFAULT 'PDF',
    file_url VARCHAR(500),
    file_size BIGINT,
    category VARCHAR(50),
    audience VARCHAR(50) DEFAULT 'ALL',
    version INTEGER DEFAULT 1,
    is_latest BOOLEAN DEFAULT TRUE,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    uploaded_by BIGINT REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. RESOURCE_VERSIONS (UC-CM-002)
CREATE TABLE resource_versions (
    id BIGSERIAL PRIMARY KEY,
    resource_id BIGINT REFERENCES resources(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    file_url VARCHAR(500),
    change_description TEXT,
    updated_by BIGINT REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource_id, version)
);

-- 9. WEBINARS (UC-ADM-001)
CREATE TABLE webinars (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    schedule_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    presenters TEXT[], -- Array of presenter names
    max_attendees INTEGER,
    target_audience VARCHAR(50),
    registration_open BOOLEAN DEFAULT TRUE,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. WEBINAR_REGISTRATIONS
CREATE TABLE webinar_registrations (
    id BIGSERIAL PRIMARY KEY,
    webinar_id BIGINT REFERENCES webinars(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN DEFAULT FALSE,
    UNIQUE(webinar_id, user_id)
);

-- 11. NOTIFICATIONS (UC-ADM-002)
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    audience VARCHAR(50) NOT NULL,
    channel VARCHAR(20) DEFAULT 'EMAIL',
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'DRAFT',
    sent_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. HELP_CONTENT (UC-TP-001)
CREATE TABLE help_content (
    id BIGSERIAL PRIMARY KEY,
    field_id VARCHAR(100) UNIQUE NOT NULL,
    field_name VARCHAR(200),
    description TEXT,
    steps TEXT[],
    example TEXT,
    video_url VARCHAR(500),
    doc_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. ARCHIVED_RESOURCES (UC-MNT-001)
CREATE TABLE archived_resources (
    id BIGSERIAL PRIMARY KEY,
    original_resource_id BIGINT,
    title VARCHAR(200),
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archived_by BIGINT REFERENCES users(id),
    reason VARCHAR(200)
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_webinars_schedule ON webinars(schedule_time);
CREATE INDEX idx_notifications_status ON notifications(status);

-- ===========================================
-- SAMPLE DATA
-- ===========================================
INSERT INTO users (username, password, full_name, email, user_type) VALUES
('taxpayer', '123', 'John Taxpayer', 'taxpayer@example.com', 'TAXPAYER'),
('admin', '123', 'System Admin', 'admin@itas.gov', 'SYSTEM_ADMIN'),
('contentadmin', '123', 'Content Admin', 'content@itas.gov', 'CONTENT_ADMIN'),
('trainingadmin', '123', 'Training Admin', 'training@itas.gov', 'TRAINING_ADMIN'),
('commoffice', '123', 'Comm Officer', 'comm@itas.gov', 'COMM_OFFICER'),
('manager', '123', 'System Manager', 'manager@itas.gov', 'MANAGER');