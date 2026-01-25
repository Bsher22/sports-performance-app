from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import AssessmentSession, PitcherOnBaseUResult
from app.schemas.assessment.pitcher_onbaseu import (
    PitcherOnBaseUResultCreate,
    PitcherOnBaseUResultUpdate,
    PitcherOnBaseUResultResponse,
    PitcherOnBaseUBulkCreate,
    PitcherOnBaseUTestDefinition,
    PITCHER_ONBASEU_TESTS,
)
from app.services.assessment.pitcher_onbaseu_service import PitcherOnBaseUScoringService

router = APIRouter()
scoring_service = PitcherOnBaseUScoringService()


@router.get("/tests", response_model=List[PitcherOnBaseUTestDefinition])
def get_test_definitions(
    current_user=Depends(get_current_active_user),
):
    """Get all Pitcher OnBaseU test definitions."""
    return PITCHER_ONBASEU_TESTS


@router.get("/{session_id}/results", response_model=List[PitcherOnBaseUResultResponse])
def get_session_results(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get all results for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "pitcher_onbaseu",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a Pitcher OnBaseU session")

    return session.pitcher_onbaseu_results


@router.post("/{session_id}/results", response_model=PitcherOnBaseUResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(
    session_id: UUID,
    result_data: PitcherOnBaseUResultCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create a single result for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "pitcher_onbaseu",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a Pitcher OnBaseU session")

    # Check for duplicate
    existing = db.query(PitcherOnBaseUResult).filter(
        PitcherOnBaseUResult.session_id == session_id,
        PitcherOnBaseUResult.test_code == result_data.test_code,
        PitcherOnBaseUResult.side == result_data.side,
    ).first()

    if existing:
        raise BadRequestException("Result already exists for this test and side")

    # Calculate score and color
    score, color = scoring_service.score_result(result_data.result)

    result = PitcherOnBaseUResult(
        session_id=session_id,
        **result_data.model_dump(),
        score=score,
        color=color,
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return result


@router.post("/{session_id}/results/bulk", response_model=List[PitcherOnBaseUResultResponse], status_code=status.HTTP_201_CREATED)
def create_bulk_results(
    session_id: UUID,
    bulk_data: PitcherOnBaseUBulkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create multiple results for a session at once."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "pitcher_onbaseu",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a Pitcher OnBaseU session")

    results = []
    for result_data in bulk_data.results:
        existing = db.query(PitcherOnBaseUResult).filter(
            PitcherOnBaseUResult.session_id == session_id,
            PitcherOnBaseUResult.test_code == result_data.test_code,
            PitcherOnBaseUResult.side == result_data.side,
        ).first()

        if existing:
            continue

        score, color = scoring_service.score_result(result_data.result)

        result = PitcherOnBaseUResult(
            session_id=session_id,
            **result_data.model_dump(),
            score=score,
            color=color,
        )

        db.add(result)
        results.append(result)

    db.commit()

    for result in results:
        db.refresh(result)

    return results


@router.put("/{session_id}/results/{result_id}", response_model=PitcherOnBaseUResultResponse)
def update_result(
    session_id: UUID,
    result_id: UUID,
    result_update: PitcherOnBaseUResultUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Update a specific result."""
    result = db.query(PitcherOnBaseUResult).filter(
        PitcherOnBaseUResult.id == result_id,
        PitcherOnBaseUResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    update_data = result_update.model_dump(exclude_unset=True)

    if "result" in update_data:
        score, color = scoring_service.score_result(update_data["result"])
        update_data["score"] = score
        update_data["color"] = color

    for field, value in update_data.items():
        setattr(result, field, value)

    db.commit()
    db.refresh(result)

    return result


@router.delete("/{session_id}/results/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_result(
    session_id: UUID,
    result_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Delete a specific result."""
    result = db.query(PitcherOnBaseUResult).filter(
        PitcherOnBaseUResult.id == result_id,
        PitcherOnBaseUResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    db.delete(result)
    db.commit()
