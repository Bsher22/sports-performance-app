from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.api.deps import get_db
from app.config import get_settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_password_hash,
)
from app.core.exceptions import UnauthorizedException, BadRequestException
from app.models import User
from app.schemas.auth import Token, Login, RefreshToken, TokenPayload
from app.schemas.user import UserCreate, UserResponse

settings = get_settings()
router = APIRouter()


@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    """OAuth2 compatible token login."""
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise UnauthorizedException("Incorrect email or password")

    if not verify_password(form_data.password, user.password_hash):
        raise UnauthorizedException("Incorrect email or password")

    if not user.is_active:
        raise UnauthorizedException("Inactive user")

    return Token(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
        token_type="bearer",
    )


@router.post("/login/json", response_model=Token)
def login_json(
    login_data: Login,
    db: Session = Depends(get_db),
):
    """JSON body login endpoint."""
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise UnauthorizedException("Incorrect email or password")

    if not verify_password(login_data.password, user.password_hash):
        raise UnauthorizedException("Incorrect email or password")

    if not user.is_active:
        raise UnauthorizedException("Inactive user")

    return Token(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
        token_type="bearer",
    )


@router.post("/refresh", response_model=Token)
def refresh_token(
    token_data: RefreshToken,
    db: Session = Depends(get_db),
):
    """Refresh access token using refresh token."""
    try:
        payload = jwt.decode(
            token_data.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_payload = TokenPayload(**payload)

        if token_payload.type != "refresh":
            raise UnauthorizedException("Invalid token type")

        if token_payload.sub is None:
            raise UnauthorizedException("Invalid token")

    except JWTError:
        raise UnauthorizedException("Invalid token")

    user = db.query(User).filter(User.id == token_payload.sub).first()
    if not user:
        raise UnauthorizedException("User not found")

    if not user.is_active:
        raise UnauthorizedException("Inactive user")

    return Token(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
        token_type="bearer",
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    """Register a new user."""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise BadRequestException("Email already registered")

    # Create new user
    user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        is_active=user_data.is_active,
        is_superuser=False,  # Never allow self-registration as superuser
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
