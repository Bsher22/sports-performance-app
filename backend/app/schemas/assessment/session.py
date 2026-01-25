from pydantic import BaseModel
from typing import Optional, Literal, List, Any
from datetime import datetime, date
from uuid import UUID


AssessmentType = Literal["onbaseu", "pitcher_onbaseu", "tpi_power", "sprint", "kams"]


class SessionBase(BaseModel):
    player_id: UUID
    assessment_type: AssessmentType
    assessment_date: date
    notes: Optional[str] = None


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    assessment_date: Optional[date] = None
    notes: Optional[str] = None
    is_complete: Optional[bool] = None


class SessionResponse(SessionBase):
    id: UUID
    player_name: Optional[str] = None
    assessed_by: Optional[UUID] = None
    assessed_by_name: Optional[str] = None
    is_complete: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SessionWithResults(SessionResponse):
    results: List[Any] = []
    summary: Optional[dict] = None
