@echo off
echo ========================================
echo W3Schools-Style Learning System Setup
echo ========================================
echo.

echo This script will:
echo 1. Apply database migrations
echo 2. Restart the backend server
echo.

echo Step 1: Database Migration
echo --------------------------
echo Please run the following SQL script manually in your PostgreSQL database:
echo.
echo File: add-question-fields.sql
echo.
echo You can run it using:
echo psql -U postgres -d itas_db -f add-question-fields.sql
echo.
pause

echo.
echo Step 2: Restart Backend
echo -----------------------
echo Starting Spring Boot application...
echo.

call mvnw.cmd spring-boot:run

pause
