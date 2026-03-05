# 🧪 Frontend-Backend Integration Test Checklist

## Testing Plan

I will test each major function to ensure frontend and backend are correctly integrated.

---

## Test 1: Authentication System ✅

### Login Flow
- [ ] Frontend sends credentials to `/api/auth/login`
- [ ] Backend validates and returns JWT token
- [ ] Frontend stores token in localStorage
- [ ] Frontend redirects based on user role

### Registration Flow
- [ ] Frontend sends user data to `/api/auth/register`
- [ ] Backend creates user in database
- [ ] Frontend shows success message
- [ ] User can login with new credentials

**Status:** Testing...

---

## Test 2: Course Management ✅

### View Courses
- [ ] Frontend calls `GET /api/courses`
- [ ] Backend returns list of courses
- [ ] Frontend displays courses correctly

### Create Course (Admin)
- [ ] Frontend sends course data to `POST /api/courses`
- [ ] Backend validates permissions (CONTENT_ADMIN, SYSTEM_ADMIN)
- [ ] Backend creates course in database
- [ ] Frontend refreshes course list

### Delete Course (Admin)
- [ ] Frontend calls `DELETE /api/courses/{id}`
- [ ] Backend checks permissions
- [ ] Backend deletes course and related data
- [ ] Frontend removes course from list

**Status:** Testing...

---

## Test 3: Module Management ✅

### View Modules
- [ ] Frontend calls `GET /api/modules/course/{courseId}`
- [ ] Backend returns modules for course
- [ ] Frontend displays modules in order

### Create Module
- [ ] Frontend sends module data to `POST /api/modules`
- [ ] Backend creates module
- [ ] Frontend shows success

### Upload Content
- [ ] Frontend uploads file to `POST /api/modules/{id}/upload-content`
- [ ] Backend saves file to disk
- [ ] Backend updates module with file path
- [ ] Frontend shows uploaded content

**Status:** Testing...

---

## Test 4: Question Management ✅

### View Questions
- [ ] Frontend calls `GET /api/questions/module/{moduleId}`
- [ ] Backend returns questions with answers
- [ ] Frontend displays questions correctly

### Create Question
- [ ] Frontend sends question data to `POST /api/questions`
- [ ] Backend validates permissions
- [ ] Backend creates question with answers
- [ ] Frontend refreshes question list

### Practice Questions
- [ ] Frontend calls `GET /api/questions/module/{moduleId}/practice`
- [ ] Backend returns only practice questions (isPractice=true)
- [ ] Frontend shows practice interface

### Quiz Questions
- [ ] Frontend calls `GET /api/questions/module/{moduleId}/quiz`
- [ ] Backend returns only quiz questions (isPractice=false)
- [ ] Frontend shows quiz interface

**Status:** Testing...

---

## Test 5: Assessment & Final Exam ✅

### Module Quiz
- [ ] Frontend calls `POST /api/questions/module-quiz/submit`
- [ ] Backend calculates score
- [ ] Backend checks if passed (70%)
- [ ] Frontend shows results

### Final Exam
- [ ] Frontend calls `GET /api/assessments/course/{courseId}/final-exam`
- [ ] Backend returns all quiz questions from all modules
- [ ] Frontend displays exam
- [ ] Frontend submits to `POST /api/assessments/final-exam/submit`
- [ ] Backend calculates score
- [ ] Backend generates certificate if passed (80%)
- [ ] Frontend shows certificate

**Status:** Testing...

---

## Test 6: Certificate System ✅

### Generate Certificate
- [ ] Backend auto-generates on final exam pass
- [ ] Certificate has unique number
- [ ] Certificate saved to database

### View Certificates
- [ ] Frontend calls `GET /api/certificates/user/{userId}`
- [ ] Backend returns user's certificates
- [ ] Frontend displays certificates

### Verify Certificate
- [ ] Frontend calls `GET /api/certificates/verify/{certificateNumber}`
- [ ] Backend checks if certificate exists
- [ ] Backend returns certificate details
- [ ] Frontend shows verification result

**Status:** Testing...

---

## Test 7: Enrollment System ✅

### Enroll in Course
- [ ] Frontend calls `POST /api/courses/enroll`
- [ ] Backend creates enrollment record
- [ ] Backend sets initial progress to 0
- [ ] Frontend shows enrolled status

### Track Progress
- [ ] Frontend calls `PUT /api/courses/progress`
- [ ] Backend updates enrollment progress
- [ ] Frontend shows updated progress bar

### View Enrollments
- [ ] Frontend calls `GET /api/courses/enrollments/{userId}`
- [ ] Backend returns user's enrollments
- [ ] Frontend displays enrolled courses

**Status:** Testing...

---

## Test 8: User Management ✅

### View Users (Admin)
- [ ] Frontend calls `GET /api/users`
- [ ] Backend checks permissions (SYSTEM_ADMIN, MANAGER, AUDITOR)
- [ ] Backend returns user list
- [ ] Frontend displays users

### Update User (Admin)
- [ ] Frontend calls `PUT /api/users/{id}`
- [ ] Backend checks permissions (SYSTEM_ADMIN)
- [ ] Backend updates user
- [ ] Frontend shows success

### Change Password
- [ ] Frontend calls `PATCH /api/users/{id}/password`
- [ ] Backend validates current password
- [ ] Backend updates password
- [ ] Frontend shows success

**Status:** Testing...

---

## Test 9: Analytics & Dashboard ✅

### View Analytics (Manager)
- [ ] Frontend calls `GET /api/analytics/dashboard`
- [ ] Backend checks permissions (SYSTEM_ADMIN, MANAGER, AUDITOR)
- [ ] Backend calculates real statistics
- [ ] Frontend displays charts and numbers

### Role-Specific Dashboards
- [ ] Frontend calls `GET /api/dashboard/taxpayer/{userId}`
- [ ] Backend returns taxpayer-specific data
- [ ] Frontend displays dashboard

**Status:** Testing...

---

## Test 10: Security & Permissions ✅

### Role-Based Access Control
- [ ] TAXPAYER cannot access admin endpoints
- [ ] CONTENT_ADMIN can manage courses
- [ ] SYSTEM_ADMIN can manage users
- [ ] Unauthorized requests return 403

### Token Validation
- [ ] Requests without token return 401
- [ ] Expired tokens return 401
- [ ] Invalid tokens return 401

**Status:** Testing...

