@echo off
echo ===================================================
echo   LAUNCHING THE LENNY GROWTH ASSISTANT (LOCAL)
echo ===================================================

echo [1/3] Checking dependencies...
python -m pip install -r backend\requirements.txt -q

echo [2/3] Starting FastAPI Backend on http://localhost:8000...
start cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [3/3] Starting React + Vite Frontend on http://localhost:3000...
start cmd /k "cd frontend && npm.cmd run dev"

echo.
echo Application is running!
echo Frontend: http://localhost:3000
echo Backend API Docs: http://localhost:8000/docs
echo.
pause
