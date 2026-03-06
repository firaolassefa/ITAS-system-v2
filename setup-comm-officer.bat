@echo off
echo ======================================================
echo Setting up Communication Officer User
echo ======================================================
echo.

echo Checking if backend is running on port 9090...
curl -s http://localhost:9090/api/health > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Backend is not running on port 9090
    echo.
    echo Please start the backend first:
    echo   cd backend
    echo   mvnw spring-boot:run
    echo.
    pause
    exit /b 1
)

echo [OK] Backend is running!
echo.

echo Setting password for commofficer user...
curl -X POST http://localhost:9090/api/auth/fix-password/commofficer
echo.
echo.

echo ======================================================
echo Communication Officer User Ready!
echo ======================================================
echo.
echo Login Credentials:
echo   Username: commofficer
echo   Password: password123
echo   Email: commofficer@mor.gov.et
echo   Role: COMM_OFFICER
echo.
echo Dashboard URL:
echo   http://localhost:5173/admin/comm-dashboard
echo.
echo You can now login at: http://localhost:5173/login
echo.
echo ======================================================
echo.
pause
