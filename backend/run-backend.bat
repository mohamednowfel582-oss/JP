@echo off
cd /d "%~dp0"

echo ===================================================
echo  Starting Complaint Management System Backend
echo ===================================================

if not exist bin (
    echo Compiling first...
    call build-backend.bat
)

echo Running Server on http://localhost:8080 ...
java -cp "bin;lib/*" com.cms.Server %*
