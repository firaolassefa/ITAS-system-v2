@echo off
echo Adding real notifications to database...
echo.

REM Update these variables with your database connection details
set PGHOST=your-neon-host.neon.tech
set PGDATABASE=your-database-name
set PGUSER=your-username
set PGPASSWORD=your-password
set PGPORT=5432

REM Run the SQL script
psql -h %PGHOST% -U %PGUSER% -d %PGDATABASE% -p %PGPORT% -f add-real-notifications.sql

echo.
echo Done! Notifications have been added to the database.
echo You can now view and delete them in the Notification Center.
pause
