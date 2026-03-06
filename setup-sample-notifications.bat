@echo off
echo ======================================================
echo Adding Sample Notification Campaigns
echo ======================================================
echo.
echo This will add realistic notification campaigns with:
echo - Tax Season Reminders
echo - Course Announcements
echo - Webinar Invitations
echo - System Notifications
echo - And more...
echo.
echo All with realistic sent/opened counts
echo.
pause

echo.
echo Please run this SQL script in your database:
echo   backend/add-sample-notifications.sql
echo.
echo For Neon Database:
echo   1. Go to your Neon dashboard
echo   2. Open SQL Editor
echo   3. Copy contents of backend/add-sample-notifications.sql
echo   4. Click Run
echo.
echo After running the script, refresh the Communication Officer dashboard
echo to see the realistic notification data.
echo.
pause
