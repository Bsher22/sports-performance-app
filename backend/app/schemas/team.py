from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TeamBase(BaseModel):
    name: str
    organization: Optional[str] = None
    sport: str = "baseball"
    is_active: bool = True


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    organization: Optional[str] = None
    sport: Optional[str] = None
    is_active: Optional[bool] = None


class TeamResponse(TeamBase):
    id: int
    created_at: datetime
    updated_at: datetime
    player_count: Optional[int] = None

    class Config:
        from_attributes = True


class TeamStats(BaseModel):
    team_id: int
    team_name: str
    total_players: int
    active_players: int
    pitchers: int
    position_players: int
    assessment_count: int
