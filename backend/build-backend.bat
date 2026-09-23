@echo off
echo ===================================================
echo  Building Complaint Management System Backend
echo ===================================================

cd /d "%~dp0"

if not exist bin mkdir bin

echo Compiling Java source files...
javac -cp "lib/*" -d bin src/com/cms/*.java src/com/cms/model/*.java src/com/cms/dao/*.java src/com/cms/service/*.java src/com/cms/security/*.java src/com/cms/http/*.java src/com/cms/http/handlers/*.java src/com/cms/original/*.java

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Backend build completed successfully!
) else (
    echo.
    echo [ERROR] Compilation failed.
    exit /b %ERRORLEVEL%
)
