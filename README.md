# AidSync - Humanitarian Collaboration Platform

AI-powered mission collaboration platform for NGOs and volunteers across India.

## Features

- **NGO Registration & Verification** - Secure onboarding for verified organizations
- **Mission Management** - Create, manage, and track humanitarian missions
- **Help Feed** - Share missions across partner NGOs for collaborative support
- **Volunteer Coordination** - Recruit and manage volunteers efficiently
- **AI Smart Intake** - Extract structured mission data from free text using Gemini AI
- **Real-time Chat** - Multilingual communication with AI translation
- **Analytics Dashboard** - Track impact and operational metrics

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS (custom design system)
- React Router
- Axios for API calls
- Lucide React icons

**Backend:**
- FastAPI (Python)
- JSON file storage (mock database)
- Google Gemini AI integration
- CORS enabled for development

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ and pip

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Optional: Add your Gemini API key for AI features
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Start backend server
python start.py
```

Backend runs on http://localhost:8000

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

### 3. Login & Demo

Use these demo accounts:

- **NGO Admin (Mumbai)**: `priya@bharatrelief.org` / `demo123`
- **NGO Admin (Pune)**: `rahul@sevafoundation.org` / `demo123`  
- **Volunteer**: `ankit@volunteer.com` / `demo123`

## Project Structure

```
├── backend/
│   ├── main.py           # FastAPI application
│   ├── data.json         # Mock database
│   ├── start.py          # Server startup script
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/        # React pages/screens
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth context
│   │   ├── api.ts        # API client
│   │   └── types.ts      # TypeScript types
│   └── package.json      # Node dependencies
└── README.md
```

## Key Features Demo

### 1. AI Smart Intake
- Go to "Create Mission" 
- Paste rough text like: "Need 20 volunteers tomorrow in Hadapsar for food distribution"
- Click "Auto-fill with AI" to extract structured data

### 2. Help Feed
- NGOs can mark missions as "Need Help"
- Other verified NGOs see these in the Help Feed
- Filter by city, category, urgency

### 3. Real-time Chat
- Mission-based chat rooms
- AI translation between Hindi/Marathi/English
- File sharing support

### 4. Analytics
- Track missions created/completed
- Monitor volunteer mobilization
- Measure partner collaborations

## API Endpoints

- `POST /auth/login` - User authentication
- `GET /missions` - List missions
- `POST /missions` - Create mission
- `GET /feed/help` - Help feed for partner NGOs
- `POST /missions/{id}/join` - Volunteer join mission
- `POST /ai/parse-mission` - AI mission extraction
- `POST /ai/translate` - AI text translation

## Development Notes

- Backend uses JSON file storage for simplicity (replace with PostgreSQL for production)
- AI features require Gemini API key (graceful fallback to mock responses)
- CORS configured for local development
- TypeScript strict mode enabled
- Tailwind with custom design system based on "Operational Integrity" theme

## Production Deployment

**Frontend**: Deploy to Vercel/Netlify
**Backend**: Deploy to Render/Railway/VPS
**Database**: Migrate to PostgreSQL
**AI**: Ensure Gemini API key is configured

## License

MIT License - Built for humanitarian impact.