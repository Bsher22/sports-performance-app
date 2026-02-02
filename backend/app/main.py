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


def parse_height_to_inches(height_str: str) -> int:
    """Convert height string like '6-0' or '5-11' to total inches."""
    try:
        parts = height_str.split('-')
        feet = int(parts[0])
        inches = int(parts[1]) if len(parts) > 1 else 0
        return feet * 12 + inches
    except:
        return None


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


def seed_rit_baseball_roster():
    """Seed RIT Baseball roster players (2025 roster, excluding Gr. and Sr. except Wozny brothers)."""
    db = SessionLocal()
    try:
        # Get Baseball sport ID
        baseball = db.query(Sport).filter(Sport.code == "baseball").first()
        if not baseball:
            print("Baseball sport not found, skipping RIT Baseball roster seeding")
            return

        # Check if we already have these players (check for a known player code)
        existing = db.query(Player).filter(Player.player_code == "P20250001").first()
        if existing:
            print("RIT Baseball roster already seeded, skipping")
            return

        # RIT Baseball 2025 Roster - Eligible players (Fr, So, Jr + Wozny exceptions)
        # Excluded: Gr./Sr. (except Wozny), Luc Rising, Kevin McNulty, Leo Miksitz,
        #           Dorian Stroud, Jack Joseph, Josh Eagle
        roster = [
            # Number, First, Last, Year, Position, Height, Bats/Throws
            (20, "Liam", "Miller", "Jr.", "RHP", "6-1", "R/R"),
            (3, "Charlie", "Slaymaker", "Jr.", "IF", "5-10", "R/R"),
            (11, "Evan", "Kurtz", "So.", "IF", "5-9", "R/R"),
            (4, "Mikey", "Zacher", "So.", "C/IF", "5-10", "R/R"),
            (12, "Jarin", "Moses", "Jr.", "LHP/OF", "6-0", "L/L"),
            (6, "Caelen", "Kim", "Jr.", "LHP/1B", "6-1", "L/L"),
            (34, "Randy", "Dodig", "Jr.", "1B", "6-0", "L/L"),
            (19, "Zachary", "Meehl", "Fy.", "C", "6-1", "R/R"),
            (14, "Dewey", "Rautzhan", "So.", "RHP", "6-5", "R/R"),
            (18, "Ty", "Book", "Fy.", "OF", "5-10", "L/R"),
            (25, "Ryan", "Moran", "Fy.", "RHP", "5-11", "R/R"),
            (10, "Jackson", "Rusiecki", "Jr.", "OF", "6-0", "L/R"),
            (23, "Joseph", "Wozny", "Sr.", "RHP", "6-5", "R/R"),  # Exception: included
            (9, "Isaac", "Braegelmann", "So.", "IF/C", "5-9", "R/R"),
            (24, "Roberto", "Reade", "Jr.", "RHP", "5-11", "R/R"),
            (30, "Owen", "Fisher", "Fy.", "RHP", "6-2", "L/R"),
            (35, "Colin", "Spidal", "Fy.", "LHP", "6-3", "R/L"),
            (7, "Graham", "Smith", "So.", "OF", "6-1", "L/L"),
            (31, "Leo", "Boehringer", "Fy.", "RHP", "6-5", "S/R"),
            (38, "Jack", "Luensmann", "Jr.", "RHP", "6-4", "R/R"),
            (27, "Aidan", "Chouinard", "Fy.", "OF", "5-11", "L/L"),
            (44, "Rocky", "Johnson", "Fy.", "RHP", "6-3", "R/R"),
            (33, "Timothy", "Wozny", "Sr.", "RHP", "6-4", "R/R"),  # Exception: included
            (39, "Remington", "Lee", "Fy.", "IF", "5-11", "R/R"),
        ]

        # Determine graduation year based on class year
        current_year = 2025
        year_map = {
            "Fy.": current_year + 4,  # Freshman -> 2029
            "So.": current_year + 3,  # Sophomore -> 2028
            "Jr.": current_year + 2,  # Junior -> 2027
            "Sr.": current_year + 1,  # Senior -> 2026
        }

        created_count = 0
        for idx, (number, first, last, year, position, height, bt) in enumerate(roster, start=1):
            # Parse bats/throws
            bats, throws = bt.split('/') if '/' in bt else (bt[0], bt[0])

            # Determine if pitcher based on position containing HP or P
            pos_parts = position.split('/')
            is_pitcher = any('HP' in p or (p in ['RHP', 'LHP', 'P']) for p in pos_parts)
            is_position_player = any(p not in ['RHP', 'LHP', 'P'] for p in pos_parts)

            player = Player(
                player_code=f"P2025{idx:04d}",
                first_name=first,
                last_name=last,
                sport_id=baseball.id,
                graduation_year=year_map.get(year, current_year + 1),
                is_pitcher=is_pitcher,
                is_position_player=is_position_player,
                bats=bats,
                throws=throws,
                height_inches=parse_height_to_inches(height),
                is_active=True,
            )
            db.add(player)
            created_count += 1

        db.commit()
        print(f"Seeded {created_count} RIT Baseball roster players")
    except Exception as e:
        print(f"Error seeding RIT Baseball roster: {e}")
        db.rollback()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    create_initial_admin()
    create_initial_sports()
    create_sample_players()
    seed_rit_baseball_roster()
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
