# Quick Testing Guide - MOR_STAFF Real Data Integration

## Prerequisites
1. ✅ Backend running on `http://localhost:8080`
2. ✅ Frontend running on `http://localhost:5173`
3. ✅ Database populated with courses and enrollments

## Test Steps

### Step 1: Login as MOR_STAFF
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Username: `morstaff`
   - Password: `Staff@123`
3. Click "Login"
4. Should redirect to `/staff/dashboard`

### Step 2: Test Dashboard (Real Data)
**What to Check:**
- [ ] Stats cards show real numbers (not 0 or mock data)
- [ ] "Internal Training Programs" section displays enrolled courses
- [ ] Progress bars show actual completion percentages
- [ ] Course titles match courses in database
- [ ] "Compliance Tracking" section shows calculated compliance
- [ ] All quick action buttons are clickable

**Actions to Test:**
1. Click "Play" button on any course → Should navigate to course detail page
2. Click "Browse All Courses" → Should go to `/staff/training`
3. Click "View Certificates" → Should go to `/staff/certificates`
4. Click "Compliance Report" → Should go to `/staff/compliance`

**Expected Data:**
- Total Courses: Count from database
- Completed: Courses with 100% progress
- Certificates: Number of earned certificates
- Compliance Score: Calculated from completion rate

### Step 3: Test Internal Training Page
**Navigate:** Click "Browse All Courses" or go to `/staff/training`

**What to Check:**
- [ ] All courses from database are displayed
- [ ] Enrolled courses show correct progress
- [ ] Non-enrolled courses show 0% progress
- [ ] Stats cards show correct counts
- [ ] Loading spinner appears briefly while fetching data

**Actions to Test:**
1. Click "Start" on a not-started course → Should navigate to course
2. Click "Continue" on in-progress course → Should navigate to course
3. Check completed courses have green checkmark
4. Verify progress bars match enrollment data

**Expected Behavior:**
- If you have 0 enrollments → All courses show "Not Started"
- If you have enrollments → Progress matches database
- Mandatory/Optional badges display correctly

### Step 4: Test Compliance Page
**Navigate:** Click "Compliance Report" or go to `/staff/compliance`

**What to Check:**
- [ ] Compliance items generated from enrollments
- [ ] Compliance score calculated correctly
- [ ] Status badges (Compliant/Warning/Overdue) match progress
- [ ] Alerts appear for overdue/warning items
- [ ] Empty state message if no enrollments

**Status Logic:**
- **Compliant** (Green): 100% progress
- **Warning** (Yellow): 50-99% progress
- **Overdue** (Red): 0-49% progress
- **Pending** (Blue): Not started

**Expected Behavior:**
- If 0 enrollments → Shows "No compliance items found" message
- If enrollments exist → Shows one item per enrollment
- Compliance score = (Completed Mandatory / Total Mandatory) × 100

### Step 5: Test Certificates Page
**Navigate:** Click "View Certificates" or go to `/staff/certificates`

**What to Check:**
- [ ] Certificates fetched from backend
- [ ] Stats show correct counts
- [ ] Certificate cards display properly
- [ ] Download button shows alert (PDF generation not implemented yet)
- [ ] Share button copies verification link

**Actions to Test:**
1. Click "Download" → Should show alert message
2. Click "Share" → Should copy link to clipboard
3. Verify certificate numbers are displayed
4. Check issued dates are formatted correctly

## Troubleshooting

### Issue: "No data showing"
**Solution:**
1. Check browser console for errors
2. Verify backend is running: `http://localhost:8080/courses`
3. Check token in localStorage: `localStorage.getItem('itas_token')`
4. Verify user is logged in: `localStorage.getItem('itas_user')`

### Issue: "CORS error"
**Solution:**
1. Restart backend to apply CORS fixes
2. Clear browser cache: `localStorage.clear(); location.reload();`
3. Check `WebConfig.java` has correct CORS configuration

### Issue: "401 Unauthorized"
**Solution:**
1. Logout and login again
2. Check token is valid
3. Verify user has MOR_STAFF role

### Issue: "Empty arrays/No courses"
**Solution:**
1. Enroll MOR_STAFF user in some courses first
2. Use CONTENT_ADMIN to create courses if none exist
3. Check database has courses: `SELECT * FROM courses;`

## Expected Console Output

### Successful Data Fetch
```
Fetching enrollments for user: 2
Enrollments loaded: 3 courses
Compliance items generated: 3 items
```

### API Calls Made
```
GET http://localhost:8080/courses
GET http://localhost:8080/courses/enrollments/2
GET http://localhost:8080/certificates/user/2
GET http://localhost:8080/dashboard/staff/2
```

## Comparison: Before vs After

### Before (Mock Data)
- Dashboard showed fake courses: "Tax Policy Updates 2024", "Internal Audit Procedures"
- Progress was hardcoded: 75%, 100%, 30%, 0%
- Compliance items were fake: "Annual Ethics Training", "Security Awareness"
- Buttons didn't navigate anywhere

### After (Real Data)
- Dashboard shows actual enrolled courses from database
- Progress reflects real completion from enrollments table
- Compliance items calculated from actual course progress
- All buttons navigate to correct pages
- Data is consistent across all pages

## Success Criteria
✅ All data comes from backend API (no hardcoded arrays)
✅ Progress bars show real completion percentages
✅ Stats cards display accurate counts
✅ Navigation buttons work correctly
✅ Loading states appear during data fetch
✅ Empty states handled gracefully
✅ No console errors
✅ Data is consistent across pages

## Next Actions After Testing
1. If everything works → Mark as complete ✅
2. If issues found → Check browser console and backend logs
3. Test with different users to verify data isolation
4. Test with 0 enrollments to verify empty states
5. Test with completed courses to verify certificate generation

---

**Testing Time**: ~10 minutes
**Priority**: High
**Status**: Ready for Testing
