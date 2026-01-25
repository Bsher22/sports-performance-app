from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserRoleResponse(BaseModel):
    role_name: str
    team_id: Optional[int] = None

    class Config:
        from_attributes = True


class UserResponse(UserBase):
    id: UUID
    full_name: str
    created_at: datetime
    updated_at: datetime
    roles: List[UserRoleResponse] = []

    class Config:
        from_attributes = True


class UserInDB(UserBase):
    id: UUID
    password_hash: str

    class Config:
        from_attributes = True
