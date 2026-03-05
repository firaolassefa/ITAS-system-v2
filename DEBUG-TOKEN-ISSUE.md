# Debug: Token Not Being Sent to Backend

## Problem
Backend logs show:
```
JWT Filter - Token present: false
WARN JWT Filter - No valid token found
Failed to authorize ... [granted=false, expressionAttribute=isAuthenticated()]
```

This means the JWT token is not being sent with API requests.

---

## Quick Diagnostic Steps

### Step 1: Check if Token Exists in Browser

Open browser console (F12) and run:
```javascript
console.log('Token:', localStorage.getItem('itas_token'));
console.log('User:', localStorage.getItem('itas_user'));
```

**Expected Output:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long string)
User: {"id":1,"username":"systemadmin","userType":"SYSTEM_ADMIN",...}
```

**If you see `null` for both:**
- You're not logged in
- Need to login again

---

### Step 2: Clear Everything and Login Fresh

In browser console (F12):
```javascript
// Clear all storage
localStorage.clear();
sessionStorage.clear();

// Reload page
location.reload();
```

Then:
1. Go to `http://localhost:5173/login`
2. Login with:
   - Username: `systemadmin`
   - Password: `Admin@123`
3. Check console for any errors

---

### Step 3: Verify Token is Saved After Login

After logging in, immediately open console and run:
```javascript
console.log('Token after login:', localStorage.getItem('itas_token'));
console.log('User after login:', localStorage.getItem('itas_user'));
```

**Should see:**
- Token: Long JWT string
- User: JSON object with user data

**If still null:**
- Login API call failed
- Check Network tab for login request
- Check for errors in console

---

### Step 4: Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Click on Analytics in sidebar
4. Look at the API requests
5. Click on any request (e.g., `/analytics/dashboard`)
6. Check "Headers" section
7. Look for "Authorization" header

**Should see:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If missing:**
- Token not in localStorage
- Axios interceptor not working
- Need to check axiosConfig.ts

---

## Common Causes & Solutions

### Cause 1: Token Expired
**Symptoms:**
- Token exists in localStorage
- But backend rejects it
- "Token expired" in logs

**Solution:**
```javascript
// Clear and re-login
localStorage.clear();
location.href = '/login';
```

### Cause 2: CORS Issues
**Symptoms:**
- Requests blocked by CORS
- "Access-Control-Allow-Origin" errors
- Token never reaches backend

**Solution:**
- Restart backend
- Check WebConfig.java has CORS settings
- Clear browser cache

### Cause 3: Wrong API Base URL
**Symptoms:**
- Requests go to wrong URL
- 404 errors
- Token sent but to wrong server

**Solution:**
Check `.env` file or `vite.config.ts`:
```
VITE_API_URL=http://localhost:8080/api
```

### Cause 4: Browser Extension Blocking
**Symptoms:**
- Token exists but not sent
- Ad blockers or privacy extensions interfering

**Solution:**
- Try in Incognito/Private mode
- Disable extensions temporarily

---

## Manual Test: Check Token Manually

### Test 1: Login API
```javascript
// In browser console after clearing storage
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'systemadmin',
    password: 'Admin@123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Login response:', data);
  if (data.token) {
    localStorage.setItem('itas_token', data.token);
    localStorage.setItem('itas_user', JSON.stringify(data.user));
    console.log('Token saved!');
  }
});
```

### Test 2: Analytics API with Token
```javascript
// After login, test analytics endpoint
const token = localStorage.getItem('itas_token');
fetch('http://localhost:8080/api/analytics/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Analytics data:', data))
.catch(err => console.error('Error:', err));
```

---

## Check Axios Configuration

Verify `frontend/src/utils/axiosConfig.ts` has:

```typescript
// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('itas_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

## Backend Token Validation

Check backend logs for JWT validation:
```
JWT Filter - Path: /api/analytics/dashboard, Method: GET
JWT Filter - Token present: true  <-- Should be true
JWT Filter - Extracted username: systemadmin  <-- Should show username
```

If token is present but validation fails:
- Token might be malformed
- Secret key mismatch
- Token expired

---

## Step-by-Step Fix

### 1. Complete Fresh Start
```javascript
// Browser console
localStorage.clear();
sessionStorage.clear();
location.href = '/login';
```

### 2. Login
- Username: `systemadmin`
- Password: `Admin@123`

### 3. Verify Token Saved
```javascript
// Browser console
console.log('Token:', localStorage.getItem('itas_token'));
// Should see long JWT string
```

### 4. Navigate to Analytics
- Click "Analytics" in sidebar
- Should NOT redirect to login

### 5. Check Network Tab
- Open DevTools Network tab
- Look for `/analytics/dashboard` request
- Check Authorization header is present

---

## If Still Not Working

### Check Backend JWT Configuration

File: `backend/src/main/resources/application.properties`

Should have:
```properties
jwt.secret=your-secret-key-here-make-it-long-and-secure
jwt.expiration=86400000
```

### Check Security Configuration

File: `backend/src/main/java/com/itas/config/SecurityConfig.java`

Should permit `/api/auth/**`:
```java
.requestMatchers("/api/auth/**").permitAll()
```

### Restart Both Servers

**Backend:**
```bash
cd ITAS-system-v2/backend
.\mvnw.cmd spring-boot:run
```

**Frontend:**
```bash
cd ITAS-system-v2/frontend
npm run dev
```

---

## Expected Behavior After Fix

### Login:
1. Enter credentials
2. Click Login
3. Token saved to localStorage
4. Redirect to dashboard

### Analytics:
1. Click Analytics in sidebar
2. Page loads (no redirect)
3. API calls include Authorization header
4. Backend logs show "Token present: true"
5. Data loads or empty states show

---

## Quick Test Script

Run this in browser console after login:
```javascript
// Test if everything is working
const token = localStorage.getItem('itas_token');
const user = JSON.parse(localStorage.getItem('itas_user') || '{}');

console.log('=== TOKEN TEST ===');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length || 0);
console.log('User:', user.username);
console.log('Role:', user.userType);

if (token) {
  console.log('✅ Token is present');
  console.log('Testing API call...');
  
  fetch('http://localhost:8080/api/analytics/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(r => {
    console.log('Response status:', r.status);
    return r.json();
  })
  .then(data => {
    console.log('✅ API call successful!');
    console.log('Data:', data);
  })
  .catch(err => {
    console.error('❌ API call failed:', err);
  });
} else {
  console.error('❌ No token found - please login');
}
```

---

## Summary

Most likely cause: Token not saved or cleared from localStorage

**Quick fix:**
1. Clear browser storage completely
2. Login fresh
3. Verify token is saved
4. Try Analytics again

**If that doesn't work:**
1. Check Network tab for Authorization header
2. Check backend logs for token validation
3. Restart both backend and frontend
4. Try in incognito mode

---

**Status**: Diagnostic guide ready
**Next Step**: Run diagnostic steps above
**Expected Time**: 5 minutes to identify issue
