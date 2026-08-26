#!/usr/bin/env bash
set -e

echo "==================================================="
echo "  LAUNCHING THE LENNY GROWTH ASSISTANT (LOCAL)     "
echo "==================================================="

echo "[1/3] Installing Python dependencies..."
python3 -m pip install -r backend/requirements.txt -q

echo "[2/3] Starting FastAPI Backend on http://localhost:8000..."
(cd backend && python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) &
BACKEND_PID=$!

echo "[3/3] Starting React + Vite Frontend on http://localhost:3000..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "🚀 Application is running!"
echo "👉 Frontend UI: http://localhost:3000"
echo "👉 Backend API & Docs: http://localhost:8000/docs"
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
