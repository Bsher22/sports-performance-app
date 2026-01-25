from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import AssessmentSession, KAMSResult
from app.schemas.assessment.kams import (
    KAMSResultCreate,
    KAMSResultUpdate,
    KAMSResultResponse,
    KAMSBulkCreate,
    KAMSTestDefinition,
    KAMS_TESTS,
)
from app.services.assessment.kams_service import KAMSScoringService

router = APIRouter()
scoring_service = KAMSScoringService()


@router.get("/tests", response_model=List[KAMSTestDefinition])
def get_test_definitions(
    current_user=Depends(get_current_active_user),
):
    """Get all KAMS test definitions."""
    return KAMS_TESTS


@router.get("/{session_id}/results", response_model=List[KAMSResultResponse])
def get_session_results(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get all results for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "kams",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a KAMS session")

    return session.kams_results


@router.post("/{session_id}/results", response_model=KAMSResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(
    session_id: UUID,
    result_data: KAMSResultCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create a single result for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "kams",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a KAMS session")

    # Check for duplicate
    existing = db.query(KAMSResult).filter(
        KAMSResult.session_id == session_id,
        KAMSResult.test_type == result_data.test_type,
    ).first()

    if existing:
        raise BadRequestException("Result already exists for this test type")

    # Calculate scores
    overall_score, symmetry_score = scoring_service.score_result(
        result_data.test_type,
        result_data.measurements,
    )

    result = KAMSResult(
        session_id=session_id,
        **result_data.model_dump(),
        overall_score=overall_score,
        symmetry_score=symmetry_score,
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return result


@router.post("/{session_id}/results/bulk", response_model=List[KAMSResultResponse], status_code=status.HTTP_201_CREATED)
def create_bulk_results(
    session_id: UUID,
    bulk_data: KAMSBulkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create multiple results for a session at once."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "kams",
    ).first()

    if not session:
        raise NotFoundException("Session not found or is not a KAMS session")

    results = []
    for result_data in bulk_data.results:
        existing = db.query(KAMSResult).filter(
            KAMSResult.session_id == session_id,
            KAMSResult.test_type == result_data.test_type,
        ).first()

        if existing:
            continue

        overall_score, symmetry_score = scoring_service.score_result(
            result_data.test_type,
            result_data.measurements,
        )

        result = KAMSResult(
            session_id=session_id,
            **result_data.model_dump(),
            overall_score=overall_score,
            symmetry_score=symmetry_score,
        )

        db.add(result)
        results.append(result)

    db.commit()

    for result in results:
        db.refresh(result)

    return results


@router.put("/{session_id}/results/{result_id}", response_model=KAMSResultResponse)
def update_result(
    session_id: UUID,
    result_id: UUID,
    result_update: KAMSResultUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Update a specific result."""
    result = db.query(KAMSResult).filter(
        KAMSResult.id == result_id,
        KAMSResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    update_data = result_update.model_dump(exclude_unset=True)

    if "measurements" in update_data:
        overall_score, symmetry_score = scoring_service.score_result(
            result.test_type,
            update_data["measurements"],
        )
        update_data["overall_score"] = overall_score
        update_data["symmetry_score"] = symmetry_score

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
    result = db.query(KAMSResult).filter(
        KAMSResult.id == result_id,
        KAMSResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    db.delete(result)
    db.commit()


@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_kams_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Upload a KAMS PDF for processing (future implementation)."""
    if not file.filename.endswith(".pdf"):
        raise BadRequestException("Only PDF files are accepted")

    # This would be implemented to parse the KAMS PDF
    # For now, return a placeholder response
    return {
        "message": "PDF upload received",
        "filename": file.filename,
        "status": "processing",
        "note": "PDF parsing not yet implemented - please enter data manually",
    }
