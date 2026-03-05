# Testing Course Delete Functionality

## Issue
User reports: "on coursemanagement i can not delet"

## Possible Causes

### 1. Wrong User Role
**Solution:** Make sure you're logged in as one of these roles:
- `contentadmin` / `Content@123`
- `systemadmin` / `Admin@123`

**Other roles CANNOT delete courses:**
- ❌ taxpayer
- ❌ morstaff
- ❌ trainingadmin
- ❌ manager
- ❌ auditor
- ❌ commoffice

### 2. Backend Not Restarted
**Solution:** Restart the backend server to apply security fixes:

```bash
cd ITAS-system-v2/backend
# Stop the current server (Ctrl+C)
# Then restart:
mvnw.cmd spring-boot:run
```

### 3. Token Expired or Invalid
**Solution:** 
1. Logout from the system
2. Clear browser cache/localStorage
3. Login again as `contentadmin` or `systemadmin`

### 4. Frontend Not Showing Delete Button
**Solution:** Check browser console for errors

---

## Step-by-Step Testing

### Test 1: Login as CONTENT_ADMIN
```
1. Logout if currently logged in
2. Go to: http://localhost:5173/login
3. Username: contentadmin
4. Password: Content@123
5. Click Login
6. Go to: Course Management
7. Expand a course
8. You should see the Delete button (trash icon)
9. Click Delete
10. Confirm deletion
```

### Test 2: Check Backend Logs
When you click delete, check the backend console for:
- ✅ Success: "Course deleted successfully"
- ❌ Error: "403 Forbidden" or "Access Denied"

### Test 3: Check Browser Console
Open browser DevTools (F12) and check Console tab for:
- Network errors
- 403 Forbidden responses
- JavaScript errors

---

## Quick Fix Commands

### Restart Backend
```bash
cd ITAS-system-v2/backend
mvnw.cmd spring-boot:run
```

### Clear Browser Cache
```javascript
// Run in browser console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Test API Directly
```bash
# Get your token first (login and check localStorage)
# Then test delete:
curl -X DELETE http://localhost:8080/api/courses/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Expected Behavior

### For CONTENT_ADMIN or SYSTEM_ADMIN:
1. Delete button (trash icon) is visible
2. Clicking delete shows confirmation dialog
3. After confirming, course is deleted
4. Course list refreshes
5. Success message appears

### For Other Roles:
1. Delete button should NOT be visible
2. If they try API directly, they get 403 Forbidden

---

## Debugging Steps

### Step 1: Check Current User Role
```javascript
// Run in browser console (F12)
const user = JSON.parse(localStorage.getItem('itas_user'));
console.log('Current user:', user);
console.log('User type:', user?.userType);
```

### Step 2: Check Token
```javascript
// Run in browser console (F12)
const token = localStorage.getItem('itas_token');
console.log('Token exists:', !!token);
console.log('Token:', token);
```

### Step 3: Test Delete API
```javascript
// Run in browser console (F12) while on Course Management page
const token = localStorage.getItem('itas_token');
fetch('http://localhost:8080/api/courses/1', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Delete response:', data))
.catch(err => console.error('Delete error:', err));
```

---

## Common Error Messages

### "403 Forbidden"
**Cause:** User doesn't have permission
**Solution:** Login as contentadmin or systemadmin

### "401 Unauthorized"
**Cause:** Token expired or invalid
**Solution:** Logout and login again

### "Failed to delete course"
**Cause:** Backend error (foreign key constraints, etc.)
**Solution:** Check backend logs for detailed error

### Delete button not visible
**Cause:** Frontend not showing button for current role
**Solution:** This is correct behavior if you're not CONTENT_ADMIN or SYSTEM_ADMIN

---

## What Role Can Do What

| Action | TAXPAYER | MOR_STAFF | CONTENT_ADMIN | TRAINING_ADMIN | COMM_OFFICER | MANAGER | AUDITOR | SYSTEM_ADMIN |
|--------|----------|-----------|---------------|----------------|--------------|---------|---------|--------------|
| View Courses | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Course | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Edit Course | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Delete Course** | ❌ | ❌ | **✅** | ❌ | ❌ | ❌ | ❌ | **✅** |
| Add Module | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Delete Module | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## If Still Not Working

### 1. Verify Backend Security Config
Check if `SecurityConfig.java` has:
```java
@EnableMethodSecurity(prePostEnabled = true)
```

### 2. Check CourseController
Verify the delete method has:
```java
@DeleteMapping("/{id}")
@PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
public ResponseEntity<?> deleteCourse(@PathVariable Long id)
```

### 3. Check User Type in Database
```sql
SELECT id, username, user_type FROM users WHERE username = 'contentadmin';
-- Should show: user_type = 'CONTENT_ADMIN'
```

### 4. Restart Everything
```bash
# Stop backend (Ctrl+C)
# Stop frontend (Ctrl+C)

# Restart backend
cd ITAS-system-v2/backend
mvnw.cmd spring-boot:run

# Restart frontend (in new terminal)
cd ITAS-system-v2/frontend
npm run dev
```

---

## Contact Information

If the issue persists after trying all steps above, provide:
1. Current user role (from localStorage)
2. Browser console errors
3. Backend console errors
4. Screenshot of the Course Management page

