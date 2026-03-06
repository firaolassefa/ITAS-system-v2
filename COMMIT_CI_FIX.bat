@echo off
echo Committing CI/CD Test Fix...

git add .
git commit -m "Fix CI/CD backend tests - use H2 test profile

- Created application-test.properties with H2 configuration
- Updated ItasApplicationTests to use test profile
- Removed PostgreSQL service from CI/CD workflow
- Tests now use H2 in-memory database consistently
- Fixed test failures in GitHub Actions pipeline"

echo.
echo Pushing to GitHub...
git push

echo.
echo Done! Check GitHub Actions for test results.
pause
