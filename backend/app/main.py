from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy import text
from app.config import get_settings
from app.api.v1.router import api_router
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models import User
from app.core.security import get_password_hash

# Import all models to register them with Base.metadata
from app.models import (
    user, team, sport, player, assessment,
    onbaseu, pitcher_onbaseu, tpi_power, sprint, kams, corrective
)
from app.models import Sport, Player

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

    # Run migrations for schema changes
    run_migrations()


def run_migrations():
    """Run database migrations for schema changes."""
    db = SessionLocal()
    try:
        # Migration: Add sport_id column to players table if it doesn't exist
        result = db.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'organization'
            AND table_name = 'players'
            AND column_name = 'sport_id'
        """))
        if result.fetchone() is None:
            db.execute(text("""
                ALTER TABLE organization.players
                ADD COLUMN sport_id INTEGER REFERENCES organization.sports(id)
            """))
            db.commit()
            print("Migration: Added sport_id column to players table")
    except Exception as e:
        print(f"Migration warning: {e}")
        db.rollback()
    finally:
        db.close()


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


def create_initial_sports():
    """Create initial RIT sports if none exist."""
    db = SessionLocal()
    try:
        sport_count = db.query(Sport).count()
        if sport_count == 0:
            # RIT Athletic Department Sports with their available assessments
            sports_data = [
                {
                    "name": "Baseball",
                    "code": "baseball",
                    "description": "RIT Baseball - Division III",
                    "available_assessments": ["onbaseu", "pitcher_onbaseu", "tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Men's Basketball",
                    "code": "mens_basketball",
                    "description": "RIT Men's Basketball - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Women's Basketball",
                    "code": "womens_basketball",
                    "description": "RIT Women's Basketball - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Men's Ice Hockey",
                    "code": "mens_hockey",
                    "description": "RIT Men's Ice Hockey - Division I",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Women's Ice Hockey",
                    "code": "womens_hockey",
                    "description": "RIT Women's Ice Hockey - Division I",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Men's Soccer",
                    "code": "mens_soccer",
                    "description": "RIT Men's Soccer - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Women's Soccer",
                    "code": "womens_soccer",
                    "description": "RIT Women's Soccer - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Men's Lacrosse",
                    "code": "mens_lacrosse",
                    "description": "RIT Men's Lacrosse - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Women's Lacrosse",
                    "code": "womens_lacrosse",
                    "description": "RIT Women's Lacrosse - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Softball",
                    "code": "softball",
                    "description": "RIT Softball - Division III",
                    "available_assessments": ["onbaseu", "pitcher_onbaseu", "tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Men's Swimming & Diving",
                    "code": "mens_swimming",
                    "description": "RIT Men's Swimming & Diving - Division III",
                    "available_assessments": ["tpi_power", "kams"],
                },
                {
                    "name": "Women's Swimming & Diving",
                    "code": "womens_swimming",
                    "description": "RIT Women's Swimming & Diving - Division III",
                    "available_assessments": ["tpi_power", "kams"],
                },
                {
                    "name": "Men's Track & Field",
                    "code": "mens_track",
                    "description": "RIT Men's Track & Field - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Women's Track & Field",
                    "code": "womens_track",
                    "description": "RIT Women's Track & Field - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Men's Tennis",
                    "code": "mens_tennis",
                    "description": "RIT Men's Tennis - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Women's Tennis",
                    "code": "womens_tennis",
                    "description": "RIT Women's Tennis - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Volleyball",
                    "code": "volleyball",
                    "description": "RIT Volleyball - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Wrestling",
                    "code": "wrestling",
                    "description": "RIT Wrestling - Division III",
                    "available_assessments": ["tpi_power", "sprint", "kams"],
                },
                {
                    "name": "Men's Crew",
                    "code": "mens_crew",
                    "description": "RIT Men's Crew - Club Sport",
                    "available_assessments": ["tpi_power", "kams"],
                },
                {
                    "name": "Women's Crew",
                    "code": "womens_crew",
                    "description": "RIT Women's Crew - Club Sport",
                    "available_assessments": ["tpi_power", "kams"],
                },
            ]

            for sport_data in sports_data:
                sport = Sport(**sport_data)
                db.add(sport)

            db.commit()
            print(f"Created {len(sports_data)} initial sports for RIT Athletic Department")
    finally:
        db.close()


def create_sample_players():
    """Create sample players for testing."""
    db = SessionLocal()
    try:
        player_count = db.query(Player).count()
        if player_count == 0:
            # Get Baseball sport ID
            baseball = db.query(Sport).filter(Sport.code == "baseball").first()
            if not baseball:
                print("Baseball sport not found, skipping sample players")
                return

            # Brian Sheridan - Baseball player
            brian = Player(
                player_code="P20160001",
                first_name="Brian",
                last_name="Sheridan",
                sport_id=baseball.id,
                graduation_year=2016,
                is_pitcher=True,
                is_position_player=True,
                bats="R",
                throws="L",
                height_inches=71,  # 5'11"
                weight_lbs=185,
                is_active=True,
            )
            db.add(brian)
            db.commit()
            print("Created sample player: Brian Sheridan (Baseball)")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    create_initial_admin()
    create_initial_sports()
    create_sample_players()
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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation error on {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/")
async def root():
    return {
        "message": "Sports Performance API",
        "docs": f"{settings.API_V1_PREFIX}/docs",
    }
