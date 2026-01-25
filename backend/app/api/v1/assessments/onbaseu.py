from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import AssessmentSession, OnBaseUResult
from app.schemas.assessment.onbaseu import (
    OnBaseUResultCreate,
    OnBaseUResultUpdate,
    OnBaseUResultResponse,
    OnBaseUBulkCreate,
    OnBaseUTestDefinition,
    ONBASEU_TESTS,
)
from app.services.assessment.onbaseu_service import OnBaseUScoringService

router = APIRouter()
scoring_service = OnBaseUScoringService()


@router.get("/tests", response_model=List[OnBaseUTestDefinition])
def get_test_definitions(
    current_user=Depends(get_current_active_user),
):
    """Get all OnBaseU test definitions."""
    return ONBASEU_TESTS


@router.get("/{session_id}/results", response_model=List[OnBaseUResultResponse])
def get_session_results(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get all results for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "onbaseu",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not an OnBaseU session")

    return session.onbaseu_results


@router.post("/{session_id}/results", response_model=OnBaseUResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(
    session_id: UUID,
    result_data: OnBaseUResultCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create a single result for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "onbaseu",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not an OnBaseU session")

    # Check for duplicate
    existing = db.query(OnBaseUResult).filter(
        OnBaseUResult.session_id == session_id,
        OnBaseUResult.test_code == result_data.test_code,
        OnBaseUResult.side == result_data.side,
    ).first()

    if existing:
        raise BadRequestException("Result already exists for this test and side")

    # Calculate score and color
    score, color = scoring_service.score_result(result_data.result)

    result = OnBaseUResult(
        session_id=session_id,
        **result_data.model_dump(),
        score=score,
        color=color,
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return result


@router.post("/{session_id}/results/bulk", response_model=List[OnBaseUResultResponse], status_code=status.HTTP_201_CREATED)
def create_bulk_results(
    session_id: UUID,
    bulk_data: OnBaseUBulkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create multiple results for a session at once."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "onbaseu",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not an OnBaseU session")

    results = []
    for result_data in bulk_data.results:
        # Check for duplicate
        existing = db.query(OnBaseUResult).filter(
            OnBaseUResult.session_id == session_id,
            OnBaseUResult.test_code == result_data.test_code,
            OnBaseUResult.side == result_data.side,
        ).first()

        if existing:
            continue  # Skip duplicates in bulk create

        score, color = scoring_service.score_result(result_data.result)

        result = OnBaseUResult(
            session_id=session_id,
            **result_data.model_dump(),
            score=score,
            color=color,
        )

        db.add(result)
        results.append(result)

    db.commit()

    # Refresh all results
    for result in results:
        db.refresh(result)

    return results


@router.put("/{session_id}/results/{result_id}", response_model=OnBaseUResultResponse)
def update_result(
    session_id: UUID,
    result_id: UUID,
    result_update: OnBaseUResultUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Update a specific result."""
    result = db.query(OnBaseUResult).filter(
        OnBaseUResult.id == result_id,
        OnBaseUResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    update_data = result_update.model_dump(exclude_unset=True)

    # Recalculate score if result is being updated
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
    result = db.query(OnBaseUResult).filter(
        OnBaseUResult.id == result_id,
        OnBaseUResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    db.delete(result)
    db.commit()
