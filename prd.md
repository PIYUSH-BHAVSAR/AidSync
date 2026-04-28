PRD — AidSync
Product Requirements Document
Version 1.0 (MVP)
Product Name
AidSync
Tagline

AI-powered mission collaboration platform for NGOs and volunteers

1. Executive Summary

AidSync is a web platform that helps verified NGOs create missions, request support from partner NGOs, recruit volunteers, and coordinate faster through AI-powered workflows.

Today many NGOs operate in silos using calls, spreadsheets, and WhatsApp groups. AidSync transforms fragmented operations into one collaborative network.

2. Problem Statement

NGOs face major operational issues:

lack of visibility into nearby NGOs
duplicate campaigns in same areas
shortage of volunteers/resources
chaotic communication across multiple channels
language barriers
no structured mission workflow
poor tracking of outcomes

During urgent events, coordination delays reduce impact.

3. Vision

Create a shared digital operating system where NGOs can coordinate missions together and mobilize volunteers quickly.

4. Goals (MVP)
Primary Goals
enable NGOs to create/manage missions
allow NGOs to request external help
allow other NGOs to accept support requests
allow volunteers to join missions
provide multilingual AI assistance
create real-time collaboration
Success Metrics
time to publish mission < 2 min
mission acceptance rate
volunteer join rate
average response time
repeat NGO usage
successful mission completion %
5. Target Users
A. NGO Admin

Creates missions, seeks help, manages volunteers.

B. NGO Member / Volunteer

Joins missions and executes tasks.

C. Platform Admin

Verifies NGOs, moderation, analytics.

6. User Personas
Persona 1: Small NGO Lead in Pune

Needs extra volunteers for weekend food drive.

Persona 2: Student Volunteer

Wants meaningful missions to join locally.

Persona 3: Disaster Relief NGO

Needs fast partner support during floods.

7. Core Product Concept

Every mission created by an NGO can be marked:

Option A: Internal Only

Only own NGO members can view/join.

Option B: Need Help

Mission appears in shared Help Feed for partner NGOs.

8. Core Features (MVP)
8.1 NGO Registration & Verification
Functional Requirements
NGO signup form
upload registration docs
city, causes, contact details
admin review workflow
verified badge
Acceptance Criteria
unverified NGOs cannot post public help requests
8.2 Authentication
email OTP login
password login optional
role-based access

Roles:

NGO Admin
Volunteer
Platform Admin
8.3 Mission Creation
Inputs
title
category
description
date/time
location
slots needed
urgency
internal only / need help toggle
Categories
food
medical
disaster relief
education
environment
blood donation
logistics
others
8.4 AI Smart Intake

If user pastes vague text:

Need support tomorrow in Hadapsar

AI asks:

type of support?
number of volunteers?
time?
exact location?

Then autofills mission form.

8.5 Shared Help Feed

Visible only to verified NGOs.

Feed Card Contains:
mission title
NGO name
city
category
date
urgency
slots needed
Accept Support CTA
Filters
city
category
urgency
date
open/filled
8.6 Support Acceptance

When NGO clicks Accept:

mission owner notified
contact details unlocked
in-app chat enabled
partner NGO volunteers can join
8.7 Volunteer Dashboard

Volunteers see:

own NGO missions
accepted partner missions
joined missions
upcoming schedule

Actions:

Join
Withdraw
Mark attendance
Upload completion proof
8.8 Real-Time Chat

Between NGOs and volunteers.

Features:

text chat
file/image share
live translation
8.9 AI Translation Layer

Messages and mission descriptions auto-translated.

Supported MVP languages:

English
Hindi
Marathi
8.10 Notifications
mission created
support accepted
volunteer joined
chat message
slots full
mission reminder

Email + in-app initially.

8.11 Analytics Dashboard

For NGO admins:

missions created
missions completed
volunteers mobilized
partner NGOs helped
hours contributed
9. AI Layer Detailed Design
9.1 Structured Extraction

Input:

Free text / pasted chat / voice transcript.

Output:

{
 "title":"Need 20 volunteers for food drive",
 "city":"Pune",
 "category":"food",
 "date":"2026-04-29",
 "urgency":"medium"
}
9.2 Translation Engine

Store:

original_text
translated_text
language_code
9.3 Smart Recommendations

Suggest NGOs likely to help based on:

location proximity
category match
previous acceptance history
active volunteers
9.4 Duplicate Detection

Similar missions in same area/date flagged.

10. User Flows
Flow A — Internal Mission

NGO Login → Create Mission → Internal Only → Volunteers Join → Complete

Flow B — Need Help Mission

NGO Login → Create Mission → Need Help → Feed → Another NGO Accepts → Volunteers Join → Complete

Flow C — Volunteer

Login → Browse Eligible Missions → Join → Attend → Proof Upload

11. Information Architecture
Public Pages
Landing page
NGO signup
Volunteer signup
Login
Logged-In NGO
Dashboard
Create Mission
My Missions
Help Feed
Partners
Chat
Analytics
Settings
Logged-In Volunteer
Dashboard
Available Missions
Joined Missions
Profile
12. Non-Functional Requirements
Performance
page load < 3 sec
feed fetch < 1 sec
Security
JWT auth
encrypted passwords
role checks
secure document storage
Reliability
99% uptime target for MVP demo
Scalability
support 10k users later
13. Technical Stack
Frontend
Next.js
TypeScript
Tailwind CSS
Backend
FastAPI
Database
PostgreSQL
Realtime
WebSockets
AI
Google Gemini API
Hosting
Vercel frontend
Render / VPS backend
14. Suggested DB Schema
ngos

id, name, city, verified, causes, contact

users

id, ngo_id, role, name, email

missions

id, ngo_id, title, desc, help_needed, status, slots

mission_partners

mission_id, partner_ngo_id

joins

mission_id, user_id

chats

room_id, sender_id, message

translations

entity_id, lang, text

15. MVP Scope (Must Build)
Must Have

✅ NGO auth
✅ Mission create
✅ Need Help toggle
✅ Shared feed
✅ Accept support
✅ Volunteer join
✅ AI text intake
✅ Translation
✅ Basic analytics

Nice to Have
map view
ratings
attendance QR
push notifications
16. Risks & Mitigation
Low NGO Adoption

Start with colleges / local groups.

Fake NGOs

Verification workflow.

Empty Feed

Seed demo data.

Complexity

Limit MVP scope.

17. Roadmap
Month 1

Core missions + feed + auth

Month 2

AI + chat + translation

Month 3

Pilot with real NGOs

18. Why It Solves Real Problem

Before AidSync:

scattered communication
missed collaboration
underused volunteers
language friction

After AidSync:

faster coordination
shared workforce
structured missions
multilingual operations
measurable impact
19. Demo Script
NGO creates mission in Marathi
AI structures + translates
Marks Need Help
Another NGO accepts
Volunteers join
Live slots update
Mission completed dashboard shown
20. One-Line Pitch

AidSync helps NGOs collaborate, recruit volunteers, and run missions faster through AI-powered multilingual coordination.