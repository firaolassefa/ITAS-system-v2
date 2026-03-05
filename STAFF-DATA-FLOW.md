# MOR_STAFF Pages - Data Flow Architecture

## Overview
This document explains how data flows from the backend database through the API to the frontend MOR_STAFF pages.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE (PostgreSQL)                    │
├─────────────────────────────────────────────────────────────────┤
│  • courses          (id, title, description, category)          │
│  • enrollments      (id, user_id, course_id, progress)          │
│  • certificates     (id, user_id, course_id, issued_date)       │
│  • users            (id, username, user_type)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Spring Boot)                     │
├─────────────────────────────────────────────────────────────────┤
│  CourseController:                                               │
│    • GET /courses                                                │
│    • GET /courses/enrollments/{userId}                           │
│                                                                  │
│  CertificateController:                                          │
│    • GET /certificates/user/{userId}                             │
│                                                                  │
│  DashboardController:                                            │
│    • GET /dashboard/staff/{userId}                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TypeScript)                 │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard.tsx          InternalTraining.tsx    Compliance.tsx  │
│  Certificates.tsx                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow by Page

### 1. Dashboard Page

```
User Opens Dashboard
        ↓
┌───────────────────────────────────────────────────────────┐
│ 1. Fetch Dashboard Stats                                  │
│    GET /dashboard/staff/{userId}                           │
│    Returns: { totalCourses, completedCourses,             │
│               certificates, complianceScore }              │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 2. Fetch User Enrollments                                 │
│    GET /courses/enrollments/{userId}                       │
│    Returns: [{ course: {...}, progress: 75 }, ...]        │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 3. Map Enrollments to Internal Courses                    │
│    • Extract course info                                   │
│    • Calculate status from progress                        │
│    • Format for display                                    │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 4. Calculate Compliance Items                             │
│    • Use completion rate                                   │
│    • Determine status (compliant/warning/overdue)          │
│    • Generate description                                  │
└───────────────────────────────────────────────────────────┘
        ↓
Display Dashboard with Real Data
```

### 2. Internal Training Page

```
User Opens Internal Training
        ↓
┌───────────────────────────────────────────────────────────┐
│ 1. Fetch All Courses                                      │
│    GET /courses                                            │
│    Returns: [{ id, title, description, category }, ...]   │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 2. Fetch User Enrollments                                 │
│    GET /courses/enrollments/{userId}                       │
│    Returns: [{ courseId, progress }, ...]                 │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 3. Create Enrollment Map                                  │
│    Map<courseId, enrollment>                               │
│    For quick lookup of enrollment by course                │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 4. Merge Course + Enrollment Data                         │
│    For each course:                                        │
│      • Get enrollment from map                             │
│      • Add progress (0 if not enrolled)                    │
│      • Calculate status                                    │
└───────────────────────────────────────────────────────────┘
        ↓
Display All Courses with Progress
```

### 3. Compliance Page

```
User Opens Compliance
        ↓
┌───────────────────────────────────────────────────────────┐
│ 1. Fetch User Enrollments                                 │
│    GET /courses/enrollments/{userId}                       │
│    Returns: [{ course, progress }, ...]                   │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 2. Fetch User Certificates (Optional)                     │
│    GET /certificates/user/{userId}                         │
│    Returns: [{ courseId, issuedDate }, ...]               │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 3. Generate Compliance Items                              │
│    For each enrollment:                                    │
│      • Calculate status from progress:                     │
│        - 100% = compliant                                  │
│        - 50-99% = warning                                  │
│        - 0-49% = overdue                                   │
│      • Generate description                                │
│      • Set due date                                        │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 4. Calculate Compliance Score                             │
│    score = (completed mandatory / total mandatory) × 100  │
└───────────────────────────────────────────────────────────┘
        ↓
Display Compliance Dashboard
```

### 4. Certificates Page

```
User Opens Certificates
        ↓
┌───────────────────────────────────────────────────────────┐
│ 1. Fetch User Certificates                                │
│    GET /certificates/user/{userId}                         │
│    Returns: [{ id, courseTitle, certificateNumber,        │
│               issuedDate, score }, ...]                    │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 2. Map Certificate Data                                   │
│    • Format dates                                          │
│    • Calculate stats                                       │
│    • Prepare for display                                   │
└───────────────────────────────────────────────────────────┘
        ↓
Display Certificates with Download Options
```

---

## Data Transformation Examples

### Example 1: Enrollment to Internal Course

**Backend Response:**
```json
{
  "id": 123,
  "userId": 2,
  "courseId": 5,
  "progress": 75,
  "course": {
    "id": 5,
    "title": "Tax Policy Updates 2026",
    "description": "Latest tax policies",
    "category": "Policy"
  }
}
```

**Frontend Transformation:**
```typescript
{
  id: 5,
  title: "Tax Policy Updates 2026",
  category: "Policy",
  progress: 75,
  status: "in_progress", // Calculated: 0 < progress < 100
  mandatory: false
}
```

### Example 2: Progress to Compliance Status

**Logic:**
```typescript
if (progress >= 100) {
  status = "compliant";
  description = "Course completed successfully";
} else if (progress >= 50) {
  status = "warning";
  description = `${progress}% complete - Please finish soon`;
} else if (progress > 0) {
  status = "warning";
  description = `${progress}% complete - Continue learning`;
} else {
  status = "overdue";
  description = "Not started - Begin immediately";
}
```

**Examples:**
- Progress: 100% → Status: compliant (green)
- Progress: 75% → Status: warning (yellow)
- Progress: 30% → Status: warning (yellow)
- Progress: 0% → Status: overdue (red)

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User Logs In                                         │
│    POST /auth/login                                      │
│    { username: "morstaff", password: "Staff@123" }      │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Backend Returns JWT Token                            │
│    { token: "eyJhbGc...", user: {...} }                 │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Frontend Stores Token                                │
│    localStorage.setItem('itas_token', token)            │
│    localStorage.setItem('itas_user', JSON.stringify(user))│
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. All API Calls Include Token                          │
│    headers: {                                            │
│      'Authorization': `Bearer ${token}`                  │
│    }                                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
API Call Made
    ↓
┌─────────────────────────────────────────────────────────┐
│ Try Block                                                │
│   • Fetch data from API                                  │
│   • Parse JSON response                                  │
│   • Transform data                                       │
│   • Update state                                         │
└─────────────────────────────────────────────────────────┘
    ↓ (if error)
┌─────────────────────────────────────────────────────────┐
│ Catch Block                                              │
│   • Log error to console                                 │
│   • Show user-friendly message (optional)                │
│   • Set empty state or fallback data                     │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ Finally Block                                            │
│   • Set loading = false                                  │
│   • Hide spinner                                         │
│   • Enable UI interactions                               │
└─────────────────────────────────────────────────────────┘
```

---

## State Management

### Dashboard State
```typescript
const [stats, setStats] = useState({
  totalCourses: 0,
  completedCourses: 0,
  inProgressCourses: 0,
  certificates: 0,
  complianceScore: 0,
  lastTrainingDate: '',
});
const [internalCourses, setInternalCourses] = useState([]);
const [complianceItems, setComplianceItems] = useState([]);
const [loading, setLoading] = useState(true);
```

### Internal Training State
```typescript
const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(true);
```

### Compliance State
```typescript
const [complianceItems, setComplianceItems] = useState([]);
const [loading, setLoading] = useState(true);
```

---

## Performance Considerations

### Optimization Strategies
1. **Parallel API Calls**: Fetch multiple endpoints simultaneously
2. **Caching**: Store frequently accessed data in localStorage
3. **Lazy Loading**: Load data only when page is visited
4. **Debouncing**: Prevent excessive API calls
5. **Error Recovery**: Graceful fallbacks for failed requests

### Loading Sequence
```
Page Load → Show Spinner → Fetch Data → Transform Data → Update UI → Hide Spinner
```

---

## Security Measures

1. **JWT Authentication**: All API calls require valid token
2. **Role-Based Access**: Backend verifies user role
3. **CORS Protection**: Only allowed origins can access API
4. **Token Expiry**: Tokens expire after set time
5. **Secure Storage**: Tokens stored in localStorage (HTTPS only)

---

## Future Enhancements

### Planned Improvements
1. **WebSocket Integration**: Real-time updates
2. **Offline Support**: Service workers for offline access
3. **Data Caching**: Redux or Context API for state management
4. **Optimistic Updates**: Update UI before API response
5. **Pagination**: Handle large datasets efficiently

---

**Last Updated**: March 3, 2026
**Version**: 1.0
**Status**: Production Ready
