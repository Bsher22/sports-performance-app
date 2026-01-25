from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.deps import get_db, get_current_active_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import Sport
from app.schemas.sport import (
    SportCreate,
    SportUpdate,
    SportResponse,
    SportListResponse,
)

router = APIRouter()


@router.get("", response_model=List[SportListResponse])
def list_sports(
    skip: int = 0,
    limit: int = 100,
    include_inactive: bool = False,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """List all sports."""
    query = db.query(Sport)
    if not include_inactive:
        query = query.filter(Sport.is_active == True)

    sports = query.offset(skip).limit(limit).all()
    return sports


@router.post("", response_model=SportResponse, status_code=status.HTTP_201_CREATED)
def create_sport(
    sport_data: SportCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create a new sport."""
    # Check for duplicate code
    existing = db.query(Sport).filter(Sport.code == sport_data.code).first()
    if existing:
        raise BadRequestException(f"Sport with code '{sport_data.code}' already exists")

    sport = Sport(**sport_data.model_dump())
    db.add(sport)
    db.commit()
    db.refresh(sport)
    return sport


@router.get("/{sport_id}", response_model=SportResponse)
def get_sport(
    sport_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get a specific sport by ID."""
    sport = db.query(Sport).filter(Sport.id == sport_id).first()
    if not sport:
        raise NotFoundException("Sport not found")
    return sport


@router.put("/{sport_id}", response_model=SportResponse)
def update_sport(
    sport_id: int,
    sport_update: SportUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Update a sport."""
    sport = db.query(Sport).filter(Sport.id == sport_id).first()
    if not sport:
        raise NotFoundException("Sport not found")

    update_data = sport_update.model_dump(exclude_unset=True)

    # Check for duplicate code if being updated
    if "code" in update_data and update_data["code"] != sport.code:
        existing = db.query(Sport).filter(Sport.code == update_data["code"]).first()
        if existing:
            raise BadRequestException(
                f"Sport with code '{update_data['code']}' already exists"
            )

    for field, value in update_data.items():
        setattr(sport, field, value)

    db.commit()
    db.refresh(sport)
    return sport


@router.delete("/{sport_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sport(
    sport_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Deactivate a sport."""
    sport = db.query(Sport).filter(Sport.id == sport_id).first()
    if not sport:
        raise NotFoundException("Sport not found")

    sport.is_active = False
    db.commit()
