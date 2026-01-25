from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import AssessmentSession, SprintResult
from app.schemas.assessment.sprint import (
    SprintResultCreate,
    SprintResultUpdate,
    SprintResultResponse,
    SprintBulkCreate,
    SprintTestDefinition,
    SPRINT_TESTS,
)
from app.services.assessment.sprint_service import SprintScoringService

router = APIRouter()
scoring_service = SprintScoringService()


@router.get("/tests", response_model=List[SprintTestDefinition])
def get_test_definitions(
    current_user=Depends(get_current_active_user),
):
    """Get all Sprint test definitions."""
    return SPRINT_TESTS


@router.get("/{session_id}/results", response_model=List[SprintResultResponse])
def get_session_results(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get all results for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "sprint",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a Sprint session")

    return session.sprint_results


@router.post("/{session_id}/results", response_model=SprintResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(
    session_id: UUID,
    result_data: SprintResultCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create a single result for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "sprint",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a Sprint session")

    # Check for duplicate
    existing = db.query(SprintResult).filter(
        SprintResult.session_id == session_id,
        SprintResult.test_code == result_data.test_code,
    ).first()

    if existing:
        raise BadRequestException("Result already exists for this test")

    # Calculate best time
    times = [t for t in [result_data.run_1_time, result_data.run_2_time, result_data.run_3_time] if t is not None]
    best_time = min(times) if times else None

    # Calculate score and color
    percentage, color = None, None
    if best_time:
        percentage, color = scoring_service.score_result(result_data.test_name, best_time)

    result = SprintResult(
        session_id=session_id,
        **result_data.model_dump(),
        best_time=best_time,
        score_percentage=percentage,
        color=color,
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return result


@router.post("/{session_id}/results/bulk", response_model=List[SprintResultResponse], status_code=status.HTTP_201_CREATED)
def create_bulk_results(
    session_id: UUID,
    bulk_data: SprintBulkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create multiple results for a session at once."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "sprint",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a Sprint session")

    results = []
    for result_data in bulk_data.results:
        existing = db.query(SprintResult).filter(
            SprintResult.session_id == session_id,
            SprintResult.test_code == result_data.test_code,
        ).first()

        if existing:
            continue

        times = [t for t in [result_data.run_1_time, result_data.run_2_time, result_data.run_3_time] if t is not None]
        best_time = min(times) if times else None

        percentage, color = None, None
        if best_time:
            percentage, color = scoring_service.score_result(result_data.test_name, best_time)

        result = SprintResult(
            session_id=session_id,
            **result_data.model_dump(),
            best_time=best_time,
            score_percentage=percentage,
            color=color,
        )

        db.add(result)
        results.append(result)

    db.commit()

    for result in results:
        db.refresh(result)

    return results


@router.put("/{session_id}/results/{result_id}", response_model=SprintResultResponse)
def update_result(
    session_id: UUID,
    result_id: UUID,
    result_update: SprintResultUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Update a specific result."""
    result = db.query(SprintResult).filter(
        SprintResult.id == result_id,
        SprintResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    update_data = result_update.model_dump(exclude_unset=True)

    # Apply updates
    for field, value in update_data.items():
        setattr(result, field, value)

    # Recalculate best time and score
    times = [t for t in [result.run_1_time, result.run_2_time, result.run_3_time] if t is not None]
    result.best_time = min(times) if times else None

    if result.best_time:
        percentage, color = scoring_service.score_result(result.test_name, float(result.best_time))
        result.score_percentage = percentage
        result.color = color

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
    result = db.query(SprintResult).filter(
        SprintResult.id == result_id,
        SprintResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    db.delete(result)
    db.commit()
