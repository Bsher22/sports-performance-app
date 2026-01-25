from pydantic import BaseModel, field_validator
from typing import Optional, List, Literal
from datetime import datetime, date
from uuid import UUID


class PlayerBase(BaseModel):
    first_name: str
    last_name: str
    team_id: Optional[int] = None
    sport_id: Optional[int] = None
    graduation_year: Optional[int] = None
    date_of_birth: Optional[date] = None
    is_pitcher: bool = False
    is_position_player: bool = True
    bats: Optional[Literal["R", "L", "S"]] = None
    throws: Optional[Literal["R", "L"]] = None
    height_inches: Optional[int] = None
    weight_lbs: Optional[int] = None
    is_active: bool = True


class PlayerCreate(PlayerBase):
    player_code: Optional[str] = None  # Auto-generated if not provided


class PlayerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    team_id: Optional[int] = None
    sport_id: Optional[int] = None
    graduation_year: Optional[int] = None
    date_of_birth: Optional[date] = None
    is_pitcher: Optional[bool] = None
    is_position_player: Optional[bool] = None
    bats: Optional[Literal["R", "L", "S"]] = None
    throws: Optional[Literal["R", "L"]] = None
    height_inches: Optional[int] = None
    weight_lbs: Optional[int] = None
    is_active: Optional[bool] = None


class PlayerResponse(PlayerBase):
    id: UUID
    player_code: str
    full_name: str
    display_name: str
    team_name: Optional[str] = None
    sport_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PlayerListResponse(BaseModel):
    id: UUID
    player_code: str
    full_name: str
    team_name: Optional[str] = None
    sport_id: Optional[int] = None
    sport_name: Optional[str] = None
    is_pitcher: bool
    is_position_player: bool
    is_active: bool
    graduation_year: Optional[int] = None

    class Config:
        from_attributes = True


class PlayerWithAssessments(PlayerResponse):
    assessment_count: int
    latest_assessment_date: Optional[date] = None
    assessment_types: List[str] = []
