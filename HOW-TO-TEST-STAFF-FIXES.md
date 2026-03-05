# How to Test MOR_STAFF Fixes - Step by Step

## Quick Start (5 Minutes)

### Step 1: Restart Backend (IMPORTANT!)
The CORS fix requires backend restart to take effect.

```bash
# Navigate to backend folder
cd ITAS-system-v2/backend

# Stop current backend (Ctrl+C if running)

# Start backend
mvnw.cmd spring-boot:run
```

Wait for: `Started ItasApplication in X seconds`

### Step 2: Clear Browser Cache
Open browser console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

### Step 3: Login as MOR_STAFF
1. Go to: `http://localhost:5173/login`
2. Enter:
   - Username: `morstaff`
   - Password: `Staff@123`
3. Click "Login"

### Step 4: Verify Dashboard Shows Real Data
You should see:
- ✅ Real course numbers (not 0 or fake data)
- ✅ Enrolled courses with progress bars
- ✅ Compliance tracking section
- ✅ All buttons are clickable

### Step 5: Test Navigation
Click each button and verify it works:
- ✅ "Browse All Courses" → Goes to `/staff/training`
- ✅ "View Certificates" → Goes to `/staff/certificates`
- ✅ "Compliance Report" → Goes to `/staff/compliance`
- ✅ "Play" button on course → Opens course detail

---

## Detailed Testing (15 Minutes)

### Test 1: Dashboard Page

**URL**: `http://localhost:5173/staff/dashboard`

**What to Check:**
1. Stats Cards (Top Row)
   - [ ] Total Courses shows number > 0
   - [ ] Completed shows accurate count
   - [ ] Certificates shows earned count
   - [ ] Compliance Score shows percentage

2. Internal Training Programs Section
   - [ ] Shows enrolled courses (not fake courses)
   - [ ] Progress bars show real percentages
   - [ ] Course titles match database
   - [ ] Status chips show correct state
   - [ ] "Play" button navigates to course

3. Compliance Tracking Section
   - [ ] Shows calculated compliance items
   - [ ] Status badges match progress
   - [ ] Descriptions are accurate

4. Quick Actions
   - [ ] All 4 buttons are clickable
   - [ ] Each button navigates correctly

**Expected Console Output:**
```
Fetching staff dashboard for user: 2
Fetching enrollments...
Enrollments loaded: X courses
Compliance calculated
```

**If You See Errors:**
- Check backend is running on port 8080
- Verify token exists: `localStorage.getItem('itas_token')`
- Check console for CORS errors

---

### Test 2: Internal Training Page

**URL**: `http://localhost:5173/staff/training`

**What to Check:**
1. Loading State
   - [ ] Spinner appears briefly while loading
   - [ ] Then shows course list

2. Stats Cards
   - [ ] Total Courses = all courses in database
   - [ ] Completed = courses with 100% progress
   - [ ] In Progress = courses with 1-99% progress
   - [ ] Mandatory = count of mandatory courses

3. Course List
   - [ ] All courses from database displayed
   - [ ] Enrolled courses show progress bars
   - [ ] Non-enrolled courses show 0%
   - [ ] Status badges are correct:
     - Green = Completed (100%)
     - Blue = In Progress (1-99%)
     - Yellow = Not Started (0%)

4. Actions
   - [ ] "Start" button on new courses
   - [ ] "Continue" button on in-progress
   - [ ] Download icon on completed
   - [ ] Buttons navigate to course detail

**Expected Behavior:**
- If you have 0 enrollments → All courses show "Not Started"
- If you have enrollments → Progress matches database
- Clicking course navigates to `/courses/{id}`

---

### Test 3: Compliance Page

**URL**: `http://localhost:5173/staff/compliance`

**What to Check:**
1. Loading State
   - [ ] Spinner appears while loading
   - [ ] Then shows compliance dashboard

2. Alerts (Top)
   - [ ] Red alert if overdue items exist
   - [ ] Yellow alert if warnings exist
   - [ ] No alerts if all compliant

3. Stats Cards
   - [ ] Compliance Score calculated correctly
   - [ ] Compliant count = 100% courses
   - [ ] Due Soon count = 50-99% courses
   - [ ] Overdue count = 0-49% courses

4. Compliance Items List
   - [ ] One item per enrollment
   - [ ] Status matches progress:
     - Green (Compliant) = 100%
     - Yellow (Warning) = 50-99%
     - Red (Overdue) = 0-49%
   - [ ] Descriptions are accurate
   - [ ] Mandatory badges on first 3

5. Empty State
   - [ ] If no enrollments, shows info message
   - [ ] Message: "No compliance items found..."

**Compliance Score Formula:**
```
Score = (Completed Mandatory / Total Mandatory) × 100
```

---

### Test 4: Certificates Page

**URL**: `http://localhost:5173/staff/certificates`

**What to Check:**
1. Stats Cards
   - [ ] Total Certificates count
   - [ ] Active certificates count
   - [ ] Average score calculated
   - [ ] 100% verified badge

2. Certificate Cards
   - [ ] Shows earned certificates
   - [ ] Certificate numbers displayed
   - [ ] Issued dates formatted
   - [ ] Score badges shown

3. Actions
   - [ ] Download button (shows alert for now)
   - [ ] Share button (copies link)
   - [ ] Print button (opens print dialog)

**Expected Behavior:**
- If no certificates → Shows info message
- If certificates exist → Shows cards with details
- Download shows: "Certificate download will be implemented..."
- Share copies: `http://localhost:5173/verify/{certNumber}`

---

## Common Issues & Solutions

### Issue 1: "No data showing" or "0 courses"
**Cause**: User has no enrollments
**Solution**: 
1. Login as CONTENT_ADMIN (`contentadmin` / `Content@123`)
2. Create some courses
3. Login as MOR_STAFF
4. Enroll in courses from course catalog
5. Refresh staff pages

### Issue 2: "CORS error in console"
**Cause**: Backend not restarted after CORS fix
**Solution**:
```bash
# Stop backend (Ctrl+C)
# Restart backend
cd ITAS-system-v2/backend
mvnw.cmd spring-boot:run
```

### Issue 3: "401 Unauthorized"
**Cause**: Token expired or invalid
**Solution**:
```javascript
// Clear storage and re-login
localStorage.clear();
location.reload();
// Then login again
```

### Issue 4: "Loading forever"
**Cause**: Backend not running or wrong port
**Solution**:
1. Check backend: `http://localhost:8080/courses`
2. Should return JSON, not error
3. If error, restart backend

### Issue 5: "Mock data still showing"
**Cause**: Browser cache not cleared
**Solution**:
```javascript
// Hard refresh
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

---

## Verification Checklist

### Before Testing
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Database has courses
- [ ] Browser cache cleared
- [ ] Console open (F12) to see logs

### During Testing
- [ ] No console errors (red text)
- [ ] API calls succeed (check Network tab)
- [ ] Data loads within 2 seconds
- [ ] All buttons respond to clicks
- [ ] Navigation works correctly

### After Testing
- [ ] All 4 pages tested
- [ ] All features working
- [ ] No errors in console
- [ ] Data is accurate
- [ ] Navigation functional

---

## Success Criteria

✅ **Dashboard**: Shows real enrollments with progress
✅ **Training**: Displays all courses with accurate status
✅ **Compliance**: Calculates real compliance from progress
✅ **Certificates**: Shows earned certificates
✅ **Navigation**: All buttons work correctly
✅ **Loading**: Spinners appear during data fetch
✅ **Errors**: No console errors
✅ **Data**: Consistent across all pages

---

## What Changed (Summary)

### Before Fix
- ❌ Hardcoded fake courses
- ❌ Mock progress data
- ❌ Non-functional buttons
- ❌ Inconsistent data

### After Fix
- ✅ Real courses from database
- ✅ Actual progress from enrollments
- ✅ Functional navigation
- ✅ Consistent real data

---

## Need Help?

### Check These First
1. Backend logs: Look for errors in terminal
2. Browser console: Check for JavaScript errors
3. Network tab: Verify API calls succeed
4. Database: Ensure courses exist

### Console Commands for Debugging
```javascript
// Check if logged in
console.log(localStorage.getItem('itas_user'));

// Check token
console.log(localStorage.getItem('itas_token'));

// Test API manually
fetch('http://localhost:8080/courses', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('itas_token')}`
  }
}).then(r => r.json()).then(console.log);
```

---

## Documentation Files

Created for you:
1. **MOR-STAFF-FIXES.md** - Technical details
2. **QUICK-TEST-GUIDE.md** - Testing instructions
3. **STAFF-PAGES-CHANGELOG.md** - Code changes
4. **STAFF-FIX-SUMMARY.md** - Executive summary
5. **STAFF-DATA-FLOW.md** - Architecture diagrams
6. **HOW-TO-TEST-STAFF-FIXES.md** - This file

---

**Estimated Testing Time**: 15 minutes
**Difficulty**: Easy
**Status**: Ready to Test

Good luck! 🚀
