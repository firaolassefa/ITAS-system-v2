@echo off
echo Fixing taxpayer password in database...
echo.

set PGPASSWORD=npg_sCb7FRYEPhL0

psql "postgresql://neondb_owner@ep-hidden-king-aiwufvo3-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'taxpayer';"

echo.
echo Password updated! Now you can login with:
echo Username: taxpayer
echo Password: password123
echo.
pause
