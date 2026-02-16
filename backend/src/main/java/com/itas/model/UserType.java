package com.itas.model;

public enum UserType {
    TAXPAYER,           // External users accessing tax education
    MOR_STAFF,          // Ministry of Revenue staff (internal users)
    CONTENT_ADMIN,      // Manages educational content and resources
    TRAINING_ADMIN,     // Manages courses and webinars
    COMM_OFFICER,       // Handles notifications and communications
    MANAGER,            // Views analytics and reports (read-only)
    SYSTEM_ADMIN,       // Full system administration
    AUDITOR             // System auditing and compliance
}