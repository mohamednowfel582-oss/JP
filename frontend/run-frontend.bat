@echo off
echo ===================================================
echo  Starting Complaint Management System Frontend
echo ===================================================

cd /d "%~dp0"

echo Launching Vite Dev Server on http://localhost:5173 ...
npm run dev -- --host 0.0.0.0 --port 5173
