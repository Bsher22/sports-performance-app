# Sports Performance App - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Backend API Reference](#backend-api-reference)
6. [Frontend Components](#frontend-components)
7. [Assessment Types](#assessment-types)
8. [Scoring Systems](#scoring-systems)
9. [Development Setup](#development-setup)
10. [Deployment](#deployment)
11. [Implementation Status](#implementation-status)

---

## Overview

The Sports Performance App is a modern web application for managing athletic assessments, tracking player progress, and analyzing team performance. It has been redesigned from a Streamlit application to a clean three-tier architecture with:

- **Frontend**: React + TypeScript with Vite
- **Backend**: FastAPI + Python
- **Database**: PostgreSQL

### Key Features

- Player and team management
- 5 different assessment types with specialized scoring
- Progress tracking and visualization
- Player comparison tools
- Team analytics and rankings
- JWT authentication
- RESTful API

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React + TypeScript Frontend                 │    │
│  │  • Vite Build System                                    │    │
│  │  • TanStack Query for Data Fetching                     │    │
│  │  • Zustand for State Management                         │    │
│  │  • Tailwind CSS                                         │    │
│  │  • Recharts for Visualizations                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         RAILWAY                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              FastAPI Python Backend                      │    │
│  │  • Pydantic for Validation                              │    │
│  │  • SQLAlchemy 2.0 ORM                                   │    │
│  │  • Alembic for Migrations                               │    │
│  │  • JWT Authentication                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              PostgreSQL Database                         │    │
│  │  • Schema: auth, organization, assessments, correctives │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
Sports Performance App/
├── backend/                          # FastAPI Backend
│   ├── alembic/                      # Database migrations
│   │   ├── versions/                 # Migration files
│   │   ├── env.py                    # Alembic configuration
│   │   └── script.py.mako            # Migration template
│   ├── app/
│   │   ├── api/                      # API layer
│   │   │   ├── deps.py               # Dependency injection
│   │   │   └── v1/                   # API version 1
│   │   │       ├── router.py         # Main router
│   │   │       ├── auth.py           # Authentication endpoints
│   │   │       ├── users.py          # User management
│   │   │       ├── teams.py          # Team endpoints
│   │   │       ├── players.py        # Player endpoints
│   │   │       ├── assessments/      # Assessment endpoints
│   │   │       │   ├── router.py     # Assessment router
│   │   │       │   ├── sessions.py   # Session management
│   │   │       │   ├── onbaseu.py    # OnBaseU results
│   │   │       │   ├── pitcher_onbaseu.py
│   │   │       │   ├── tpi_power.py  # TPI Power results
│   │   │       │   ├── sprint.py     # Sprint results
│   │   │       │   └── kams.py       # KAMS results
│   │   │       └── analysis/         # Analysis endpoints
│   │   │           └── router.py
│   │   ├── core/                     # Core utilities
│   │   │   ├── security.py           # JWT, password hashing
│   │   │   └── exceptions.py         # Custom exceptions
│   │   ├── db/                       # Database
│   │   │   ├── base.py               # SQLAlchemy base
│   │   │   └── session.py            # Session management
│   │   ├── models/                   # SQLAlchemy models
│   │   │   ├── user.py               # User, Role, UserRole
│   │   │   ├── team.py               # Team
│   │   │   ├── player.py             # Player
│   │   │   ├── assessment.py         # AssessmentSession
│   │   │   ├── onbaseu.py            # OnBaseUResult
│   │   │   ├── pitcher_onbaseu.py    # PitcherOnBaseUResult
│   │   │   ├── tpi_power.py          # TPIPowerResult
│   │   │   ├── sprint.py             # SprintResult
│   │   │   ├── kams.py               # KAMSResult
│   │   │   └── corrective.py         # Exercise, ExerciseMapping
│   │   ├── schemas/                  # Pydantic schemas
│   │   │   ├── common.py             # Shared schemas
│   │   │   ├── auth.py               # Auth schemas
│   │   │   ├── user.py               # User schemas
│   │   │   ├── team.py               # Team schemas
│   │   │   ├── player.py             # Player schemas
│   │   │   └── assessment/           # Assessment schemas
│   │   │       ├── session.py
│   │   │       ├── onbaseu.py        # + test definitions
│   │   │       ├── pitcher_onbaseu.py
│   │   │       ├── tpi_power.py      # + scoring thresholds
│   │   │       ├── sprint.py         # + scoring thresholds
│   │   │       └── kams.py
│   │   ├── services/                 # Business logic
│   │   │   ├── assessment/           # Scoring services
│   │   │   │   ├── base_service.py
│   │   │   │   ├── onbaseu_service.py
│   │   │   │   ├── pitcher_onbaseu_service.py
│   │   │   │   ├── tpi_power_service.py
│   │   │   │   ├── sprint_service.py
│   │   │   │   └── kams_service.py
│   │   │   └── analysis/             # Analysis services
│   │   │       ├── player_analysis.py
│   │   │       └── team_analysis.py
│   │   ├── config.py                 # App configuration
│   │   └── main.py                   # FastAPI entry point
│   ├── tests/                        # Test suite
│   ├── .env.example                  # Environment template
│   ├── alembic.ini                   # Alembic config
│   ├── Dockerfile                    # Container config
│   ├── init.sql                      # DB initialization
│   ├── railway.toml                  # Railway deployment
│   └── requirements.txt              # Python dependencies
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── api/                      # API client
│   │   │   ├── client.ts             # Axios instance
│   │   │   ├── auth.ts               # Auth API
│   │   │   ├── players.ts            # Players API
│   │   │   ├── teams.ts              # Teams API
│   │   │   ├── analysis.ts           # Analysis API
│   │   │   └── assessments/          # Assessment APIs
│   │   │       ├── sessions.ts
│   │   │       ├── onbaseu.ts
│   │   │       ├── tpi-power.ts
│   │   │       ├── sprint.ts
│   │   │       └── kams.ts
│   │   ├── components/               # Reusable components
│   │   │   ├── ui/                   # Base UI (button, card, input)
│   │   │   ├── layout/               # Layout (AppLayout, Sidebar, Header)
│   │   │   └── common/               # Common (LoadingSpinner)
│   │   ├── features/                 # Feature modules
│   │   │   ├── auth/                 # LoginPage
│   │   │   ├── dashboard/            # DashboardPage
│   │   │   ├── players/              # PlayersListPage, PlayerDetailPage
│   │   │   ├── teams/                # TeamsListPage, TeamDetailPage
│   │   │   ├── assessments/          # AssessmentFlowPage
│   │   │   └── analysis/             # Progress, Comparison, TeamOverview
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utilities (utils.ts)
│   │   ├── store/                    # Zustand stores
│   │   │   ├── authStore.ts          # Authentication state
│   │   │   └── assessmentStore.ts    # Assessment flow state
│   │   ├── types/                    # TypeScript types
│   │   │   ├── auth.ts
│   │   │   ├── player.ts
│   │   │   ├── team.ts
│   │   │   ├── assessment.ts
│   │   │   └── analysis.ts
│   │   ├── styles/
│   │   │   └── globals.css           # Tailwind + custom styles
│   │   ├── App.tsx                   # Main router
│   │   └── main.tsx                  # Entry point
│   ├── .env.example                  # Environment template
│   ├── Dockerfile                    # Container config
│   ├── index.html                    # HTML template
│   ├── nginx.conf                    # Nginx config
│   ├── package.json                  # Node dependencies
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── wrangler.toml                 # Cloudflare deployment
│
├── docker-compose.yml                # Local development
├── README.md                         # Quick start guide
└── DOCUMENTATION.md                  # This file
```

---

## Database Schema

### Schemas

- **auth** - Authentication & authorization
- **organization** - Teams and players
- **assessments** - All assessment data
- **correctives** - Exercise recommendations
- **analysis** - Computed metrics (future)

### Entity Relationship

```
auth.users
    │
    ├── auth.user_roles ──► auth.roles
    │
    └── assessments.sessions
            │
            ├── player_id ──► organization.players ──► organization.teams
            │
            ├── onbaseu_results
            ├── pitcher_onbaseu_results
            ├── tpi_power_results
            ├── sprint_results
            └── kams_results

correctives.exercises ◄── correctives.exercise_mappings
```

### Key Tables

#### organization.players
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| player_code | VARCHAR(20) | Unique code (P20250001) |
| first_name | VARCHAR(100) | First name |
| last_name | VARCHAR(100) | Last name |
| team_id | INTEGER | FK to teams |
| is_pitcher | BOOLEAN | Pitcher flag |
| is_position_player | BOOLEAN | Position player flag |
| bats | VARCHAR(1) | R/L/S |
| throws | VARCHAR(1) | R/L |
| graduation_year | INTEGER | Graduation year |
| is_active | BOOLEAN | Active status |

#### assessments.sessions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| player_id | UUID | FK to players |
| assessment_type | VARCHAR(50) | Type (onbaseu, tpi_power, etc.) |
| assessment_date | DATE | Assessment date |
| assessed_by | UUID | FK to users |
| is_complete | BOOLEAN | Completion status |

#### assessments.onbaseu_results
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | FK to sessions |
| test_code | VARCHAR(20) | Test identifier (OBU-01) |
| test_name | VARCHAR(100) | Test name |
| test_category | VARCHAR(50) | Category |
| side | VARCHAR(10) | left/right/null |
| result | VARCHAR(50) | Result value |
| score | INTEGER | 1-3 score |
| color | VARCHAR(10) | green/yellow/red |

---

## Backend API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | OAuth2 login (form data) |
| POST | `/api/v1/auth/login/json` | JSON login |
| POST | `/api/v1/auth/refresh` | Refresh token |
| POST | `/api/v1/auth/register` | Register new user |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Get current user |
| PUT | `/api/v1/users/me` | Update current user |
| GET | `/api/v1/users` | List all users (admin) |
| POST | `/api/v1/users` | Create user (admin) |

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/teams` | List teams |
| POST | `/api/v1/teams` | Create team |
| GET | `/api/v1/teams/{id}` | Get team |
| PUT | `/api/v1/teams/{id}` | Update team |
| DELETE | `/api/v1/teams/{id}` | Deactivate team |
| GET | `/api/v1/teams/{id}/players` | Get team players |
| GET | `/api/v1/teams/{id}/stats` | Get team statistics |

### Players

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/players` | List players (with filters) |
| POST | `/api/v1/players` | Create player |
| GET | `/api/v1/players/{id}` | Get player |
| PUT | `/api/v1/players/{id}` | Update player |
| DELETE | `/api/v1/players/{id}` | Deactivate player |
| GET | `/api/v1/players/{id}/assessments` | Get player assessments |

### Assessment Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/assessments/sessions` | List sessions |
| POST | `/api/v1/assessments/sessions` | Create session |
| GET | `/api/v1/assessments/sessions/{id}` | Get session with results |
| PUT | `/api/v1/assessments/sessions/{id}` | Update session |
| DELETE | `/api/v1/assessments/sessions/{id}` | Delete session |
| POST | `/api/v1/assessments/sessions/{id}/complete` | Mark complete |

### Assessment Results (OnBaseU example - others follow same pattern)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/assessments/onbaseu/tests` | Get test definitions |
| GET | `/api/v1/assessments/onbaseu/{session_id}/results` | Get results |
| POST | `/api/v1/assessments/onbaseu/{session_id}/results` | Create result |
| POST | `/api/v1/assessments/onbaseu/{session_id}/results/bulk` | Bulk create |
| PUT | `/api/v1/assessments/onbaseu/{session_id}/results/{id}` | Update result |
| DELETE | `/api/v1/assessments/onbaseu/{session_id}/results/{id}` | Delete result |

### Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/analysis/player/{id}/progress` | Player progress |
| GET | `/api/v1/analysis/player/{id}/summary` | Player summary |
| GET | `/api/v1/analysis/compare` | Compare players |
| GET | `/api/v1/analysis/team/{id}/overview` | Team overview |
| GET | `/api/v1/analysis/team/{id}/trends` | Team trends |
| GET | `/api/v1/analysis/team/{id}/rankings` | Player rankings |

---

## Frontend Components

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | LoginPage | User authentication |
| `/dashboard` | DashboardPage | Main dashboard |
| `/players` | PlayersListPage | Player list with search |
| `/players/:id` | PlayerDetailPage | Player details |
| `/teams` | TeamsListPage | Team list |
| `/teams/:id` | TeamDetailPage | Team details |
| `/assessments` | AssessmentFlowPage | Assessment workflow |
| `/analysis/player/:id` | PlayerProgressPage | Player progress charts |
| `/analysis/compare` | PlayerComparisonPage | Compare players |
| `/analysis/team/:id` | TeamOverviewPage | Team analytics |

### State Management

**authStore** (Zustand)
- `user` - Current user
- `accessToken` / `refreshToken` - JWT tokens
- `login()` / `logout()` - Auth actions

**assessmentStore** (Zustand)
- `currentSession` - Active assessment session
- `currentStep` - Workflow step (select/input/review)
- `pendingResults` - Unsaved results
- `startAssessment()` / `clearAssessment()` - Actions

---

## Assessment Types

### 1. OnBaseU (Position Players)

16 tests across 3 categories:

**Upper Body**
- Shoulder 46 Test (bilateral)
- 90/90 Test (bilateral)
- Lat Test (bilateral)
- Hitchhiker Test (bilateral)

**Lower Body**
- Hip 45 Test (bilateral)
- Pelvic Tilt Test
- Pelvic Rotation Test
- Deep Squat Test
- Hurdle Step Test
- MSR
- Toe Tap Test (bilateral)
- Ankle Rocking Test (bilateral)

**Core**
- Push-Off Test
- Separation Test
- Holding Angle Test
- Seated Trunk Rotation Test (bilateral)

### 2. Pitcher OnBaseU

Same tests as OnBaseU but with pitcher-specific analysis comparing throwing arm vs. glove arm.

### 3. TPI Power

5 power tests:
- Vertical Jump (inches)
- Broad Jump (inches)
- Seated Chest Pass (inches)
- Sit Up Throw (inches)
- Baseline Shot Put (bilateral, inches)

### 4. Sprint

5 speed tests:
- 81 ft Sprint (linear)
- 5-yard Directional Left
- 5-yard Directional Center
- 5-yard Directional Right
- Curvilinear Sprint

### 5. KAMS

5 movement patterns:
- Multi-Segmental ROM
- Overhead Squat
- Reverse Lunge
- Single Leg Balance
- Vertical Jump (landing mechanics)

---

## Scoring Systems

### OnBaseU / Pitcher OnBaseU

| Result | Score | Color |
|--------|-------|-------|
| Pass / Good / > 45° | 3 | Green |
| Neutral / = 45° / Improves | 2 | Yellow |
| Fail / Limited / < 45° | 1 | Red |

**Overall Score**: (Sum of scores / Max possible) × 100

### TPI Power

**Vertical Jump**
| Value | Score | Color |
|-------|-------|-------|
| ≥ 30" | 100% | Blue |
| ≥ 26" | 85-100% | Green |
| ≥ 22" | 70-85% | Yellow |
| < 22" | 0-70% | Red |

**Relative Tests** (vs. Vertical Jump)
- Seated Chest Pass: Target = VJ × 0.85
- Sit Up Throw: Target = VJ × 0.85
- Shot Put: Target = VJ × 1.5 (off-side × 0.9)

### Sprint

| Test | Optimal | Adequate |
|------|---------|----------|
| 81 ft Sprint | ≤ 2.80s | ≤ 3.00s |
| 5-yard Left | ≤ 1.10s | ≤ 1.25s |
| 5-yard Center | ≤ 1.05s | ≤ 1.20s |
| 5-yard Right | ≤ 1.10s | ≤ 1.25s |
| Curvilinear | ≤ 2.00s | ≤ 2.20s |

| Performance | Score | Color |
|-------------|-------|-------|
| ≤ Optimal | 100% | Green |
| ≤ Adequate | 85-100% | Yellow |
| > Adequate | < 85% | Red |

---

## Development Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Docker (optional)

### Quick Start (Docker)

```bash
# Clone and navigate
cd "Sports Performance App"

# Start all services
docker-compose up -d

# Access:
# - Frontend: http://localhost:80
# - Backend: http://localhost:8000
# - API Docs: http://localhost:8000/api/v1/docs
```

### Manual Setup

**Backend:**

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start dev server
npm run dev
```

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sports_performance
SECRET_KEY=your-super-secret-key-change-in-production
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:3000"]
DEBUG=true
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Deployment

### Backend (Railway)

1. Push code to GitHub
2. Connect repository to Railway
3. Configure environment variables:
   - `DATABASE_URL` (Railway provides PostgreSQL)
   - `SECRET_KEY`
   - `ALLOWED_ORIGINS`
4. Deploy using `railway.toml`

### Frontend (Cloudflare Pages)

1. Connect repository to Cloudflare Pages
2. Build settings:
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: `frontend`
3. Environment variables:
   - `VITE_API_URL=https://your-railway-backend.up.railway.app/api/v1`

---

## Implementation Status

### ✅ Completed

- [x] Backend project structure
- [x] Database models (all entities)
- [x] Pydantic schemas
- [x] JWT authentication
- [x] User management API
- [x] Team management API
- [x] Player management API
- [x] Assessment session API
- [x] OnBaseU results API
- [x] Pitcher OnBaseU results API
- [x] TPI Power results API
- [x] Sprint results API
- [x] KAMS results API
- [x] Scoring services (all types)
- [x] Player analysis service
- [x] Team analysis service
- [x] Analysis API endpoints
- [x] Frontend project structure
- [x] API client layer
- [x] Authentication store
- [x] Assessment store
- [x] Login page
- [x] Dashboard page
- [x] Players list/detail pages
- [x] Teams list/detail pages
- [x] Assessment flow page (basic)
- [x] Player progress page
- [x] Player comparison page
- [x] Team overview page
- [x] Docker configuration
- [x] Deployment configs

### 🔲 To Implement

- [ ] Run Alembic migrations (requires database)
- [ ] Create initial admin user
- [ ] Full assessment input forms (test-by-test)
- [ ] Assessment review/submit step
- [ ] Corrective exercise recommendations
- [ ] PDF report generation
- [ ] KAMS PDF upload parsing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

---

## Quick Reference

### Player Code Format
`P[YEAR][XXXX]` - Example: `P20250001`

### Assessment Types
- `onbaseu` - Position player mobility
- `pitcher_onbaseu` - Pitcher mobility
- `tpi_power` - Power metrics
- `sprint` - Speed testing
- `kams` - Movement screen

### Result Colors
- `green` - Pass/Good
- `yellow` - Neutral/Adequate
- `red` - Fail/Limited
- `blue` - Excellent (TPI only)

### API Base URL
- Development: `http://localhost:8000/api/v1`
- Production: Set via `VITE_API_URL`
