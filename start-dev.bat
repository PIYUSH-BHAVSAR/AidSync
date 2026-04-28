@echo off
echo Starting AidSync Development Servers...
echo.

echo [1/2] Starting Backend (FastAPI)...
start "AidSync Backend" cmd /k "cd backend && python start.py"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (React)...
start "AidSync Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✓ Both servers starting...
echo ✓ Backend: http://localhost:8000
echo ✓ Frontend: http://localhost:5173
echo ✓ API Docs: http://localhost:8000/docs
echo.
pause