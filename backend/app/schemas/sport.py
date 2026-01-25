from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SportBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    available_assessments: List[str] = []
    is_active: bool = True


class SportCreate(SportBase):
    pass


class SportUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    available_assessments: Optional[List[str]] = None
    is_active: Optional[bool] = None


class SportResponse(SportBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SportListResponse(BaseModel):
    id: int
    name: str
    code: str
    available_assessments: List[str]
    is_active: bool

    class Config:
        from_attributes = True
