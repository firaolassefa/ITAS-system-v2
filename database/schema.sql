-- ===========================================
-- ITAS TAX EDUCATION SYSTEM - DATABASE SCHEMA
-- Version: 1.0
-- Created: 2024-02-05
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 1. USERS TABLE
-- ===========================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    
    // User type based on 8-role system requirements
    user_type VARCHAR(20) NOT NULL CHECK (
        user_type IN (
            'TAXPAYER',        -- External users accessing tax education
            'MOR_STAFF',       -- Ministry of Revenue staff (internal users)
            'CONTENT_ADMIN',   -- Manages educational content and resources
            'TRAINING_ADMIN',  -- Manages courses and webinars
            'COMM_OFFICER',    -- Handles notifications and communications
            'MANAGER',         -- Views analytics and reports (read-only)
            'SYSTEM_ADMIN',    -- Full system administration
            'AUDITOR'          -- System auditing and compliance
        )
    ),
    
    -- Taxpayer specific fields
    tax_number VARCHAR(50),
    company_name VARCHAR(200),
    business_type VARCHAR(50),
    registration_date DATE,
    
    -- Contact information
    phone_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Ethiopia',
    postal_code VARCHAR(20),
    
    -- Account status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(100),
    verification_expires TIMESTAMP,
    
    -- Security
    password_reset_token VARCHAR(100),
    password_reset_expires TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    
    -- Indexes for performance
    CONSTRAINT chk_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_tax_number ON users(tax_number);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ===========================================
-- 2. USER_ROLES TABLE (UC-ADM-004)
-- ===========================================
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Role names based on requirements
    role_name VARCHAR(50) NOT NULL CHECK (
        role_name IN (
            'VIEW_COURSES',
            'ENROLL_COURSES',
            'COMPLETE_MODULES',
            'VIEW_RESOURCES',
            'DOWNLOAD_RESOURCES',
            'UPLOAD_RESOURCES',
            'UPDATE_RESOURCES',
            'ARCHIVE_RESOURCES',
            'SCHEDULE_WEBINARS',
            'MANAGE_WEBINARS',
            'SEND_NOTIFICATIONS',
            'VIEW_ANALYTICS',
            'EXPORT_REPORTS',
            'MANAGE_USERS',
            'MANAGE_ROLES',
            'SYSTEM_CONFIG'
        )
    ),
    
    -- Role assignment details
    assigned_by BIGINT REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Constraints
    UNIQUE(user_id, role_name),
    
    -- Indexes
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_name ON user_roles(role_name);
CREATE INDEX idx_user_roles_is_active ON user_roles(is_active);

-- ===========================================
-- 3. COURSES TABLE (UC-LMS-001)
-- ===========================================
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    -- Course categories based on tax types
    category VARCHAR(50) NOT NULL CHECK (
        category IN (
            'VAT',
            'INCOME_TAX',
            'CORPORATE_TAX',
            'TCC',
            'CUSTOMS',
            'EXCISE',
            'PROPERTY_TAX',
            'PAYE',
            'WITHHOLDING_TAX',
            'GENERAL_COMPLIANCE'
        )
    ),
    
    -- Difficulty levels
    difficulty VARCHAR(20) NOT NULL CHECK (
        difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')
    ),
    
    -- Course details
    duration_hours INTEGER NOT NULL CHECK (duration_hours > 0),
    credit_hours DECIMAL(5,2),
    pass_percentage INTEGER DEFAULT 70 CHECK (pass_percentage BETWEEN 0 AND 100),
    
    -- Course status
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (
        status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED', 'RETIRED')
    ),
    
    -- Language and accessibility
    language VARCHAR(50) DEFAULT 'English',
    has_captions BOOLEAN DEFAULT FALSE,
    has_transcript BOOLEAN DEFAULT FALSE,
    
    -- Prerequisites
    prerequisite_course_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
    required_roles VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[],
    
    -- Pricing (free for now, could be extended)
    is_free BOOLEAN DEFAULT TRUE,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'ETB',
    
    -- Metadata
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    published_by BIGINT REFERENCES users(id),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Course statistics (denormalized for performance)
    total_enrollments INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    
    -- Search optimization
    search_vector TSVECTOR,
    
    -- Constraints
    CONSTRAINT chk_course_code CHECK (course_code ~ '^[A-Z0-9-]+$')
);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_difficulty ON courses(difficulty);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_created_at ON courses(created_at);
CREATE INDEX idx_courses_search ON courses USING GIN(search_vector);

-- ===========================================
-- 4. COURSE_MODULES TABLE (UC-LMS-002)
-- ===========================================
CREATE TABLE course_modules (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_order INTEGER NOT NULL CHECK (module_order > 0),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    
    -- Module content
    content_type VARCHAR(20) NOT NULL CHECK (
        content_type IN ('VIDEO', 'READING', 'QUIZ', 'ASSIGNMENT', 'DISCUSSION', 'WEBINAR')
    ),
    content_url TEXT,
    content_duration INTEGER, -- in minutes
    content_size BIGINT, -- in bytes
    
    -- Module requirements
    is_required BOOLEAN DEFAULT TRUE,
    passing_score INTEGER DEFAULT 70 CHECK (passing_score BETWEEN 0 AND 100),
    max_attempts INTEGER DEFAULT 3 CHECK (max_attempts > 0),
    
    -- Module metadata
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(course_id, module_order),
    CONSTRAINT fk_course_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_modules_order ON course_modules(course_id, module_order);

-- ===========================================
-- 5. ENROLLMENTS TABLE (UC-LMS-001)
-- ===========================================
CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Enrollment status
    status VARCHAR(20) DEFAULT 'ENROLLED' CHECK (
        status IN ('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED', 'EXPIRED')
    ),
    
    -- Progress tracking
    progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (
        progress_percentage BETWEEN 0 AND 100
    ),
    completed_modules INTEGER DEFAULT 0,
    total_modules INTEGER,
    
    -- Dates
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Completion details
    final_score DECIMAL(5,2),
    completion_certificate_id BIGINT REFERENCES certificates(id),
    
    -- Constraints
    UNIQUE(user_id, course_id),
    CONSTRAINT fk_enrollments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Check if course is published before enrollment
    CONSTRAINT chk_enrollment_course_status CHECK (
        EXISTS (
            SELECT 1 FROM courses c 
            WHERE c.id = course_id 
            AND c.status = 'PUBLISHED'
        )
    )
);

CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_progress ON enrollments(progress_percentage);
CREATE INDEX idx_enrollments_completed_at ON enrollments(completed_at);

-- ===========================================
-- 6. MODULE_PROGRESS TABLE (UC-LMS-002, UC-LMS-004)
-- ===========================================
CREATE TABLE module_progress (
    id BIGSERIAL PRIMARY KEY,
    enrollment_id BIGINT NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    module_id BIGINT NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    
    -- Progress status
    status VARCHAR(20) DEFAULT 'NOT_STARTED' CHECK (
        status IN ('NOT_STARTED', 'STARTED', 'COMPLETED', 'FAILED')
    ),
    
    -- Attempt tracking
    attempt_number INTEGER DEFAULT 1,
    score DECIMAL(5,2),
    max_score DECIMAL(5,2) DEFAULT 100.00,
    is_passing BOOLEAN DEFAULT FALSE,
    
    -- Time tracking
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    time_spent_seconds INTEGER DEFAULT 0,
    
    -- Quiz/Assessment data
    quiz_data JSONB, -- Stores quiz questions, answers, and responses
    feedback TEXT,
    
    -- Constraints
    UNIQUE(enrollment_id, module_id, attempt_number),
    CONSTRAINT fk_module_progress_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    CONSTRAINT fk_module_progress_module FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
);

CREATE INDEX idx_module_progress_enrollment ON module_progress(enrollment_id);
CREATE INDEX idx_module_progress_module ON module_progress(module_id);
CREATE INDEX idx_module_progress_status ON module_progress(status);
CREATE INDEX idx_module_progress_completed ON module_progress(completed_at);

-- ===========================================
-- 7. RESOURCES TABLE (UC-CM-001, UC-CM-003)
-- ===========================================
CREATE TABLE resources (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Resource type based on requirements
    resource_type VARCHAR(20) NOT NULL CHECK (
        resource_type IN ('PDF', 'VIDEO', 'ARTICLE', 'GUIDE', 'PRESENTATION', 'SPREADSHEET', 'AUDIO', 'IMAGE')
    ),
    
    -- File information
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64), -- SHA-256 for file integrity
    
    -- Tax category
    category VARCHAR(50) NOT NULL CHECK (
        category IN (
            'VAT',
            'INCOME_TAX',
            'CORPORATE_TAX',
            'TCC',
            'CUSTOMS',
            'EXCISE',
            'PROPERTY_TAX',
            'GENERAL'
        )
    ),
    
    -- Target audience
    audience VARCHAR(50) DEFAULT 'ALL' CHECK (
        audience IN ('ALL', 'TAXPAYER', 'SME', 'INDIVIDUAL', 'CORPORATE', 'AGENT', 'STAFF')
    ),
    
    -- Versioning (UC-CM-002)
    version INTEGER DEFAULT 1,
    is_latest_version BOOLEAN DEFAULT TRUE,
    previous_version_id BIGINT REFERENCES resources(id),
    
    -- File validation
    is_validated BOOLEAN DEFAULT FALSE,
    validated_by BIGINT REFERENCES users(id),
    validated_at TIMESTAMP,
    
    -- Usage statistics
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    
    -- Metadata
    uploaded_by BIGINT NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Tags for search
    tags VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[],
    
    -- Search optimization
    search_vector TSVECTOR,
    
    -- Constraints
    CONSTRAINT chk_file_size CHECK (file_size <= 104857600), -- 100MB max
    CONSTRAINT fk_resources_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_resource_type ON resources(resource_type);
CREATE INDEX idx_resources_audience ON resources(audience);
CREATE INDEX idx_resources_uploaded_at ON resources(uploaded_at);
CREATE INDEX idx_resources_version ON resources(version, is_latest_version);
CREATE INDEX idx_resources_search ON resources USING GIN(search_vector);
CREATE INDEX idx_resources_tags ON resources USING GIN(tags);

-- ===========================================
-- 8. RESOURCE_VERSIONS TABLE (UC-CM-002)
-- ===========================================
CREATE TABLE resource_versions (
    id BIGSERIAL PRIMARY KEY,
    resource_id BIGINT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    
    -- Version details
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64),
    
    -- Change information
    change_description TEXT NOT NULL,
    changes_summary TEXT,
    
    -- Version metadata
    created_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(resource_id, version),
    CONSTRAINT fk_resource_versions_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT fk_resource_versions_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_resource_versions_resource ON resource_versions(resource_id);
CREATE INDEX idx_resource_versions_version ON resource_versions(version);

-- ===========================================
-- 9. CERTIFICATES TABLE (UC-LMS-003)
-- ===========================================
CREATE TABLE certificates (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    certificate_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Certificate details
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_id BIGINT REFERENCES enrollments(id) ON DELETE SET NULL,
    
    -- Certificate content
    recipient_name VARCHAR(200) NOT NULL,
    course_title VARCHAR(200) NOT NULL,
    completion_date DATE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    
    -- Certificate metadata
    certificate_template VARCHAR(50) DEFAULT 'STANDARD',
    certificate_data JSONB, -- Stores dynamic certificate data
    pdf_file_path TEXT,
    pdf_file_hash VARCHAR(64),
    
    -- Verification
    verification_code VARCHAR(64) UNIQUE,
    is_verified BOOLEAN DEFAULT TRUE,
    verified_by BIGINT REFERENCES users(id),
    verified_at TIMESTAMP,
    
    -- Status
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (
        status IN ('ACTIVE', 'REVOKED', 'EXPIRED', 'REISSUED')
    ),
    revocation_reason TEXT,
    revoked_by BIGINT REFERENCES users(id),
    revoked_at TIMESTAMP,
    
    -- Reissuance tracking
    reissued_from_id BIGINT REFERENCES certificates(id),
    
    -- Metadata
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_certificates_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_certificates_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT chk_certificate_id CHECK (certificate_id ~ '^ITAS-CERT-[0-9]{4}-[0-9]{6}$'),
    CONSTRAINT chk_expiry_date CHECK (expiry_date IS NULL OR expiry_date > issue_date)
);

CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_course_id ON certificates(course_id);
CREATE INDEX idx_certificates_certificate_id ON certificates(certificate_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_issue_date ON certificates(issue_date);

-- ===========================================
-- 10. WEBINARS TABLE (UC-ADM-001)
-- ===========================================
CREATE TABLE webinars (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    
    -- Webinar details
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    
    -- Scheduling
    schedule_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    timezone VARCHAR(50) DEFAULT 'Africa/Addis_Ababa',
    
    -- Presenters
    presenters JSONB NOT NULL, -- Array of presenter objects
    presenter_emails VARCHAR(100)[],
    
    -- Capacity and registration
    max_attendees INTEGER NOT NULL CHECK (max_attendees > 0),
    waiting_list_capacity INTEGER DEFAULT 50,
    requires_approval BOOLEAN DEFAULT FALSE,
    
    -- Target audience
    target_audience VARCHAR(50) DEFAULT 'ALL_TAXPAYERS' CHECK (
        target_audience IN (
            'ALL_TAXPAYERS',
            'SME',
            'INDIVIDUAL',
            'NEW_TAXPAYERS',
            'ACTIVE_USERS',
            'INACTIVE_USERS',
            'COURSE_COMPLETED',
            'SPECIFIC_COURSE'
        )
    ),
    specific_course_id BIGINT REFERENCES courses(id),
    
    -- Meeting details
    meeting_platform VARCHAR(50) CHECK (
        meeting_platform IN ('ZOOM', 'TEAMS', 'GOOGLE_MEET', 'CUSTOM', 'OTHER')
    ),
    meeting_link TEXT,
    meeting_id VARCHAR(100),
    meeting_password VARCHAR(100),
    dial_in_info TEXT,
    
    -- Recording
    will_be_recorded BOOLEAN DEFAULT TRUE,
    recording_link TEXT,
    recording_available_after INTEGER DEFAULT 24, -- hours after webinar
    
    -- Status
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (
        status IN ('DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED', 'POSTPONED')
    ),
    registration_status VARCHAR(20) DEFAULT 'OPEN' CHECK (
        registration_status IN ('OPEN', 'CLOSED', 'FULL', 'WAITLIST')
    ),
    
    -- Reminders and follow-up
    send_reminders BOOLEAN DEFAULT TRUE,
    reminder_hours_before INTEGER[] DEFAULT ARRAY[24, 1], -- hours before
    send_followup BOOLEAN DEFAULT TRUE,
    followup_days_after INTEGER DEFAULT 1,
    
    -- Statistics (denormalized)
    registered_count INTEGER DEFAULT 0,
    attended_count INTEGER DEFAULT 0,
    attendance_rate DECIMAL(5,2) DEFAULT 0.00,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    
    -- Metadata
    created_by BIGINT NOT NULL REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_webinars_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT chk_schedule_time CHECK (schedule_time > CURRENT_TIMESTAMP),
    CONSTRAINT chk_presenters CHECK (jsonb_array_length(presenters) > 0)
);

CREATE INDEX idx_webinars_schedule_time ON webinars(schedule_time);
CREATE INDEX idx_webinars_status ON webinars(status);
CREATE INDEX idx_webinars_created_by ON webinars(created_by);
CREATE INDEX idx_webinars_target_audience ON webinars(target_audience);
CREATE INDEX idx_webinars_created_at ON webinars(created_at);

-- ===========================================
-- 11. WEBINAR_REGISTRATIONS TABLE
-- ===========================================
CREATE TABLE webinar_registrations (
    id BIGSERIAL PRIMARY KEY,
    webinar_id BIGINT NOT NULL REFERENCES webinars(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Registration status
    status VARCHAR(20) DEFAULT 'REGISTERED' CHECK (
        status IN ('REGISTERED', 'WAITLISTED', 'APPROVED', 'CANCELLED', 'ATTENDED', 'NO_SHOW')
    ),
    
    -- Registration details
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    -- Attendance tracking
    joined_at TIMESTAMP,
    left_at TIMESTAMP,
    attendance_duration INTEGER, -- in minutes
    is_verified_attendance BOOLEAN DEFAULT FALSE,
    
    -- Feedback
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    feedback_submitted_at TIMESTAMP,
    
    -- Reminders and notifications
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_sent_at TIMESTAMP,
    followup_sent BOOLEAN DEFAULT FALSE,
    followup_sent_at TIMESTAMP,
    
    -- Certificate
    certificate_id BIGINT REFERENCES certificates(id),
    
    -- Constraints
    UNIQUE(webinar_id, user_id),
    CONSTRAINT fk_webinar_registrations_webinar FOREIGN KEY (webinar_id) REFERENCES webinars(id) ON DELETE CASCADE,
    CONSTRAINT fk_webinar_registrations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_webinar_registrations_webinar ON webinar_registrations(webinar_id);
CREATE INDEX idx_webinar_registrations_user ON webinar_registrations(user_id);
CREATE INDEX idx_webinar_registrations_status ON webinar_registrations(status);
CREATE INDEX idx_webinar_registrations_registered_at ON webinar_registrations(registered_at);

-- ===========================================
-- 12. NOTIFICATIONS TABLE (UC-ADM-002)
-- ===========================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    
    -- Notification content
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    short_message VARCHAR(500),
    
    -- Notification type
    notification_type VARCHAR(20) NOT NULL CHECK (
        notification_type IN ('EMAIL', 'SMS', 'IN_APP', 'PUSH', 'SYSTEM')
    ),
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (
        priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')
    ),
    
    -- Target audience
    target_type VARCHAR(20) NOT NULL CHECK (
        target_type IN ('USER', 'GROUP', 'ROLE', 'ALL', 'CUSTOM')
    ),
    target_audience JSONB, -- Can be user IDs, group IDs, or criteria
    
    -- Scheduling
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Status
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (
        status IN ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED', 'CANCELLED')
    ),
    
    -- Delivery statistics
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    
    -- Failure details
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    -- Campaign tracking
    campaign_id VARCHAR(100),
    campaign_name VARCHAR(200),
    
    -- Template
    template_id BIGINT REFERENCES notification_templates(id),
    template_variables JSONB,
    
    -- Metadata
    created_by BIGINT NOT NULL REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_notifications_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT chk_scheduled_for CHECK (scheduled_for IS NULL OR scheduled_for > CURRENT_TIMESTAMP)
);

CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX idx_notifications_created_by ON notifications(created_by);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_campaign ON notifications(campaign_id);

-- ===========================================
-- 13. NOTIFICATION_RECIPIENTS TABLE
-- ===========================================
CREATE TABLE notification_recipients (
    id BIGSERIAL PRIMARY KEY,
    notification_id BIGINT NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Delivery status
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        status IN ('PENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'FAILED', 'BOUNCED')
    ),
    
    -- Delivery details
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    failed_at TIMESTAMP,
    
    -- Failure details
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Device/Client info
    device_type VARCHAR(50),
    client_info TEXT,
    ip_address INET,
    
    -- Constraints
    UNIQUE(notification_id, user_id),
    CONSTRAINT fk_notification_recipients_notification FOREIGN KEY (notification_id) 
        REFERENCES notifications(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_recipients_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notification_recipients_notification ON notification_recipients(notification_id);
CREATE INDEX idx_notification_recipients_user ON notification_recipients(user_id);
CREATE INDEX idx_notification_recipients_status ON notification_recipients(status);
CREATE INDEX idx_notification_recipients_sent_at ON notification_recipients(sent_at);

-- ===========================================
-- 14. HELP_CONTENT TABLE (UC-TP-001)
-- ===========================================
CREATE TABLE help_content (
    id BIGSERIAL PRIMARY KEY,
    
    -- Context identification
    context_type VARCHAR(50) NOT NULL CHECK (
        context_type IN ('FORM_FIELD', 'PAGE', 'MODULE', 'PROCESS', 'GENERAL')
    ),
    context_id VARCHAR(100) NOT NULL, -- Could be form field ID, page URL, etc.
    context_name VARCHAR(200) NOT NULL,
    
    -- Help content
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    
    -- Step-by-step instructions
    steps JSONB, -- Array of step objects
    
    -- Examples and references
    examples JSONB,
    related_resources BIGINT[] DEFAULT ARRAY[]::BIGINT[],
    related_videos TEXT[],
    
    -- Common questions
    faqs JSONB,
    
    -- Language support
    language VARCHAR(10) DEFAULT 'en',
    is_translated BOOLEAN DEFAULT FALSE,
    original_content_id BIGINT REFERENCES help_content(id),
    
    -- Versioning
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Statistics
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by BIGINT REFERENCES users(id),
    reviewed_at TIMESTAMP,
    
    -- Constraints
    UNIQUE(context_type, context_id, language, version),
    CONSTRAINT fk_help_content_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_help_content_context ON help_content(context_type, context_id);
CREATE INDEX idx_help_content_language ON help_content(language);
CREATE INDEX idx_help_content_is_active ON help_content(is_active);
CREATE INDEX idx_help_content_created_at ON help_content(created_at);

-- ===========================================
-- 15. ANALYTICS TABLE (UC-ADM-003)
-- ===========================================
CREATE TABLE analytics (
    id BIGSERIAL PRIMARY KEY,
    
    -- Analytics scope
    analytics_type VARCHAR(50) NOT NULL CHECK (
        analytics_type IN (
            'USER_ACTIVITY',
            'COURSE_PERFORMANCE',
            'RESOURCE_USAGE',
            'WEBINAR_ATTENDANCE',
            'SYSTEM_USAGE',
            'COMPLIANCE',
            'CUSTOM'
        )
    ),
    
    -- Time period
    period_type VARCHAR(20) NOT NULL CHECK (
        period_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM')
    ),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Metrics data (flexible JSON structure)
    metrics JSONB NOT NULL,
    
    -- Dimensions/filters
    dimensions JSONB,
    
    -- Computed aggregates
    aggregates JSONB,
    
    -- Data quality
    data_source VARCHAR(100),
    data_quality_score DECIMAL(3,2),
    last_updated_source TIMESTAMP,
    
    -- Status
    status VARCHAR(20) DEFAULT 'PROCESSED' CHECK (
        status IN ('PENDING', 'PROCESSING', 'PROCESSED', 'ERROR', 'ARCHIVED')
    ),
    
    -- Error tracking
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Metadata
    generated_by BIGINT REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(analytics_type, period_type, period_start, period_end),
    CONSTRAINT chk_period_range CHECK (period_end >= period_start)
);

CREATE INDEX idx_analytics_type ON analytics(analytics_type);
CREATE INDEX idx_analytics_period ON analytics(period_start, period_end);
CREATE INDEX idx_analytics_generated_at ON analytics(generated_at);

-- ===========================================
-- 16. SYNC_RECORDS TABLE (UC-INT-001)
-- ===========================================
CREATE TABLE sync_records (
    id BIGSERIAL PRIMARY KEY,
    
    -- Sync identification
    sync_type VARCHAR(50) NOT NULL CHECK (
        sync_type IN ('TRAINING_RECORDS', 'USER_DATA', 'COURSE_DATA', 'CERTIFICATES', 'FULL_SYNC')
    ),
    sync_source VARCHAR(100) NOT NULL,
    sync_destination VARCHAR(100) NOT NULL,
    
    -- Sync status
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'PARTIAL')
    ),
    
    -- Sync statistics
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    
    -- Error handling
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    -- Data range
    data_from TIMESTAMP,
    data_to TIMESTAMP,
    
    -- Batch information
    batch_id VARCHAR(100),
    batch_size INTEGER,
    
    -- Metadata
    initiated_by BIGINT REFERENCES users(id),
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Audit trail
    audit_trail JSONB,
    
    -- Constraints
    CONSTRAINT fk_sync_records_initiated_by FOREIGN KEY (initiated_by) REFERENCES users(id)
);

CREATE INDEX idx_sync_records_type ON sync_records(sync_type);
CREATE INDEX idx_sync_records_status ON sync_records(status);
CREATE INDEX idx_sync_records_initiated_at ON sync_records(initiated_at);
CREATE INDEX idx_sync_records_batch_id ON sync_records(batch_id);

-- ===========================================
-- 17. ARCHIVED_RESOURCES TABLE (UC-MNT-001)
-- ===========================================
CREATE TABLE archived_resources (
    id BIGSERIAL PRIMARY KEY,
    
    -- Original resource reference
    original_resource_id BIGINT,
    original_resource_type VARCHAR(50) NOT NULL CHECK (
        original_resource_type IN ('COURSE', 'RESOURCE', 'WEBINAR', 'NOTIFICATION', 'USER')
    ),
    
    -- Archived data (full snapshot)
    archived_data JSONB NOT NULL,
    
    -- Archiving details
    archive_reason VARCHAR(50) NOT NULL CHECK (
        archive_reason IN (
            'OBSOLETE',
            'REPLACED',
            'COMPLIANCE',
            'STORAGE_OPTIMIZATION',
            'USER_REQUEST',
            'SYSTEM_CLEANUP'
        )
    ),
    archive_description TEXT,
    
    -- Retention policy
    retention_period_years INTEGER DEFAULT 7,
    deletion_date DATE GENERATED ALWAYS AS (
        archived_at::DATE + (retention_period_years * INTERVAL '1 year')
    ) STORED,
    
    -- Access control
    access_level VARCHAR(20) DEFAULT 'RESTRICTED' CHECK (
        access_level IN ('PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL')
    ),
    
    -- Metadata
    archived_by BIGINT NOT NULL REFERENCES users(id),
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    restored_by BIGINT REFERENCES users(id),
    restored_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_archived_resources_archived_by FOREIGN KEY (archived_by) REFERENCES users(id),
    CONSTRAINT fk_archived_resources_restored_by FOREIGN KEY (restored_by) REFERENCES users(id),
    CONSTRAINT chk_retention_period CHECK (retention_period_years BETWEEN 1 AND 100)
);

CREATE INDEX idx_archived_resources_original ON archived_resources(original_resource_type, original_resource_id);
CREATE INDEX idx_archived_resources_archived_at ON archived_resources(archived_at);
CREATE INDEX idx_archived_resources_deletion_date ON archived_resources(deletion_date);
CREATE INDEX idx_archived_resources_access_level ON archived_resources(access_level);

-- ===========================================
-- 18. AUDIT_LOGS TABLE (Security & Compliance)
-- ===========================================
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    
    -- Action details
    action_type VARCHAR(50) NOT NULL CHECK (
        action_type IN (
            'CREATE', 'READ', 'UPDATE', 'DELETE',
            'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT',
            'APPROVE', 'REJECT', 'VERIFY', 'REVOKE'
        )
    ),
    action_table VARCHAR(100) NOT NULL,
    record_id BIGINT,
    
    -- User information
    user_id BIGINT REFERENCES users(id),
    user_ip INET,
    user_agent TEXT,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    changes JSONB,
    
    -- Status
    status VARCHAR(20) DEFAULT 'SUCCESS' CHECK (
        status IN ('SUCCESS', 'FAILURE', 'WARNING')
    ),
    error_message TEXT,
    
    -- Timestamps
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Additional context
    request_id VARCHAR(100),
    session_id VARCHAR(100),
    endpoint VARCHAR(500),
    http_method VARCHAR(10),
    
    -- Indexes
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_action_table ON audit_logs(action_table, record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_timestamp ON audit_logs(action_timestamp);
CREATE INDEX idx_audit_logs_request_id ON audit_logs(request_id);

-- ===========================================
-- 19. SYSTEM_CONFIG TABLE
-- ===========================================
CREATE TABLE system_config (
    id BIGSERIAL PRIMARY KEY,
    
    -- Configuration key
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    config_type VARCHAR(50) DEFAULT 'STRING' CHECK (
        config_type IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'ARRAY', 'OBJECT')
    ),
    
    -- Scope and access
    config_scope VARCHAR(50) DEFAULT 'GLOBAL' CHECK (
        config_scope IN ('GLOBAL', 'TENANT', 'USER', 'ROLE', 'MODULE')
    ),
    scope_id VARCHAR(100),
    
    -- Validation
    validation_rules JSONB,
    default_value TEXT,
    is_required BOOLEAN DEFAULT FALSE,
    is_encrypted BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    
    -- Versioning
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Change tracking
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_system_config_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_system_config_updated_by FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE INDEX idx_system_config_key ON system_config(config_key);
CREATE INDEX idx_system_config_scope ON system_config(config_scope, scope_id);
CREATE INDEX idx_system_config_category ON system_config(category);
CREATE INDEX idx_system_config_is_active ON system_config(is_active);

-- ===========================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMP
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column
DO $$ 
DECLARE 
    table_name text;
BEGIN 
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'users', 'courses', 'resources', 'webinars', 
            'notifications', 'certificates', 'system_config'
        )
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%s_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', table_name, table_name);
    END LOOP;
END $$;

-- ===========================================
-- INITIAL DATA
-- ===========================================
INSERT INTO users (
    username, email, password_hash, full_name, user_type, 
    is_active, is_verified, country
) VALUES 
-- System Administrator
(
    'systemadmin', 
    'system.admin@itas.gov.et', 
    -- Password: Admin@123 (bcrypt hash)
    '$2a$12$5Y6X8v9w2z3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
    'System Administrator',
    'SYSTEM_ADMIN',
    TRUE, TRUE, 'Ethiopia'
),
-- Content Administrator
(
    'contentadmin',
    'content.admin@itas.gov.et',
    '$2a$12$5Y6X8v9w2z3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
    'Content Administrator',
    'CONTENT_ADMIN',
    TRUE, TRUE, 'Ethiopia'
),
-- Training Administrator
(
    'trainingadmin',
    'training.admin@itas.gov.et',
    '$2a$12$5Y6X8v9w2z3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
    'Training Administrator',
    'TRAINING_ADMIN',
    TRUE, TRUE, 'Ethiopia'
),
-- Communication Officer
(
    'commoffice',
    'communication@itas.gov.et',
    '$2a$12$5Y6X8v9w2z3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
    'Communication Officer',
    'COMM_OFFICER',
    TRUE, TRUE, 'Ethiopia'
),
-- Manager
(
    'manager',
    'manager@itas.gov.et',
    '$2a$12$5Y6X8v9w2z3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
    'System Manager',
    'MANAGER',
    TRUE, TRUE, 'Ethiopia'
),
-- Sample Taxpayer
(
    'taxpayer1',
    'john.taxpayer@example.com',
    '$2a$12$5Y6X8v9w2z3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
    'John Taxpayer',
    'TAXPAYER',
    TRUE, TRUE, 'Ethiopia'
);

-- Assign roles to users
INSERT INTO user_roles (user_id, role_name, assigned_by) VALUES
-- System Admin gets all roles
(1, 'MANAGE_USERS', 1),
(1, 'MANAGE_ROLES', 1),
(1, 'SYSTEM_CONFIG', 1),
(1, 'VIEW_ANALYTICS', 1),
(1, 'EXPORT_REPORTS', 1),

-- Content Admin
(2, 'UPLOAD_RESOURCES', 1),
(2, 'UPDATE_RESOURCES', 1),
(2, 'ARCHIVE_RESOURCES', 1),
(2, 'VIEW_RESOURCES', 1),

-- Training Admin
(3, 'SCHEDULE_WEBINARS', 1),
(3, 'MANAGE_WEBINARS', 1),

-- Communication Officer
(4, 'SEND_NOTIFICATIONS', 1),

-- Manager
(5, 'VIEW_ANALYTICS', 1),
(5, 'EXPORT_REPORTS', 1),

-- Taxpayer
(6, 'VIEW_COURSES', 1),
(6, 'ENROLL_COURSES', 1),
(6, 'COMPLETE_MODULES', 1),
(6, 'VIEW_RESOURCES', 1),
(6, 'DOWNLOAD_RESOURCES', 1);

-- Insert sample courses
INSERT INTO courses (
    course_code, title, description, category, difficulty,
    duration_hours, status, created_by
) VALUES 
(
    'VAT-101',
    'VAT Fundamentals for Beginners',
    'Learn basic VAT concepts, registration requirements, filing procedures, and compliance essentials for Ethiopian businesses.',
    'VAT',
    'BEGINNER',
    4,
    'PUBLISHED',
    2
),
(
    'IT-201',
    'Income Tax Calculation and Filing',
    'Comprehensive guide to calculating income tax, understanding deductions, and filing tax returns for individuals and businesses.',
    'INCOME_TAX',
    'INTERMEDIATE',
    6,
    'PUBLISHED',
    2
),
(
    'CT-301',
    'Corporate Tax Compliance',
    'Advanced course covering corporate tax obligations, transfer pricing, tax planning, and compliance reporting requirements.',
    'CORPORATE_TAX',
    'ADVANCED',
    8,
    'PUBLISHED',
    2
);

-- Insert system configurations
INSERT INTO system_config (config_key, config_value, config_type, description) VALUES
('system.name', 'ITAS Tax Education System', 'STRING', 'System display name'),
('system.version', '1.0.0', 'STRING', 'Current system version'),
('system.maintenance', 'false', 'BOOLEAN', 'System maintenance mode'),
('file.upload.max_size', '104857600', 'NUMBER', 'Maximum file upload size in bytes'),
('file.upload.allowed_types', '["pdf","mp4","jpg","jpeg","png","doc","docx","xls","xlsx"]', 'JSON', 'Allowed file types for upload'),
('notification.email.enabled', 'true', 'BOOLEAN', 'Enable email notifications'),
('notification.sms.enabled', 'false', 'BOOLEAN', 'Enable SMS notifications'),
('webinar.reminder.hours', '[24, 1]', 'JSON', 'Hours before webinar to send reminders'),
('certificate.expiry.months', '12', 'NUMBER', 'Certificate validity in months'),
('analytics.retention.days', '365', 'NUMBER', 'Analytics data retention period');

-- Insert sample help content for VAT form
INSERT INTO help_content (
    context_type, context_id, context_name, title, description, steps,
    created_by, is_active
) VALUES (
    'FORM_FIELD',
    'vat.registration.form.field.business_name',
    'Business Name Field',
    'How to fill Business Name in VAT Registration',
    'Enter your registered business name exactly as it appears in your business registration certificate.',
    '[{"step": 1, "description": "Locate your business registration certificate"}, {"step": 2, "description": "Copy the exact business name as shown on the certificate"}, {"step": 3, "description": "Paste or type the name in the Business Name field"}, {"step": 4, "description": "Ensure there are no spelling errors or abbreviations"}]',
    2,
    TRUE
);

-- Create initial analytics record
INSERT INTO analytics (
    analytics_type, period_type, period_start, period_end, metrics,
    status, generated_by
) VALUES (
    'SYSTEM_USAGE',
    'MONTHLY',
    DATE '2024-01-01',
    DATE '2024-01-31',
    '{"total_users": 100, "active_users": 75, "course_enrollments": 250, "resource_downloads": 500, "webinar_registrations": 150}',
    'PROCESSED',
    1
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO itasuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO itasuser;

COMMENT ON SCHEMA public IS 'ITAS Tax Education System Database Schema';