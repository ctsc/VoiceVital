@echo off
REM Start the VoiceVitals frontend (Windows)

echo ========================================
echo Starting Frontend Development Server
echo ========================================
echo.

cd /d "%~dp0\..\webapp"

if not exist "package.json" (
    echo ERROR: webapp\package.json not found!
    echo Run this script from the VoiceVitals repo.
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
    echo.
)

echo Starting Vite development server...
echo Frontend will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm run dev
