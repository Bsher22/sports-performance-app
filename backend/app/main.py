from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.config import get_settings
from app.api.v1.router import api_router
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models import User
from app.core.security import get_password_hash

# Import all models to register them with Base.metadata
from app.models import (
    user, team, player, assessment,
    onbaseu, pitcher_onbaseu, tpi_power, sprint, kams, corrective
)

settings = get_settings()


def init_db():
    """Create database schemas and tables."""
    db = SessionLocal()
    try:
        # Create schemas if they don't exist
        for schema in ['auth', 'organization', 'assessments', 'analysis', 'correctives']:
            db.execute(text(f'CREATE SCHEMA IF NOT EXISTS {schema}'))
        db.commit()
    finally:
        db.close()

    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")


def create_initial_admin():
    """Create initial admin user if no users exist."""
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            admin = User(
                email="admin@sportsperformance.com",
                password_hash=get_password_hash("admin123"),
                first_name="Admin",
                last_name="User",
                is_active=True,
                is_superuser=True,
            )
            db.add(admin)
            db.commit()
            print("Created initial admin user: admin@sportsperformance.com / admin123")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    create_initial_admin()
    yield
    # Shutdown
    pass


app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/")
async def root():
    return {
        "message": "Sports Performance API",
        "docs": f"{settings.API_V1_PREFIX}/docs",
    }
