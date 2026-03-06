@echo off
echo ========================================
echo Git Commit and Push Script
echo ========================================
echo.

REM Navigate to project root
cd /d "%~dp0"

echo Current directory: %CD%
echo.

REM Add all changes
echo Adding all changes...
git add .
echo.

REM Commit with message
echo Committing changes...
git commit -m "Fix CI/CD pipeline, implement email/SMS, fix port configuration, and improve dark mode"
echo.

REM Push to remote
echo Pushing to remote...
git push
echo.

echo ========================================
echo Done!
echo ========================================
pause
