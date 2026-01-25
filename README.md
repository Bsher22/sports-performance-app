# Sports Performance App

A modern web application for managing sports performance assessments, built with React + TypeScript frontend and FastAPI + Python backend.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React + TypeScript Frontend                 │    │
│  │  • Vite Build System                                    │    │
│  │  • TanStack Query for Data Fetching                     │    │
│  │  • Zustand for State Management                         │    │
│  │  • Tailwind CSS + shadcn/ui                             │    │
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
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Assessment Types

1. **OnBaseU** - Position player mobility assessment
2. **Pitcher OnBaseU** - Pitcher-specific mobility assessment
3. **TPI Power** - Power and strength metrics
4. **Sprint** - Speed and agility testing
5. **KAMS** - Kinetic movement analysis

## Project Structure

```
├── backend/                  # FastAPI Python Backend
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── core/            # Security, exceptions
│   │   ├── db/              # Database session
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Business logic
│   ├── alembic/             # Database migrations
│   └── tests/
│
├── frontend/                 # React TypeScript Frontend
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # Reusable components
│   │   ├── features/        # Feature modules
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   ├── store/           # Zustand stores
│   │   └── types/           # TypeScript types
│   └── public/
│
└── docker-compose.yml        # Local development setup
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Docker (optional)

### Local Development

#### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Manual Setup

**Backend:**

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your database URL

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Start dev server
npm run dev
```

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/sports_performance
SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=["http://localhost:5173"]
DEBUG=true
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000/api/v1
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## Deployment

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy using `railway.toml` configuration

### Frontend (Cloudflare Pages)

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables

## Key Features

- **Player Management**: Add, edit, and track players across teams
- **Assessment Tracking**: Record and monitor 5 different assessment types
- **Progress Analysis**: Visualize player progress over time
- **Player Comparison**: Compare multiple players side-by-side
- **Team Analytics**: View team-wide statistics and rankings
- **JWT Authentication**: Secure user authentication
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Query (React Query)
- Zustand
- Tailwind CSS
- Recharts
- React Router

### Backend
- FastAPI
- Python 3.11+
- SQLAlchemy 2.0
- Pydantic
- Alembic
- PostgreSQL
- JWT (python-jose)

## Documentation

For comprehensive documentation including database schema, API endpoints, scoring systems, and implementation details, see **[DOCUMENTATION.md](./DOCUMENTATION.md)**
