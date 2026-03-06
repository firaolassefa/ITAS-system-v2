@echo off
echo =====================================================
echo Creating Communication Officer User
echo =====================================================
echo.
echo This will create a Communication Officer user with:
echo Username: commofficer
echo Password: password123
echo Email: commofficer@mor.gov.et
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Connecting to database...
echo.

REM Update these variables with your database connection details
set PGHOST=your-database-host
set PGPORT=5432
set PGDATABASE=your-database-name
set PGUSER=your-database-user

REM Run the SQL script
psql -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -U %PGUSER% -f create-comm-officer.sql

echo.
echo =====================================================
echo Communication Officer User Created!
echo =====================================================
echo.
echo You can now login with:
echo Username: commofficer
echo Password: password123
echo.
echo Press any key to exit...
pause > nul
