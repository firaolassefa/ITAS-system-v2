# Testing Analytics with Real Data - Quick Guide

## Prerequisites
- Backend must be restarted to load new endpoints
- Browser cache should be cleared
- Database should have some data (courses, enrollments, resources)

---

## Step 1: Restart Backend

Open terminal in backend folder:
```bash
cd ITAS-system-v2/backend
.\mvnw.cmd spring-boot:run
```

Wait for:
```
Started ItasApplication in X.XXX seconds
```

---

## Step 2: Clear Browser Cache

Open browser console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

---

## Step 3: Login

Navigate to: `http://localhost:5173`

Login as System Admin:
- Username: `systemadmin`
- Password: `Admin@123`

---

## Step 4: Navigate to Analytics

Click "Analytics" in the sidebar

---

## Step 5: Verify Real Data

### Check 1: Overview Stats (Top Cards)
✅ Should show real numbers from database:
- Total Users (from users table)
- Active Users (users where active=true)
- Enrollments (from enrollments table)
- Completion Rate (calculated from enrollments)

❌ Should NOT show:
- Hardcoded numbers like 456, 389, 234, 187
- Fake percentages

### Check 2: Top Performing Courses (Table)
✅ Should show:
- Real course titles from database
- Actual enrollment counts
- Calculated completion rates
- Empty state if no courses

❌ Should NOT show:
- "VAT Fundamentals for Beginners" (unless it exists in DB)
- "Income Tax Calculation" (unless it exists in DB)
- Fake course names

### Check 3: User Engagement by Tax Category (Table)
✅ Should show:
- Real course categories from database
- Actual unique user counts per category
- Calculated completion rates
- Empty state with icon if no data

❌ Should NOT show:
- Hardcoded "VAT: 456 users"
- Hardcoded "Income Tax: 389 users"
- Fake engagement numbers

### Check 4: Resource Statistics (Cards)
✅ Should show:
- Real resource types from database (PDF, VIDEO, etc.)
- Actual resource counts
- Real download numbers
- Empty state with icon if no resources

❌ Should NOT show:
- "PDF: 28 count, 2,345 downloads" (unless real)
- "Video: 12 count, 1,567 downloads" (unless real)
- Fake resource stats

### Check 5: Key Insights (Cards)
✅ Should show:
- Calculated insights based on real completion rates
- Real user counts
- Recommendations based on actual data
- Empty state with icon if no data

❌ Should NOT show:
- "VAT courses show 78% completion rate" (unless calculated)
- "12% user growth this month" (unless calculated)
- Fake insights

---

## Expected Results

### Scenario A: Database Has Data

**User Engagement Table**:
```
Category        Active Users    Avg. Time    Completion
VAT             5               30 min       60%
Income Tax      3               25 min       75%
```
(Numbers will vary based on your actual data)

**Resource Statistics**:
```
PDF     Count: 10    Downloads: 150
VIDEO   Count: 5     Downloads: 80
```
(Numbers will vary based on your actual data)

**Key Insights**:
```
✓ Overall completion rate is 65%
ℹ 8 total users in the system
⚠ Tax Basics has 40% completion rate
💡 Consider adding more interactive content
```
(Insights will vary based on your actual data)

### Scenario B: Database Is Empty

**User Engagement**:
```
[Icon]
No engagement data available
```

**Resource Statistics**:
```
[Icon]
No resource data available
```

**Key Insights**:
```
[Icon]
No insights available
```

---

## Common Issues

### Issue 1: Still Seeing Mock Data
**Cause**: Backend not restarted
**Solution**: 
1. Stop backend (Ctrl+C)
2. Restart: `.\mvnw.cmd spring-boot:run`
3. Clear browser cache
4. Refresh page

### Issue 2: Empty States Everywhere
**Cause**: Database has no data
**Solution**: 
1. Add some courses via Course Management
2. Enroll users in courses
3. Upload some resources
4. Refresh Analytics page

### Issue 3: CORS Error
**Cause**: Backend not running or wrong port
**Solution**:
1. Check backend is running on port 8080
2. Check frontend is running on port 5173
3. Restart both if needed

### Issue 4: 403 Forbidden
**Cause**: Not logged in as admin
**Solution**:
1. Logout
2. Login as systemadmin/Admin@123
3. Try again

---

## API Endpoint Testing (Optional)

You can test endpoints directly using browser or Postman:

### Test User Engagement
```
GET http://localhost:8080/analytics/user-engagement
Authorization: Bearer <your-token>
```

### Test Resource Stats
```
GET http://localhost:8080/analytics/resource-stats
Authorization: Bearer <your-token>
```

### Test Key Insights
```
GET http://localhost:8080/analytics/key-insights
Authorization: Bearer <your-token>
```

---

## Success Criteria

✅ No hardcoded numbers visible
✅ All data comes from database
✅ Empty states show when no data
✅ Numbers change when database changes
✅ No console errors
✅ Page loads without crashes

---

## Rollback (If Needed)

If something goes wrong, you can rollback:

1. **Backend**: Revert AnalyticsController.java
2. **Frontend**: Revert analytics.ts
3. **Restart**: Both backend and frontend

---

## Next Steps After Testing

1. ✅ Verify all data is real
2. ✅ Test with different user roles
3. ✅ Add more courses/enrollments if needed
4. ✅ Monitor performance with larger datasets
5. ✅ Consider adding more insights

---

**Date**: March 4, 2026
**Status**: Ready for Testing
**Priority**: HIGH
**Estimated Test Time**: 10-15 minutes
