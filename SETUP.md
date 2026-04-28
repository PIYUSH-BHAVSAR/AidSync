# AidSync Setup Guide

## 🚀 Quick Start (Windows)

1. **Double-click `start-dev.bat`** - This will start both backend and frontend servers automatically

2. **Open your browser** to http://localhost:5173

3. **Login with demo account**:
   - Email: `priya@bharatrelief.org`
   - Password: `demo123`

## 🚀 Quick Start (Linux/Mac)

1. **Run the startup script**:
   ```bash
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

2. **Open your browser** to http://localhost:5173

3. **Login with demo account**:
   - Email: `priya@bharatrelief.org`
   - Password: `demo123`

## 📋 Manual Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python start.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔑 AI Features (Optional)

To enable AI Smart Intake and Translation:

1. Get a Gemini API key from https://aistudio.google.com/
2. Edit `backend/.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Restart the backend server

Without an API key, the system works with mock AI responses.

## 🎯 Demo Accounts

| Role | Email | Password | NGO |
|------|-------|----------|-----|
| NGO Admin | priya@bharatrelief.org | demo123 | Bharat Relief Network (Mumbai) |
| NGO Admin | rahul@sevafoundation.org | demo123 | Seva Foundation (Pune) |
| Volunteer | ankit@volunteer.com | demo123 | Bharat Relief Network |

## 🧪 Testing Features

1. **Create Mission**: Login as NGO Admin → Create Mission → Try AI Smart Intake
2. **Help Feed**: Mark mission as "Need Help" → Check Help Feed
3. **Join Mission**: Login as Volunteer → Browse Missions → Join
4. **Chat**: Go to Chat → Select mission room → Send messages → Try translation
5. **Analytics**: View impact metrics on Analytics page

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **AI**: Google Gemini API
- **Storage**: JSON files (demo)

## 📁 Key Files

- `backend/main.py` - API server
- `backend/data.json` - Mock database
- `frontend/src/pages/` - React pages
- `frontend/src/api.ts` - API client
- `README.md` - Full documentation