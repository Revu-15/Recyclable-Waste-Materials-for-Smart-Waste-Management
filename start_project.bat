@echo off
title EcoSort AI - Launcher
echo =====================================================================
echo    EcoSort AI - Smart Recyclable Waste Management System Launcher
echo =====================================================================
echo.
echo Launching services...
echo.

:: 1. Launch Flask Backend
echo [1/2] Starting Flask Backend Server (Port 5000)...
start "EcoSort AI - Flask Server" cmd /k "title EcoSort AI - Backend Server && echo Starting Flask server on http://localhost:5000/ ... && set PYTHONPATH=. && python backend/app.py"

:: 2. Launch Vite React Frontend
echo [2/2] Starting Vite React Dev Server...
start "EcoSort AI - React Frontend" cmd /k "title EcoSort AI - Frontend Dev Server && echo Starting Vite development server... && cd frontend && set Path=%%Path%%;C:\Program Files\nodejs && npm run dev"

echo.
echo =====================================================================
echo Services have been triggered in separate terminal windows!
echo - API Backend: http://localhost:5000/api/health
echo - Web Application UI: Check the Vite console window for the Local URL
echo =====================================================================
echo.
pause
