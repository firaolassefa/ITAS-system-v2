# 🔑 All User Credentials for ITAS System

## Default User Accounts

All passwords follow the pattern: `{Role}@123`

---

## 1. TAXPAYER (Tax Agent)
**Username:** `taxpayer`  
**Password:** `Taxpayer@123`  
**Role:** TAXPAYER / TAX_AGENT  
**Can Access:**
- Enroll in courses
- Take quizzes and exams
- View certificates
- Access taxpayer dashboard

---

## 2. MOR_STAFF (Ministry of Revenue Staff)
**Username:** `morstaff`  
**Password:** `Staff@123`  
**Role:** MOR_STAFF  
**Can Access:**
- Internal training courses
- Staff dashboard
- Compliance training
- View own progress

---

## 3. CONTENT_ADMIN (Content Administrator)
**Username:** `contentadmin`  
**Password:** `Content@123`  
**Role:** CONTENT_ADMIN  
**Can Access:**
- Create/edit/delete courses
- Create/edit/delete modules
- Upload videos and PDFs
- Create/edit/delete questions
- Manage course content

---

## 4. TRAINING_ADMIN (Training Administrator)
**Username:** `trainingadmin`  
**Password:** `Training@123`  
**Role:** TRAINING_ADMIN  
**Can Access:**
- Create/manage webinars
- Create questions
- Manage training programs
- View training analytics

---

## 5. COMM_OFFICER (Communication Officer)
**Username:** `commoffice`  
**Password:** `Notification@123`  
**Role:** COMM_OFFICER  
**Can Access:**
- Send notifications
- Create notification campaigns
- View notification statistics
- Manage communication

---

## 6. MANAGER
**Username:** `manager`  
**Password:** `Manager@123`  
**Role:** MANAGER  
**Can Access:**
- View analytics dashboard
- Export reports
- View all statistics
- **READ-ONLY** (cannot edit anything)

---

## 7. AUDITOR
**Username:** `auditor`  
**Password:** `Auditor@123`  
**Role:** AUDITOR  
**Can Access:**
- View system logs
- View audit trails
- View all reports
- View analytics
- **READ-ONLY** (cannot modify anything)

---

## 8. SYSTEM_ADMIN (System Administrator)
**Username:** `systemadmin`  
**Password:** `Admin@123`  
**Role:** SYSTEM_ADMIN  
**Can Access:**
- **EVERYTHING**
- Manage users
- Assign roles
- Manage courses
- View analytics
- System configuration
- Full access to all features

---

## Quick Reference Table

| Username | Password | Role | Primary Function |
|----------|----------|------|------------------|
| taxpayer | Taxpayer@123 | TAXPAYER | Learn & get certificates |
| morstaff | Staff@123 | MOR_STAFF | Internal training |
| contentadmin | Content@123 | CONTENT_ADMIN | Manage courses & content |
| trainingadmin | Training@123 | TRAINING_ADMIN | Manage webinars & training |
| commoffice | Notification@123 | COMM_OFFICER | Send notifications |
| manager | Manager@123 | MANAGER | View analytics (read-only) |
| auditor | Auditor@123 | AUDITOR | View logs (read-only) |
| systemadmin | Admin@123 | SYSTEM_ADMIN | Full system access |

---

## Testing Each Role

### Test TAXPAYER:
```
1. Login: taxpayer / Taxpayer@123
2. Go to: My Courses
3. Enroll in a course
4. Complete modules
5. Take final exam
6. Get certificate
```

### Test MOR_STAFF:
```
1. Login: morstaff / Staff@123
2. Go to: Staff Dashboard
3. View internal training
4. Complete compliance courses
5. View progress
```

### Test CONTENT_ADMIN:
```
1. Login: contentadmin / Content@123
2. Go to: Course Management
3. Create a new course
4. Add modules
5. Upload content
6. Create questions
```

### Test TRAINING_ADMIN:
```
1. Login: trainingadmin / Training@123
2. Go to: Webinar Management
3. Create a webinar
4. Schedule training
5. View registrations
```

### Test COMM_OFFICER:
```
1. Login: commoffice / Notification@123
2. Go to: Notification Center
3. Send a notification
4. View notification stats
5. Create campaign
```

### Test MANAGER:
```
1. Login: manager / Manager@123
2. Go to: Analytics Dashboard
3. View statistics
4. Export reports
5. Verify cannot edit anything
```

### Test AUDITOR:
```
1. Login: auditor / Auditor@123
2. Go to: Analytics Dashboard
3. View system logs
4. View reports
5. Verify cannot modify anything
```

### Test SYSTEM_ADMIN:
```
1. Login: systemadmin / Admin@123
2. Access all pages
3. Manage users
4. Manage courses
5. View analytics
6. Verify full access
```

---

## Password Pattern

All passwords follow this pattern:
```
{RoleName}@123
```

Examples:
- Taxpayer → `Taxpayer@123`
- Staff → `Staff@123`
- Content → `Content@123`
- Admin → `Admin@123`

---

## Creating New Users

### As SYSTEM_ADMIN:

1. Login as `systemadmin` / `Admin@123`
2. Go to **User Role Management**
3. Click **Add User**
4. Fill in:
   - Username
   - Password (min 6 characters)
   - Full Name
   - Email
   - User Type (select role)
5. Click **Create User**

---

## Resetting Passwords

### As SYSTEM_ADMIN:

1. Login as `systemadmin`
2. Go to **User Role Management**
3. Find the user
4. Click **Edit**
5. Enter new password
6. Click **Update**

### As Any User (Own Password):

1. Login with your account
2. Go to **Profile**
3. Click **Change Password**
4. Enter:
   - Current password
   - New password
   - Confirm new password
5. Click **Update Password**

---

## Security Notes

### Default Passwords:
- ⚠️ These are DEFAULT passwords for testing
- 🔒 Change them in production!
- 📝 Use strong passwords in production

### Password Requirements:
- Minimum 6 characters
- Mix of letters and numbers recommended
- Special characters allowed

### Account Security:
- Passwords are hashed with BCrypt
- JWT tokens expire after session
- Failed login attempts logged

---

## Troubleshooting Login

### "Invalid credentials":
- Check username (case-sensitive)
- Check password (case-sensitive)
- Verify caps lock is off

### "Account disabled":
- Contact system administrator
- Admin can re-enable in User Management

### "Session expired":
- Token expired
- Login again
- Tokens last for session duration

---

## For Your Current Issue

You asked for **MOR_STAFF** credentials:

**Username:** `morstaff`  
**Password:** `Staff@123`

**To test:**
```
1. Logout from current account
2. Go to login page
3. Enter: morstaff
4. Enter: Staff@123
5. Click Login
6. You should see Staff Dashboard
```

---

## All Credentials at a Glance

```
taxpayer / Taxpayer@123
morstaff / Staff@123
contentadmin / Content@123
trainingadmin / Training@123
commoffice / Notification@123
manager / Manager@123
auditor / Auditor@123
systemadmin / Admin@123
```

**Copy and paste these for quick testing!** 📋

