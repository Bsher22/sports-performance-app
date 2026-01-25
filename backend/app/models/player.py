from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.db.base import Base


class Player(Base):
    __tablename__ = "players"
    __table_args__ = {"schema": "organization"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    player_code = Column(String(20), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    team_id = Column(Integer, ForeignKey("organization.teams.id"), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    date_of_birth = Column(Date, nullable=True)

    # Player type flags
    is_pitcher = Column(Boolean, default=False)
    is_position_player = Column(Boolean, default=True)

    # Physical attributes
    bats = Column(String(1), nullable=True)  # R, L, S
    throws = Column(String(1), nullable=True)  # R, L
    height_inches = Column(Integer, nullable=True)
    weight_lbs = Column(Integer, nullable=True)

    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    team = relationship("Team", back_populates="players")
    assessment_sessions = relationship(
        "AssessmentSession", back_populates="player", cascade="all, delete-orphan"
    )

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    @property
    def display_name(self) -> str:
        team_name = self.team.name if self.team else "No Team"
        return f"{self.full_name} (Team: {team_name})"
