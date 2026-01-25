from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.api.deps import get_db, get_current_active_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import Team, Player
from app.schemas.team import TeamCreate, TeamUpdate, TeamResponse, TeamStats

router = APIRouter()


@router.get("", response_model=List[TeamResponse])
def list_teams(
    skip: int = 0,
    limit: int = 100,
    include_inactive: bool = False,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """List all teams."""
    query = db.query(Team)
    if not include_inactive:
        query = query.filter(Team.is_active == True)

    teams = query.offset(skip).limit(limit).all()

    # Add player counts
    result = []
    for team in teams:
        team_dict = TeamResponse.model_validate(team)
        team_dict.player_count = db.query(func.count(Player.id)).filter(
            Player.team_id == team.id,
            Player.is_active == True,
        ).scalar()
        result.append(team_dict)

    return result


@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(
    team_data: TeamCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create a new team."""
    team = Team(**team_data.model_dump())
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


@router.get("/{team_id}", response_model=TeamResponse)
def get_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get a specific team by ID."""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise NotFoundException("Team not found")

    team_response = TeamResponse.model_validate(team)
    team_response.player_count = db.query(func.count(Player.id)).filter(
        Player.team_id == team.id,
        Player.is_active == True,
    ).scalar()

    return team_response


@router.put("/{team_id}", response_model=TeamResponse)
def update_team(
    team_id: int,
    team_update: TeamUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Update a team."""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise NotFoundException("Team not found")

    update_data = team_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(team, field, value)

    db.commit()
    db.refresh(team)

    return team


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Deactivate a team."""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise NotFoundException("Team not found")

    team.is_active = False
    db.commit()


@router.get("/{team_id}/players", response_model=List)
def get_team_players(
    team_id: int,
    include_inactive: bool = False,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get all players for a team."""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise NotFoundException("Team not found")

    query = db.query(Player).filter(Player.team_id == team_id)
    if not include_inactive:
        query = query.filter(Player.is_active == True)

    return query.all()


@router.get("/{team_id}/stats", response_model=TeamStats)
def get_team_stats(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get statistics for a team."""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise NotFoundException("Team not found")

    total_players = db.query(func.count(Player.id)).filter(Player.team_id == team_id).scalar()
    active_players = db.query(func.count(Player.id)).filter(
        Player.team_id == team_id,
        Player.is_active == True,
    ).scalar()
    pitchers = db.query(func.count(Player.id)).filter(
        Player.team_id == team_id,
        Player.is_pitcher == True,
        Player.is_active == True,
    ).scalar()
    position_players = db.query(func.count(Player.id)).filter(
        Player.team_id == team_id,
        Player.is_position_player == True,
        Player.is_active == True,
    ).scalar()

    # Count assessments for team players
    from app.models import AssessmentSession
    assessment_count = db.query(func.count(AssessmentSession.id)).join(Player).filter(
        Player.team_id == team_id
    ).scalar()

    return TeamStats(
        team_id=team.id,
        team_name=team.name,
        total_players=total_players or 0,
        active_players=active_players or 0,
        pitchers=pitchers or 0,
        position_players=position_players or 0,
        assessment_count=assessment_count or 0,
    )
