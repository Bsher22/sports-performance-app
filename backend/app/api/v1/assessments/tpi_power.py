from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import AssessmentSession, TPIPowerResult
from app.schemas.assessment.tpi_power import (
    TPIPowerResultCreate,
    TPIPowerResultUpdate,
    TPIPowerResultResponse,
    TPIPowerBulkCreate,
    TPIPowerTestDefinition,
    TPI_POWER_TESTS,
)
from app.services.assessment.tpi_power_service import TPIPowerScoringService

router = APIRouter()
scoring_service = TPIPowerScoringService()


@router.get("/tests", response_model=List[TPIPowerTestDefinition])
def get_test_definitions(
    current_user=Depends(get_current_active_user),
):
    """Get all TPI Power test definitions."""
    return TPI_POWER_TESTS


@router.get("/{session_id}/results", response_model=List[TPIPowerResultResponse])
def get_session_results(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get all results for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "tpi_power",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a TPI Power session")

    return session.tpi_power_results


@router.post("/{session_id}/results", response_model=TPIPowerResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(
    session_id: UUID,
    result_data: TPIPowerResultCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create a single result for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "tpi_power",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a TPI Power session")

    # Check for duplicate
    existing = db.query(TPIPowerResult).filter(
        TPIPowerResult.session_id == session_id,
        TPIPowerResult.test_code == result_data.test_code,
        TPIPowerResult.side == result_data.side,
    ).first()

    if existing:
        raise BadRequestException("Result already exists for this test and side")

    # Get vertical jump value for relative scoring
    vertical_jump = None
    vj_result = db.query(TPIPowerResult).filter(
        TPIPowerResult.session_id == session_id,
        TPIPowerResult.test_code == "TPI-01",  # Vertical Jump
    ).first()
    if vj_result:
        vertical_jump = float(vj_result.result_value)

    # Calculate score and color
    percentage, color = scoring_service.score_result(
        result_data.test_name,
        float(result_data.result_value),
        vertical_jump=vertical_jump,
        is_off_side=(result_data.side == "left") if result_data.side else False,
    )

    result = TPIPowerResult(
        session_id=session_id,
        **result_data.model_dump(),
        score_percentage=percentage,
        color=color,
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return result


@router.post("/{session_id}/results/bulk", response_model=List[TPIPowerResultResponse], status_code=status.HTTP_201_CREATED)
def create_bulk_results(
    session_id: UUID,
    bulk_data: TPIPowerBulkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create multiple results for a session at once."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "tpi_power",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a TPI Power session")

    # First, find vertical jump in the batch
    vertical_jump = None
    for result_data in bulk_data.results:
        if result_data.test_code == "TPI-01":
            vertical_jump = float(result_data.result_value)
            break

    results = []
    for result_data in bulk_data.results:
        existing = db.query(TPIPowerResult).filter(
            TPIPowerResult.session_id == session_id,
            TPIPowerResult.test_code == result_data.test_code,
            TPIPowerResult.side == result_data.side,
        ).first()

        if existing:
            continue

        percentage, color = scoring_service.score_result(
            result_data.test_name,
            float(result_data.result_value),
            vertical_jump=vertical_jump,
            is_off_side=(result_data.side == "left") if result_data.side else False,
        )

        result = TPIPowerResult(
            session_id=session_id,
            **result_data.model_dump(),
            score_percentage=percentage,
            color=color,
        )

        db.add(result)
        results.append(result)

    db.commit()

    for result in results:
        db.refresh(result)

    return results


@router.put("/{session_id}/results/{result_id}", response_model=TPIPowerResultResponse)
def update_result(
    session_id: UUID,
    result_id: UUID,
    result_update: TPIPowerResultUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Update a specific result."""
    result = db.query(TPIPowerResult).filter(
        TPIPowerResult.id == result_id,
        TPIPowerResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    update_data = result_update.model_dump(exclude_unset=True)

    if "result_value" in update_data:
        # Get vertical jump for scoring
        vertical_jump = None
        vj_result = db.query(TPIPowerResult).filter(
            TPIPowerResult.session_id == session_id,
            TPIPowerResult.test_code == "TPI-01",
        ).first()
        if vj_result:
            vertical_jump = float(vj_result.result_value)

        percentage, color = scoring_service.score_result(
            result.test_name,
            float(update_data["result_value"]),
            vertical_jump=vertical_jump,
            is_off_side=(result.side == "left") if result.side else False,
        )
        update_data["score_percentage"] = percentage
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
    result = db.query(TPIPowerResult).filter(
        TPIPowerResult.id == result_id,
        TPIPowerResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    db.delete(result)
    db.commit()
