from sqlalchemy import Column, String, Text, DateTime, ForeignKey, UniqueConstraint, CheckConstraint, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.db.base import Base


class TPIPowerResult(Base):
    """TPI Power Assessment Results."""

    __tablename__ = "tpi_power_results"
    __table_args__ = (
        UniqueConstraint(
            "session_id", "test_code", "side", name="uq_tpi_power_session_test_side"
        ),
        CheckConstraint(
            "color IN ('blue', 'green', 'yellow', 'red')", name="ck_tpi_power_color_valid"
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

    # Measurements in inches
    result_value = Column(Numeric(10, 2), nullable=False)
    side = Column(String(10), nullable=True)  # For shot put: 'left', 'right'

    # Computed scoring
    score_percentage = Column(Numeric(5, 2), nullable=True)
    color = Column(String(10), nullable=True)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    session = relationship("AssessmentSession", back_populates="tpi_power_results")
