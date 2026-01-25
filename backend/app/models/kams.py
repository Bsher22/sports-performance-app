from sqlalchemy import Column, String, Text, DateTime, ForeignKey, UniqueConstraint, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid
from app.db.base import Base


class KAMSResult(Base):
    """KAMS Assessment Results (Kinetic Assessment Movement Screen)."""

    __tablename__ = "kams_results"
    __table_args__ = (
        UniqueConstraint("session_id", "test_type", name="uq_kams_session_test_type"),
        {"schema": "assessments"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("assessments.sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    test_type = Column(String(50), nullable=False)  # 'rom', 'squat', 'lunge', 'balance', 'jump'

    # Flexible JSON for complex KAMS data structures
    measurements = Column(JSONB, nullable=False)

    # Computed scores
    overall_score = Column(Numeric(5, 2), nullable=True)
    symmetry_score = Column(Numeric(5, 2), nullable=True)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    session = relationship("AssessmentSession", back_populates="kams_results")
