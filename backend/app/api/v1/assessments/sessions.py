from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import date
import logging

from app.api.deps import get_db, get_current_active_user

logger = logging.getLogger(__name__)
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import AssessmentSession, Player
from app.schemas.assessment.session import (
    SessionCreate,
    SessionUpdate,
    SessionResponse,
    SessionWithResults,
)

router = APIRouter()


@router.get("", response_model=List[SessionResponse])
def list_sessions(
    skip: int = 0,
    limit: int = 100,
    player_id: Optional[UUID] = None,
    assessment_type: Optional[str] = None,
    is_complete: Optional[bool] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """List all assessment sessions with optional filters."""
    query = db.query(AssessmentSession)

    if player_id:
        query = query.filter(AssessmentSession.player_id == player_id)

    if assessment_type:
        query = query.filter(AssessmentSession.assessment_type == assessment_type)

    if is_complete is not None:
        query = query.filter(AssessmentSession.is_complete == is_complete)

    if start_date:
        query = query.filter(AssessmentSession.assessment_date >= start_date)

    if end_date:
        query = query.filter(AssessmentSession.assessment_date <= end_date)

    sessions = query.order_by(AssessmentSession.assessment_date.desc()).offset(skip).limit(limit).all()

    result = []
    for session in sessions:
        session_data = _build_session_response(session, db)
        result.append(session_data)

    return result


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    session_data: SessionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create a new assessment session."""
    print(f"[SESSION CREATE] player_id={session_data.player_id}, type={session_data.assessment_type}, date={session_data.assessment_date}")

    # Debug: list all players
    all_players = db.query(Player).all()
    print(f"[SESSION CREATE] All players in DB: {[(p.id, p.full_name) for p in all_players]}")

    # Validate player exists
    player = db.query(Player).filter(Player.id == session_data.player_id).first()
    if not player:
        print(f"[SESSION CREATE] Player not found: {session_data.player_id}")
        raise BadRequestException("Player not found")

    # Check for duplicate session
    existing = db.query(AssessmentSession).filter(
        AssessmentSession.player_id == session_data.player_id,
        AssessmentSession.assessment_type == session_data.assessment_type,
        AssessmentSession.assessment_date == session_data.assessment_date,
    ).first()

    if existing:
        print(f"[SESSION CREATE] Duplicate session found for player {session_data.player_id}")
        raise BadRequestException(
            f"Assessment session already exists for this player, type, and date"
        )

    session = AssessmentSession(
        **session_data.model_dump(),
        assessed_by=current_user.id,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return _build_session_response(session, db)


@router.get("/{session_id}", response_model=SessionWithResults)
def get_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get a specific session with all results."""
    session = db.query(AssessmentSession).filter(AssessmentSession.id == session_id).first()
    if not session:
        raise NotFoundException("Session not found")

    return _build_session_with_results(session, db)


@router.put("/{session_id}", response_model=SessionResponse)
def update_session(
    session_id: UUID,
    session_update: SessionUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Update a session."""
    session = db.query(AssessmentSession).filter(AssessmentSession.id == session_id).first()
    if not session:
        raise NotFoundException("Session not found")

    update_data = session_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)

    db.commit()
    db.refresh(session)

    return _build_session_response(session, db)


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Delete a session and all its results."""
    session = db.query(AssessmentSession).filter(AssessmentSession.id == session_id).first()
    if not session:
        raise NotFoundException("Session not found")

    db.delete(session)
    db.commit()


@router.post("/{session_id}/complete", response_model=SessionResponse)
def mark_session_complete(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Mark a session as complete."""
    session = db.query(AssessmentSession).filter(AssessmentSession.id == session_id).first()
    if not session:
        raise NotFoundException("Session not found")

    session.is_complete = True
    db.commit()
    db.refresh(session)

    return _build_session_response(session, db)


def _build_session_response(session: AssessmentSession, db: Session) -> SessionResponse:
    """Build a SessionResponse from a session model."""
    player = db.query(Player).filter(Player.id == session.player_id).first()

    return SessionResponse(
        id=session.id,
        player_id=session.player_id,
        player_name=player.full_name if player else None,
        assessment_type=session.assessment_type,
        assessment_date=session.assessment_date,
        assessed_by=session.assessed_by,
        assessed_by_name=(
            session.assessed_by_user.full_name if session.assessed_by_user else None
        ),
        notes=session.notes,
        is_complete=session.is_complete,
        created_at=session.created_at,
        updated_at=session.updated_at,
    )


def _build_session_with_results(session: AssessmentSession, db: Session) -> SessionWithResults:
    """Build a SessionWithResults from a session model."""
    base_response = _build_session_response(session, db)

    # Get results based on assessment type
    results = []
    if session.assessment_type == "onbaseu":
        results = [r.__dict__ for r in session.onbaseu_results]
    elif session.assessment_type == "pitcher_onbaseu":
        results = [r.__dict__ for r in session.pitcher_onbaseu_results]
    elif session.assessment_type == "tpi_power":
        results = [r.__dict__ for r in session.tpi_power_results]
    elif session.assessment_type == "sprint":
        results = [r.__dict__ for r in session.sprint_results]
    elif session.assessment_type == "kams":
        results = [r.__dict__ for r in session.kams_results]

    return SessionWithResults(
        **base_response.model_dump(),
        results=results,
    )
