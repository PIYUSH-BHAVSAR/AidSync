import json
import os
import uuid
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AidSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")

def load_data():
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

# ── Groq AI setup ─────────────────────────────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
groq_client = None
if GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here":
    try:
        from groq import Groq
        groq_client = Groq(api_key=GROQ_API_KEY)
    except ImportError:
        pass

GROQ_MODEL = "llama-3.3-70b-versatile"  # fast, free tier, multilingual

# ── Models ──────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

class MissionCreate(BaseModel):
    title: str
    description: str
    category: str
    date: str
    start_time: str
    end_time: str
    location: str
    slots: int
    urgency: str
    help_needed: bool
    ngo_id: str
    ngo_name: str

class AcceptRequest(BaseModel):
    ngo_id: str

class JoinRequest(BaseModel):
    user_id: str

class ChatMessage(BaseModel):
    room_id: str
    sender_id: str
    sender_name: str
    message: str

class AIParseRequest(BaseModel):
    text: str

class TranslateRequest(BaseModel):
    text: str
    target_language: str

# ── Auth ─────────────────────────────────────────────────────────────────────

@app.post("/auth/login")
def login(req: LoginRequest):
    data = load_data()
    user = next((u for u in data["users"] if u["email"] == req.email and u["password"] == req.password), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    ngo = next((n for n in data["ngos"] if n["id"] == user["ngo_id"]), None)
    return {"user": user, "ngo": ngo, "token": f"mock-token-{user['id']}"}

@app.get("/auth/me/{user_id}")
def get_me(user_id: str):
    data = load_data()
    user = next((u for u in data["users"] if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    ngo = next((n for n in data["ngos"] if n["id"] == user["ngo_id"]), None)
    return {"user": user, "ngo": ngo}

# ── NGOs ─────────────────────────────────────────────────────────────────────

@app.get("/ngos")
def get_ngos():
    return load_data()["ngos"]

@app.get("/ngos/{ngo_id}")
def get_ngo(ngo_id: str):
    data = load_data()
    ngo = next((n for n in data["ngos"] if n["id"] == ngo_id), None)
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo

# ── Missions ─────────────────────────────────────────────────────────────────

@app.get("/missions")
def get_missions(ngo_id: Optional[str] = None):
    data = load_data()
    missions = data["missions"]
    if ngo_id:
        missions = [m for m in missions if m["ngo_id"] == ngo_id]
    return missions

# NOTE: specific sub-paths must come BEFORE /{mission_id} to avoid route conflicts
@app.get("/missions/joined/{user_id}")
def get_joined_missions(user_id: str):
    data = load_data()
    joined_ids = [j["mission_id"] for j in data["joins"] if j["user_id"] == user_id]
    return [m for m in data["missions"] if m["id"] in joined_ids]

@app.get("/missions/accepted/{ngo_id}")
def get_accepted_missions(ngo_id: str):
    data = load_data()
    partners = data.get("mission_partners", [])
    accepted_ids = [p["mission_id"] for p in partners if p["ngo_id"] == ngo_id]
    return [m for m in data["missions"] if m["id"] in accepted_ids]

@app.get("/missions/{mission_id}")
def get_mission(mission_id: str):
    data = load_data()
    mission = next((m for m in data["missions"] if m["id"] == mission_id), None)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission

@app.post("/missions")
def create_mission(mission: MissionCreate):
    data = load_data()
    new_mission = {
        "id": f"m{uuid.uuid4().hex[:6]}",
        "slots_filled": 0,
        "status": "active",
        **mission.model_dump()
    }
    data["missions"].append(new_mission)
    save_data(data)
    return new_mission

@app.delete("/missions/{mission_id}")
def delete_mission(mission_id: str):
    data = load_data()
    data["missions"] = [m for m in data["missions"] if m["id"] != mission_id]
    save_data(data)
    return {"ok": True}

@app.post("/missions/{mission_id}/accept")
def accept_mission(mission_id: str, req: AcceptRequest):
    data = load_data()
    mission = next((m for m in data["missions"] if m["id"] == mission_id), None)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    if not mission.get("help_needed"):
        raise HTTPException(status_code=400, detail="Mission is not requesting help")
    # Prevent duplicate acceptance
    partners = data.get("mission_partners", [])
    already = any(p for p in partners if p["mission_id"] == mission_id and p["ngo_id"] == req.ngo_id)
    if already:
        raise HTTPException(status_code=400, detail="Already accepted this mission")
    # Prevent owner from accepting their own mission
    if mission["ngo_id"] == req.ngo_id:
        raise HTTPException(status_code=400, detail="Cannot accept your own mission")
    partners.append({
        "id": f"mp{uuid.uuid4().hex[:6]}",
        "mission_id": mission_id,
        "ngo_id": req.ngo_id
    })
    data["mission_partners"] = partners
    save_data(data)
    return {"ok": True, "mission": mission}

@app.get("/missions/{mission_id}/partners")
def get_mission_partners(mission_id: str):
    data = load_data()
    partners = data.get("mission_partners", [])
    partner_ids = [p["ngo_id"] for p in partners if p["mission_id"] == mission_id]
    return [n for n in data["ngos"] if n["id"] in partner_ids]

# ── Help Feed ─────────────────────────────────────────────────────────────────

@app.get("/feed/help")
def get_help_feed(city: Optional[str] = None, category: Optional[str] = None, urgency: Optional[str] = None):
    data = load_data()
    missions = [m for m in data["missions"] if m.get("help_needed") and m["status"] != "filled"]
    if city:
        missions = [m for m in missions if city.lower() in m["location"].lower()]
    if category:
        missions = [m for m in missions if m["category"] == category]
    if urgency:
        missions = [m for m in missions if m["urgency"] == urgency]
    return missions

# ── Volunteer Join ────────────────────────────────────────────────────────────

@app.post("/missions/{mission_id}/join")
def join_mission(mission_id: str, req: JoinRequest):
    data = load_data()
    mission = next((m for m in data["missions"] if m["id"] == mission_id), None)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    already = any(j for j in data["joins"] if j["mission_id"] == mission_id and j["user_id"] == req.user_id)
    if already:
        raise HTTPException(status_code=400, detail="Already joined")
    if mission["slots_filled"] >= mission["slots"]:
        raise HTTPException(status_code=400, detail="Mission is full")
    data["joins"].append({"id": f"j{uuid.uuid4().hex[:6]}", "mission_id": mission_id, "user_id": req.user_id, "status": "confirmed"})
    mission["slots_filled"] += 1
    save_data(data)
    return {"ok": True}

@app.get("/missions/joined/{user_id}")
def get_joined_missions(user_id: str):
    data = load_data()
    joined_ids = [j["mission_id"] for j in data["joins"] if j["user_id"] == user_id]
    return [m for m in data["missions"] if m["id"] in joined_ids]

@app.get("/chat/{room_id}")
def get_chat(room_id: str):
    data = load_data()
    return [c for c in data["chats"] if c["room_id"] == room_id]

@app.post("/chat/send")
def send_message(msg: ChatMessage):
    data = load_data()
    new_msg = {
        "id": f"c{uuid.uuid4().hex[:6]}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        **msg.model_dump()
    }
    data["chats"].append(new_msg)
    save_data(data)
    return new_msg

# ── Analytics ─────────────────────────────────────────────────────────────────

@app.get("/analytics/{ngo_id}")
def get_analytics(ngo_id: str):
    data = load_data()
    return data["analytics"].get(ngo_id, {
        "missions_created": 0, "missions_completed": 0,
        "volunteers_mobilized": 0, "partner_ngos_helped": 0, "hours_contributed": 0
    })

# ── AI Endpoints ──────────────────────────────────────────────────────────────

def _groq_chat(prompt: str) -> str:
    """Call Groq chat completion and return text."""
    response = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=512,
    )
    return response.choices[0].message.content.strip()


@app.post("/ai/parse-mission")
async def parse_mission(req: AIParseRequest):
    """Use Groq to extract structured mission data from free text."""
    mock = {
        "title": req.text[:60] if len(req.text) > 10 else "New Mission",
        "category": "food",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "location": "India",
        "slots": 10,
        "urgency": "medium",
        "description": req.text,
        "note": "AI key not configured — using mock extraction"
    }

    if not groq_client:
        return mock

    try:
        prompt = f"""Extract mission details from this text and return ONLY valid JSON with these exact fields:
title, category (one of: food/medical/disaster relief/education/environment/blood donation/logistics/others),
date (YYYY-MM-DD, use today {datetime.now().strftime('%Y-%m-%d')} if not mentioned),
location, slots (integer), urgency (low/medium/high), description.

Text: "{req.text}"

Return only the JSON object. No markdown, no explanation."""

        raw = _groq_chat(prompt)
        # Strip markdown fences if model wraps in them
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())
    except Exception as e:
        mock["note"] = f"AI error — using mock extraction ({type(e).__name__})"
        return mock


@app.post("/ai/translate")
async def translate_text(req: TranslateRequest):
    """Translate text using Groq."""
    if not groq_client:
        return {"translated": req.text, "note": "AI key not configured — returning original"}

    try:
        prompt = f"Translate the following text to {req.target_language}. Return only the translated text, nothing else.\n\nText: {req.text}"
        return {"translated": _groq_chat(prompt)}
    except Exception as e:
        return {"translated": req.text, "note": f"Translation failed ({type(e).__name__})"}


@app.get("/")
def root():
    return {"message": "AidSync API running", "docs": "/docs"}
