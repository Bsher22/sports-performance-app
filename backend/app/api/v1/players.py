from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.api.deps import get_db, get_current_active_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import Player, Team, Sport, AssessmentSession
from app.schemas.player import (
    PlayerCreate,
    PlayerUpdate,
    PlayerResponse,
    PlayerListResponse,
    PlayerWithAssessments,
)

router = APIRouter()


def generate_player_code(db: Session) -> str:
    """Generate a unique player code in format P[YEAR][XXXX]."""
    year = datetime.now().year
    prefix = f"P{year}"

    # Find the highest existing code for this year
    latest = (
        db.query(Player)
        .filter(Player.player_code.like(f"{prefix}%"))
        .order_by(Player.player_code.desc())
        .first()
    )

    if latest:
        try:
            last_number = int(latest.player_code[-4:])
            new_number = last_number + 1
        except ValueError:
            new_number = 1
    else:
        new_number = 1

    return f"{prefix}{new_number:04d}"


@router.get("", response_model=List[PlayerListResponse])
def list_players(
    skip: int = 0,
    limit: int = 100,
    team_id: Optional[int] = None,
    sport_id: Optional[int] = None,
    is_pitcher: Optional[bool] = None,
    is_active: Optional[bool] = True,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """List all players with optional filters."""
    query = db.query(Player)

    if team_id is not None:
        query = query.filter(Player.team_id == team_id)

    if sport_id is not None:
        query = query.filter(Player.sport_id == sport_id)

    if is_pitcher is not None:
        query = query.filter(Player.is_pitcher == is_pitcher)

    if is_active is not None:
        query = query.filter(Player.is_active == is_active)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Player.first_name.ilike(search_term))
            | (Player.last_name.ilike(search_term))
            | (Player.player_code.ilike(search_term))
        )

    players = query.offset(skip).limit(limit).all()

    result = []
    for player in players:
        player_data = PlayerListResponse(
            id=player.id,
            player_code=player.player_code,
            full_name=player.full_name,
            team_name=player.team.name if player.team else None,
            sport_id=player.sport_id,
            sport_name=player.sport.name if player.sport else None,
            is_pitcher=player.is_pitcher,
            is_position_player=player.is_position_player,
            is_active=player.is_active,
            graduation_year=player.graduation_year,
        )
        result.append(player_data)

    return result


@router.post("", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
def create_player(
    player_data: PlayerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create a new player."""
    # Validate team exists if provided
    if player_data.team_id:
        team = db.query(Team).filter(Team.id == player_data.team_id).first()
        if not team:
            raise BadRequestException("Team not found")

    # Validate sport exists if provided
    if player_data.sport_id:
        sport = db.query(Sport).filter(Sport.id == player_data.sport_id).first()
        if not sport:
            raise BadRequestException("Sport not found")

    # Generate player code if not provided
    player_code = player_data.player_code or generate_player_code(db)

    # Check for duplicate player code
    existing = db.query(Player).filter(Player.player_code == player_code).first()
    if existing:
        raise BadRequestException("Player code already exists")

    player = Player(
        **player_data.model_dump(exclude={"player_code"}),
        player_code=player_code,
    )

    db.add(player)
    db.commit()
    db.refresh(player)

    return _build_player_response(player)


@router.get("/{player_id}", response_model=PlayerResponse)
def get_player(
    player_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get a specific player by ID."""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise NotFoundException("Player not found")

    return _build_player_response(player)


@router.put("/{player_id}", response_model=PlayerResponse)
def update_player(
    player_id: UUID,
    player_update: PlayerUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Update a player."""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise NotFoundException("Player not found")

    update_data = player_update.model_dump(exclude_unset=True)

    # Validate team if being updated
    if "team_id" in update_data and update_data["team_id"]:
        team = db.query(Team).filter(Team.id == update_data["team_id"]).first()
        if not team:
            raise BadRequestException("Team not found")

    # Validate sport if being updated
    if "sport_id" in update_data and update_data["sport_id"]:
        sport = db.query(Sport).filter(Sport.id == update_data["sport_id"]).first()
        if not sport:
            raise BadRequestException("Sport not found")

    for field, value in update_data.items():
        setattr(player, field, value)

    db.commit()
    db.refresh(player)

    return _build_player_response(player)


@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(
    player_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Deactivate a player."""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise NotFoundException("Player not found")

    player.is_active = False
    db.commit()


@router.get("/{player_id}/assessments", response_model=PlayerWithAssessments)
def get_player_assessments(
    player_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get player with assessment summary."""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise NotFoundException("Player not found")

    # Get assessment counts and types
    sessions = db.query(AssessmentSession).filter(
        AssessmentSession.player_id == player_id
    ).all()

    assessment_types = list(set(s.assessment_type for s in sessions))
    latest_date = max((s.assessment_date for s in sessions), default=None)

    response = PlayerWithAssessments(
        **_build_player_response(player).model_dump(),
        assessment_count=len(sessions),
        latest_assessment_date=latest_date,
        assessment_types=assessment_types,
    )

    return response


def _build_player_response(player: Player) -> PlayerResponse:
    """Build a PlayerResponse from a Player model."""
    return PlayerResponse(
        id=player.id,
        player_code=player.player_code,
        first_name=player.first_name,
        last_name=player.last_name,
        team_id=player.team_id,
        sport_id=player.sport_id,
        graduation_year=player.graduation_year,
        date_of_birth=player.date_of_birth,
        is_pitcher=player.is_pitcher,
        is_position_player=player.is_position_player,
        bats=player.bats,
        throws=player.throws,
        height_inches=player.height_inches,
        weight_lbs=player.weight_lbs,
        is_active=player.is_active,
        full_name=player.full_name,
        display_name=player.display_name,
        team_name=player.team.name if player.team else None,
        sport_name=player.sport.name if player.sport else None,
        created_at=player.created_at,
        updated_at=player.updated_at,
    )
