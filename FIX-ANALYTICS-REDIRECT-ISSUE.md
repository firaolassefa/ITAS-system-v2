# Fix: Analytics Page Redirecting to Login

## Problem
When clicking on Analytics in the sidebar, the page redirects back to the login page.

## Root Cause
The new analytics endpoints (`/analytics/user-engagement`, `/analytics/resource-stats`, `/analytics/key-insights`) don't exist yet because the backend hasn't been restarted. When the frontend tries to call these endpoints:
1. Backend returns 404 (Not Found) or 401 (Unauthorized)
2. Axios interceptor catches the error
3. Redirects to login page automatically

## Solution: Restart Backend

### Step 1: Stop Current Backend
If backend is running, press `Ctrl+C` in the terminal

### Step 2: Start Backend with New Endpoints
```bash
cd ITAS-system-v2/backend
.\mvnw.cmd spring-boot:run
```

Wait for:
```
Started ItasApplication in X.XXX seconds
```

### Step 3: Clear Browser Cache
Open browser console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

### Step 4: Login Again
- Username: `systemadmin`
- Password: `Admin@123`

### Step 5: Test Analytics
Click "Analytics" in the sidebar - should now work!

---

## Alternative: Temporary Fix (If Can't Restart Backend)

If you can't restart the backend right now, you can temporarily disable the redirect by modifying the axios interceptor:

### Edit: `frontend/src/utils/axiosConfig.ts`

Change line 28-38 from:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed - token may be expired');
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('itas_token');
        localStorage.removeItem('itas_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

To:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed - token may be expired');
      // Don't redirect if on analytics page (endpoints not ready yet)
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/analytics')) {
        localStorage.removeItem('itas_token');
        localStorage.removeItem('itas_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

This will prevent redirect on Analytics page, allowing you to see empty states instead.

**Note**: This is temporary - you still need to restart backend for real data!

---

## Verification

After restarting backend, Analytics page should show:

### If Database Has Data:
- Real numbers in overview cards
- Real courses in table
- Real engagement data
- Real resource stats
- Real insights

### If Database Is Empty:
- Empty state messages with icons
- "No engagement data available"
- "No resource data available"
- "No insights available"

### Should NOT Show:
- Login page redirect
- 401 errors in console
- Blank white page

---

## Why This Happened

1. We added 3 new backend endpoints in `AnalyticsController.java`
2. Backend was compiled successfully
3. But backend server wasn't restarted
4. Old backend is still running without new endpoints
5. Frontend tries to call new endpoints
6. Backend returns 404/401 (endpoint doesn't exist)
7. Axios interceptor redirects to login

**Solution**: Always restart backend after adding new endpoints!

---

## Quick Commands

### Windows (PowerShell/CMD):
```bash
# Stop backend: Ctrl+C in backend terminal

# Start backend:
cd ITAS-system-v2/backend
.\mvnw.cmd spring-boot:run

# Clear browser cache (in browser console):
localStorage.clear(); location.reload();
```

---

## Expected Console Output (After Fix)

### Before Backend Restart:
```
Error fetching user engagement: AxiosError
Error fetching resource stats: AxiosError
Error fetching key insights: AxiosError
Authentication failed - token may be expired
[Redirects to login]
```

### After Backend Restart:
```
Analytics loaded successfully
User engagement: [array of data or empty]
Resource stats: [array of data or empty]
Key insights: [array of data or empty]
[No redirect, page works normally]
```

---

## Summary

✅ Backend code is correct and compiles
✅ Frontend code is correct
❌ Backend server needs restart to load new endpoints
🔧 Restart backend to fix the issue

**Status**: Waiting for backend restart
**Priority**: HIGH
**Time to Fix**: 2-3 minutes (restart backend)
