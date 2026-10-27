@echo off
REM Start the VoiceVitals FastAPI server (Windows)

echo ========================================
echo Starting Backend API Server
echo ========================================
echo.

cd /d "%~dp0\.."

if not exist "backend\api\main.py" (
    echo ERROR: backend\api\main.py not found!
    echo Run this script from the VoiceVitals repo.
    pause
    exit /b 1
)

if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else if exist ".venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call .venv\Scripts\activate.bat
) else (
    echo WARNING: Virtual environment not found!
    echo Creating one now...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installing dependencies...
    pip install -r requirements.txt
)

echo.
echo Starting FastAPI server...
echo API will be available at http://localhost:8001
echo API docs available at http://localhost:8001/docs
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8001 --reload
