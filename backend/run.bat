@echo off
echo ========================================
echo ITAS Tax Education System - Backend
echo ========================================
echo.
echo 1. Make sure you have Java 17+ installed
echo 2. Make sure you have Maven installed
echo.
echo Starting backend...
echo.
mvn spring-boot:run
if errorlevel 1 (
    echo.
    echo Error: Could not start backend
    echo Check if Maven is installed: mvn --version
    echo Check if Java 17+ is installed: java -version
    echo.
    pause
)
