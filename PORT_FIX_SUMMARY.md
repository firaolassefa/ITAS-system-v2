# Port Configuration Fix

## ❌ Problem Found

The frontend was using **port 8080** but the backend runs on **port 9090**!

This would cause all API calls to fail with connection errors.

## ✅ Fixed Files

### 1. `frontend/src/utils/axiosConfig.ts`
**Before:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

**After:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api';
```

### 2. `frontend/src/utils/constants.ts`
**Before:**
```typescript
export const API_BASE_URL = 'http://localhost:8080/api';
```

**After:**
```typescript
export const API_BASE_URL = 'http://localhost:9090/api';
```

### 3. `frontend/.env` ✅ Already Correct
```
VITE_API_URL=http://localhost:9090/api
```

## 🎯 Port Configuration Summary

| Component | Port | Status |
|-----------|------|--------|
| Backend API | 9090 | ✅ Correct |
| Frontend Dev Server | 5173 | ✅ Correct |
| Frontend API Calls | 9090 | ✅ Fixed |

## 🚀 How to Commit and Push

### Option 1: Use the Batch File (Easiest)
```bash
# Just double-click this file:
GIT_COMMANDS.bat
```

### Option 2: Manual Commands
```bash
# Make sure you're in the project root (not backend folder)
cd "C:\Users\Wellcome\Videos\iot\New folder\ITAS-system-v2"

# Add all changes
git add .

# Commit
git commit -m "Fix CI/CD pipeline, implement email/SMS, fix port configuration, and improve dark mode"

# Push
git push
```

## 📝 What This Fixes

1. **API Connection Issues** - Frontend will now connect to the correct backend port
2. **Login Issues** - Authentication will work properly
3. **All API Calls** - Every API request will go to the right port
4. **Development Experience** - No more connection errors

## ⚠️ Important Notes

- The `.env` file was already correct (port 9090)
- The issue was in the fallback values in TypeScript files
- Both files needed to be updated for consistency
- After this fix, restart your frontend dev server:
  ```bash
  cd frontend
  npm run dev
  ```

## 🧪 How to Test

1. **Restart frontend** (if running):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Check browser console** - Should see:
   ```
   API calls going to: http://localhost:9090/api
   ```

3. **Try logging in** - Should work now!

4. **Check Network tab** - All requests should go to port 9090

## ✨ Summary

**Port configuration is now FIXED!** All frontend API calls will correctly use port **9090** to match the backend server.

This was a critical fix - without it, the frontend couldn't communicate with the backend at all!
