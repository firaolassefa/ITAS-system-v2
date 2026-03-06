@echo off
echo Stopping existing Java processes on port 9090...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9090') do (
    echo Killing process %%a
    taskkill /F /PID %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo Starting backend on port 9090...
start "ITAS Backend" cmd /k "mvnw.cmd spring-boot:run"

echo Backend is starting...
echo Check the new window for logs
pause
