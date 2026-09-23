@echo off
title Complaint Management System - Full Stack Portal
echo ======================================================================
echo           SMART COMPLAINT MANAGEMENT SYSTEM PORTAL
echo ======================================================================
echo.
echo 1. Starting Java REST Backend Server on http://localhost:8080 ...
start "CMS Backend Server [Port 8080]" cmd /k "cd /d %~dp0\backend && run-backend.bat"

timeout /t 3 /nobreak >nul

echo 2. Starting React Modern Frontend on http://localhost:5173 ...
start "CMS Frontend Portal [Port 5173]" cmd /k "cd /d %~dp0\frontend && run-frontend.bat"

echo.
echo ======================================================================
echo Application is now booting!
echo  - Frontend Web App:  http://localhost:5173
echo  - Backend REST API:  http://localhost:8080
echo  - SQLite Database:   database\cms.db
echo.
echo Default Accounts:
echo  - Student: STU1001 / student123
echo  - Admin:   admin   / admin123
echo ======================================================================
echo.
pause
