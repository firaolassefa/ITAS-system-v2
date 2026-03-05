# 🔧 Fix CORS Error

## Error You're Seeing:

```
Access to XMLHttpRequest at 'http://localhost:8080/users/1' from origin 'http://localhost:5173' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## Quick Fix (2 Steps)

### Step 1: Restart Backend

The CORS configuration has been updated. You need to restart the backend:

```bash
# Stop the current backend (Ctrl+C in the terminal)

# Then restart:
cd ITAS-system-v2/backend
mvnw.cmd spring-boot:run
```

### Step 2: Clear Browser Cache

```javascript
// Open browser console (F12)
// Run this command:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## What Was Fixed

I updated `WebConfig.java` to expose the Authorization header:

```java
.exposedHeaders("Authorization", "Content-Type")
```

This allows the frontend to read the Authorization header from responses.

---

## All User Credentials

### MOR_STAFF (What you asked for):
**Username:** `morstaff`  
**Password:** `Staff@123`

### All Other Users:
```
taxpayer / Taxpayer@123          (TAXPAYER)
morstaff / Staff@123             (MOR_STAFF) ← YOU NEED THIS
contentadmin / Content@123       (CONTENT_ADMIN)
trainingadmin / Training@123     (TRAINING_ADMIN)
commoffice / Notification@123    (COMM_OFFICER)
manager / Manager@123            (MANAGER)
auditor / Auditor@123            (AUDITOR)
systemadmin / Admin@123          (SYSTEM_ADMIN)
```

---

## Testing After Fix

### 1. Restart Backend
```bash
cd ITAS-system-v2/backend
mvnw.cmd spring-boot:run
```

Wait for: `Started ItasApplication in X seconds`

### 2. Test Login
```
1. Go to: http://localhost:5173/login
2. Username: morstaff
3. Password: Staff@123
4. Click Login
5. Should redirect to Staff Dashboard
```

### 3. Test Profile
```
1. Click on your profile/avatar
2. Go to Profile page
3. Should load without CORS error
```

---

## If CORS Error Persists

### Check 1: Backend is Running
```bash
# Check if backend is running on port 8080
curl http://localhost:8080/api/courses
```

Should return course data, not connection error.

### Check 2: Frontend is Using Correct URL
Check `frontend/.env` or `frontend/vite.config.ts`:
```
VITE_API_URL=http://localhost:8080/api
```

### Check 3: Clear Everything
```bash
# Stop both frontend and backend

# Clear browser completely:
# - Close all tabs
# - Clear cache and cookies
# - Restart browser

# Restart backend:
cd ITAS-system-v2/backend
mvnw.cmd spring-boot:run

# Restart frontend:
cd ITAS-system-v2/frontend
npm run dev
```

---

## React Router Warning (Not Critical)

The warning about `v7_relativeSplatPath` is just a deprecation warning. It doesn't affect functionality.

To fix it (optional), update `App.tsx`:

```typescript
<BrowserRouter
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
>
  {/* Your routes */}
</BrowserRouter>
```

---

## Summary

1. ✅ CORS config updated in `WebConfig.java`
2. ✅ Restart backend to apply changes
3. ✅ Clear browser cache
4. ✅ Login with: `morstaff` / `Staff@123`

**The CORS error should be fixed after restarting the backend!** 🎉

