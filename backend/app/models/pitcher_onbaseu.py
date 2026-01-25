from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.db.base import Base


class PitcherOnBaseUResult(Base):
    """Pitcher OnBaseU Assessment Results."""

    __tablename__ = "pitcher_onbaseu_results"
    __table_args__ = (
        UniqueConstraint(
            "session_id", "test_code", "side", name="uq_pitcher_onbaseu_session_test_side"
        ),
        CheckConstraint("score BETWEEN 1 AND 3", name="ck_pitcher_onbaseu_score_range"),
        CheckConstraint(
            "color IN ('green', 'yellow', 'red')", name="ck_pitcher_onbaseu_color_valid"
        ),
        {"schema": "assessments"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("assessments.sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    test_code = Column(String(20), nullable=False)
    test_name = Column(String(100), nullable=False)
    test_category = Column(String(50), nullable=False)
    subcategory = Column(String(50), nullable=True)

    # Results
    side = Column(String(10), nullable=True)
    result = Column(String(50), nullable=False)
    score = Column(Integer, nullable=False)
    color = Column(String(10), nullable=False)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    session = relationship("AssessmentSession", back_populates="pitcher_onbaseu_results")
