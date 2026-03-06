# =====================================================
# Setup Communication Officer User
# =====================================================
# This script will set the password for the commofficer user
# to 'password123' using the backend API
# =====================================================

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Setting up Communication Officer User" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "Checking if backend is running on port 9090..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9090/api/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is not running on port 9090" -ForegroundColor Red
    Write-Host "Please start the backend first, then run this script again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To start backend:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  mvnw spring-boot:run" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "Setting password for commofficer user..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:9090/api/auth/fix-password/commofficer" -Method POST
    Write-Host "✓ Password set successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "Communication Officer User Ready!" -ForegroundColor Cyan
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Login Credentials:" -ForegroundColor Green
    Write-Host "  Username: commofficer" -ForegroundColor White
    Write-Host "  Password: password123" -ForegroundColor White
    Write-Host "  Email: commofficer@mor.gov.et" -ForegroundColor White
    Write-Host "  Role: COMM_OFFICER" -ForegroundColor White
    Write-Host ""
    Write-Host "Dashboard URL:" -ForegroundColor Green
    Write-Host "  http://localhost:5173/admin/comm-dashboard" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now login at: http://localhost:5173/login" -ForegroundColor Yellow
    Write-Host ""
} catch {
    Write-Host "✗ Failed to set password" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. Backend is running on port 9090" -ForegroundColor White
    Write-Host "  2. Database connection is working" -ForegroundColor White
    Write-Host "  3. User 'commofficer' exists in database" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press Enter to exit..."
Read-Host
