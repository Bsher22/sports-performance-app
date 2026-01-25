from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import date

from app.api.deps import get_db, get_current_active_user
from app.core.exceptions import NotFoundException
from app.services.analysis.player_analysis import PlayerAnalysisService
from app.services.analysis.team_analysis import TeamAnalysisService

router = APIRouter()


# Player Analysis Endpoints

@router.get("/player/{player_id}/progress")
def get_player_progress(
    player_id: UUID,
    assessment_type: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get player progress over time for a specific assessment type."""
    service = PlayerAnalysisService(db)
    return service.get_player_progress(player_id, assessment_type, start_date, end_date)


@router.get("/player/{player_id}/summary")
def get_player_summary(
    player_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get comprehensive player assessment summary."""
    service = PlayerAnalysisService(db)
    summary = service.get_player_summary(player_id)
    if not summary:
        raise NotFoundException("Player not found")
    return summary


@router.get("/compare")
def compare_players(
    player_ids: List[UUID] = Query(...),
    assessment_type: str = Query(...),
    as_of_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Compare multiple players on an assessment."""
    service = PlayerAnalysisService(db)
    return service.compare_players(player_ids, assessment_type, as_of_date)


# Team Analysis Endpoints

@router.get("/team/{team_id}/overview")
def get_team_overview(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get comprehensive team overview."""
    service = TeamAnalysisService(db)
    overview = service.get_team_overview(team_id)
    if not overview:
        raise NotFoundException("Team not found")
    return overview


@router.get("/team/{team_id}/trends")
def get_team_trends(
    team_id: int,
    assessment_type: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get team performance trends over time."""
    service = TeamAnalysisService(db)
    trends = service.get_team_trends(team_id, assessment_type, start_date, end_date)
    if not trends:
        raise NotFoundException("Team not found")
    return trends


@router.get("/team/{team_id}/rankings")
def get_team_rankings(
    team_id: int,
    assessment_type: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get player rankings within a team."""
    service = TeamAnalysisService(db)
    rankings = service.get_player_rankings(team_id, assessment_type)
    if not rankings:
        raise NotFoundException("Team not found")
    return rankings
