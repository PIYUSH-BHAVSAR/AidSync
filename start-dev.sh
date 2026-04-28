#!/bin/bash
echo "Starting AidSync Development Servers..."
echo

echo "[1/2] Starting Backend (FastAPI)..."
cd backend && python start.py &
BACKEND_PID=$!

sleep 3

echo "[2/2] Starting Frontend (React)..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo
echo "✓ Both servers started!"
echo "✓ Backend: http://localhost:8000"
echo "✓ Frontend: http://localhost:5173"
echo "✓ API Docs: http://localhost:8000/docs"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait