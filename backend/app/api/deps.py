from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from uuid import UUID

from app.config import get_settings
from app.db.session import SessionLocal
from app.models import User
from app.schemas.auth import TokenPayload
from app.core.exceptions import UnauthorizedException, ForbiddenException

settings = get_settings()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")


def get_db() -> Generator:
    """Dependency for getting database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    """Get the current authenticated user from JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)

        if token_data.sub is None:
            raise UnauthorizedException()

        if token_data.type != "access":
            raise UnauthorizedException("Invalid token type")

    except JWTError:
        raise UnauthorizedException()

    user = db.query(User).filter(User.id == UUID(token_data.sub)).first()
    if not user:
        raise UnauthorizedException("User not found")

    if not user.is_active:
        raise ForbiddenException("Inactive user")

    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Ensure the current user is active."""
    if not current_user.is_active:
        raise ForbiddenException("Inactive user")
    return current_user


def get_current_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """Ensure the current user is a superuser."""
    if not current_user.is_superuser:
        raise ForbiddenException("Not enough permissions")
    return current_user


def get_optional_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
) -> Optional[User]:
    """Get the current user if authenticated, otherwise return None."""
    if not token:
        return None

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)

        if token_data.sub is None or token_data.type != "access":
            return None

        user = db.query(User).filter(User.id == UUID(token_data.sub)).first()
        return user if user and user.is_active else None

    except JWTError:
        return None
