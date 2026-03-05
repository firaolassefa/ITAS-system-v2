# ✅ SYSTEM VERIFICATION CHECKLIST

## Date: March 2, 2026
## Purpose: Verify all system functionality works correctly

---

## 1️⃣ AUTHENTICATION CHECK

### Requirements:
- ✅ User can login with correct credentials
- ✅ User cannot login with wrong password
- ✅ Disabled user cannot login
- ✅ Token generated on successful login
- ✅ Token required for protected routes
- ✅ Password stored encrypted (bcrypt)

### Test Steps:
```bash
# Test 1: Valid Login
POST /api/auth/login
Body: {"username": "taxpayer", "password": "Taxpayer@123"}
Expected: 200 OK, token returned

# Test 2: Invalid Password
POST /api/auth/login
Body: {"username": "taxpayer", "password": "wrong"}
Expected: 401 Unauthorized

# Test 3: Disabled User
1. Disable user via admin panel
2. Try to login
Expected: 401 Unauthorized or "Account disabled"

# Test 4: Token Required
GET /api/courses/enroll (without token)
Expected: 401 Unauthorized
```

### Status: ⏳ NEEDS TESTING

---

## 2️⃣ ROLE-BASED ACCESS CONTROL CHECK

### Requirements:
- ✅ TAXPAYER can access taxpayer routes only
- ✅ TAXPAYER cannot access /admin routes
- ✅ CONTENT_ADMIN can manage courses
- ✅ CONTENT_ADMIN cannot manage users
- ✅ MANAGER can view analytics (read-only)
- ✅ SYSTEM_ADMIN can access everything
- ✅ Direct API calls return 403 if unauthorized
- ✅ Role validation happens in backend

### Test Steps:
```bash
# Test 1: TAXPAYER Cannot Access Admin
Login as: taxpayer
Try: GET /api/users
Expected: 403 Forbidden

# Test 2: TAXPAYER Cannot Access Admin UI
Login as: taxpayer
Navigate to: http://localhost:5173/admin/user-role-management
Expected: 401 Unauthorized page

# Test 3: CONTENT_ADMIN Can Manage Courses
Login as: contentadmin
Try: POST /api/courses
Expected: 200 OK

# Test 4: CONTENT_ADMIN Cannot Manage Users
Login as: contentadmin
Try: GET /api/users
Expected: 403 Forbidden

# Test 5: MANAGER Read-Only
Login as: manager
Try: GET /api/analytics/dashboard
Expected: 200 OK
Try: POST /api/courses
Expected: 403 Forbidden

# Test 6: SYSTEM_ADMIN Full Access
Login as: systemadmin
Try: All endpoints
Expected: All succeed
```

### Status: ⏳ NEEDS TESTING

---

## 3️⃣ REGISTRATION CHECK

### Requirements:
- ✅ New user can register
- ✅ Duplicate username prevented
- ✅ Password encrypted in database
- ✅ User assigned default role (TAXPAYER)
- ✅ User can login after registration
- ✅ Validation errors shown for invalid input

### Test Steps:
```bash
# Test 1: Valid Registration
POST /api/auth/register
Body: {
  "username": "newuser",
  "password": "Password@123",
  "fullName": "New User",
  "email": "newuser@example.com",
  "userType": "TAXPAYER"
}
Expected: 200 OK, user created

# Test 2: Duplicate Username
POST /api/auth/register (same username)
Expected: 400 Bad Request, "Username already exists"

# Test 3: Login After Registration
POST /api/auth/login
Body: {"username": "newuser", "password": "Password@123"}
Expected: 200 OK, token returned

# Test 4: Password Encrypted
Check database: users table
Expected: Password field shows bcrypt