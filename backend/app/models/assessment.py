from sqlalchemy import Column, String, Boolean, Date, DateTime, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.db.base import Base


class AssessmentSession(Base):
    """Central assessment session tracking."""

    __tablename__ = "sessions"
    __table_args__ = (
        UniqueConstraint("player_id", "assessment_type", "assessment_date", name="uq_session_player_type_date"),
        {"schema": "assessments"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    player_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organization.players.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    assessment_type = Column(String(50), nullable=False, index=True)
    assessment_date = Column(Date, nullable=False, index=True)
    assessed_by = Column(UUID(as_uuid=True), ForeignKey("auth.users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    is_complete = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    player = relationship("Player", back_populates="assessment_sessions")
    assessed_by_user = relationship("User", back_populates="assessment_sessions")
    onbaseu_results = relationship(
        "OnBaseUResult", back_populates="session", cascade="all, delete-orphan"
    )
    pitcher_onbaseu_results = relationship(
        "PitcherOnBaseUResult", back_populates="session", cascade="all, delete-orphan"
    )
    tpi_power_results = relationship(
        "TPIPowerResult", back_populates="session", cascade="all, delete-orphan"
    )
    sprint_results = relationship(
        "SprintResult", back_populates="session", cascade="all, delete-orphan"
    )
    kams_results = relationship(
        "KAMSResult", back_populates="session", cascade="all, delete-orphan"
    )
