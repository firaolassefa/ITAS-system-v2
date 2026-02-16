@echo off
echo ========================================
echo ITAS Backend - Starting with Maven Wrapper
echo ========================================
echo.

echo Checking Java...
java -version
if errorlevel 1 (
    echo ERROR: Java not found!
    pause
    exit /b 1
)

echo.
echo Starting backend with Maven Wrapper...
echo This will download Maven automatically...
echo.

call mvnw.cmd spring-boot:run

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start backend
    echo Try running manually: .\mvnw.cmd clean spring-boot:run
    pause
)
