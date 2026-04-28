SRD — AidSync
Software Requirements Document
Version 1.0 (MVP)
Product Name
AidSync

1. Introduction
1.1 Purpose
This Software Requirements Document defines the functional and technical requirements for AidSync, a web-based platform that enables NGOs to create missions, collaborate with partner NGOs, recruit volunteers, and coordinate multilingual operations using AI.
1.2 Scope
AidSync provides:


NGO registration and verification


mission creation and management


help request sharing across NGOs


volunteer participation system


AI-based text processing and translation


real-time collaboration tools


analytics dashboard



2. Definitions
TermMeaningMissionA task/event/campaign created by NGONeed HelpMission visible to partner NGOsInternal MissionVisible only to creator NGONGO AdminOrganization managerVolunteerNGO member who joins missionsPlatform AdminSystem moderator

3. System Overview
AidSync is a responsive web application with:


frontend client dashboard


backend API services


relational database


AI processing services


real-time communication engine



4. User Roles
4.1 NGO Admin
Can:


create/edit missions


request help


accept support offers


manage volunteers


chat with partners


view analytics


4.2 Volunteer
Can:


browse eligible missions


join missions


withdraw from missions


mark attendance


upload proof


4.3 Platform Admin
Can:


verify NGOs


suspend accounts


monitor activity


view platform metrics



5. Functional Requirements
5.1 Authentication Module
Features


email/password login


OTP login optional


logout


forgot password


Rules


only verified NGOs can create public help missions


JWT session tokens



5.2 NGO Registration Module
Inputs


NGO name


registration number


city


operating categories


contact details


proof documents


Outputs


pending verification status



5.3 Mission Management Module
Create Mission Fields


title


description


category


date


start time


end time


location


slots required


urgency


visibility mode


Visibility Modes
Internal
Only same NGO users can access.
Need Help
Visible in Help Feed to verified NGOs.

5.4 Help Feed Module
Feed Functions


list open missions needing help


filter by city/category/date/urgency


pagination


sort by newest/urgent


Actions


view details


accept support



5.5 Support Acceptance Module
When accepted:


mission owner notified


partner NGO linked to mission


partner volunteers gain visibility


contact/chat enabled



5.6 Volunteer Module
Volunteer Functions


view available missions


join mission


cancel join request


mark arrived


upload completion image



5.7 Chat Module


one-to-one NGO chat


mission room chat


timestamped messages


file/image support



5.8 Notification Module
Trigger events:


mission created


support accepted


volunteer joined


reminder before mission


slots full



5.9 Analytics Module
Metrics:


missions created


completed missions


volunteer count


support partnerships


participation hours



6. AI Requirements
6.1 Smart Intake
Input:
Free-text mission descriptions.
Example:

Need 20 volunteers tomorrow Baner

Output:


title generated


category inferred


date extracted


location extracted


slots suggested



6.2 Translation
Supported MVP:


English


Hindi


Marathi


System stores original + translated versions.

6.3 Duplicate Detection
If similar mission exists in same location/date:
Show warning.

6.4 NGO Recommendation
Suggest likely NGOs based on:


proximity


category match


historical participation



7. Non-Functional Requirements
7.1 Performance


login response < 2 sec


feed load < 1 sec


chat latency < 500 ms


concurrent users: 1000 MVP target



7.2 Security


password hashing


HTTPS only


JWT auth


RBAC permissions


input validation


rate limiting



7.3 Availability


99% uptime target



7.4 Scalability
Architecture should support future:


mobile apps


multi-city deployment


10k+ NGOs



7.5 Localization
UI language switch supported.

8. System Architecture
Client Web App   ↓API Gateway   ↓Backend Services ├─ Auth Service ├─ Mission Service ├─ Feed Service ├─ Chat Service ├─ AI Service └─ Notification Service   ↓Database + Cache

9. Recommended Technology Stack
Frontend


Next.js


TypeScript


Tailwind CSS


Backend


FastAPI


Database


PostgreSQL


Cache / Queue


Redis


AI Layer


Google Gemini API


Storage


Amazon S3 compatible bucket



10. API Requirements
Auth APIs


POST /auth/register


POST /auth/login


POST /auth/logout


NGO APIs


GET /ngo/profile


PUT /ngo/profile


Mission APIs


POST /missions


GET /missions/my


PUT /missions/{id}


DELETE /missions/{id}


Feed APIs


GET /feed/help


POST /missions/{id}/accept


Volunteer APIs


POST /missions/{id}/join


GET /missions/joined


Chat APIs


GET /chat/rooms


POST /chat/send


AI APIs


POST /ai/parse-mission


POST /ai/translate



11. Database Design
ngos
id, name, city, verified, category, created_at
users
id, ngo_id, role, name, email, password_hash
missions
id, ngo_id, title, desc, help_needed, category, slots, status
mission_partners
id, mission_id, ngo_id
joins
id, mission_id, user_id, status
chats
id, room_id, sender_id, message
notifications
id, user_id, type, read_status

12. UI Requirements
NGO Dashboard


summary cards


mission list


create mission CTA


analytics chart


Help Feed


card layout


filters sidebar


Volunteer Dashboard


available missions


joined missions


Chat UI


responsive messenger layout



13. Validation Rules
Mission Creation


title mandatory


date cannot be past


slots > 0


category required


Accept Support


only verified NGO admins


Join Mission


only eligible users



14. Error Handling
Examples:


unauthorized access


invalid token


mission full


duplicate join request


NGO not verified


Standard JSON responses.

15. Logging & Monitoring
Track:


login attempts


mission creation rate


API latency


AI failures


chat delivery errors



16. Testing Requirements
Unit Tests


auth logic


permissions


validations


Integration Tests


mission create → feed publish


accept support → partner visibility


volunteer join flow


UI Tests


responsive layout


forms


filters



17. Deployment Requirements
Frontend
Vercel
Backend
Render / VPS
Database
Managed PostgreSQL

18. Future Enhancements


native mobile app


map clustering


QR attendance


donation logistics


government dashboards


AI demand forecasting



19. Real Problem Solved
AidSync replaces scattered NGO coordination with a structured digital collaboration network, reducing delays and underused resources.

20. Acceptance Criteria (MVP Complete)
System is successful when:


NGO can register and be verified


NGO can create mission in <2 min


Need Help mission visible in feed


another NGO can accept


volunteers can join


chat works


AI parsing works


translation works

