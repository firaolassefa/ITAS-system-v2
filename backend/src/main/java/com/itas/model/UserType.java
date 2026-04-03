package com.itas.model;

public enum UserType {
    TAX_AGENT,          // Registered users: full portal access (courses, assessments, certificates)
    TAXPAYER,           // Public landing page users: read-only resource access only
    MOR_STAFF,          // Ministry of Revenue staff (internal users)
    CONTENT_ADMIN,      // Manages educational content and resources
    TRAINING_ADMIN,     // Manages courses and webinars
    COMM_OFFICER,       // Handles notifications and communications
    MANAGER,            // Views analytics and reports (read-only)
    SYSTEM_ADMIN,       // Full system administration
    AUDITOR             // System auditing and compliance
}