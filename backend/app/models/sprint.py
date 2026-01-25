from sqlalchemy import Column, String, Text, DateTime, ForeignKey, UniqueConstraint, CheckConstraint, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.db.base import Base


class SprintResult(Base):
    """Sprint Assessment Results."""

    __tablename__ = "sprint_results"
    __table_args__ = (
        UniqueConstraint("session_id", "test_code", name="uq_sprint_session_test"),
        CheckConstraint(
            "color IN ('green', 'yellow', 'red')", name="ck_sprint_color_valid"
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
    test_category = Column(String(50), nullable=False)  # linear, directional, curvilinear

    # Equipment/conditions
    shoe_type = Column(String(50), nullable=True)
    surface_type = Column(String(50), nullable=True)

    # Run times (up to 3 attempts)
    run_1_time = Column(Numeric(5, 3), nullable=True)
    run_2_time = Column(Numeric(5, 3), nullable=True)
    run_3_time = Column(Numeric(5, 3), nullable=True)
    best_time = Column(Numeric(5, 3), nullable=True)

    # Computed scoring
    score_percentage = Column(Numeric(5, 2), nullable=True)
    color = Column(String(10), nullable=True)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    session = relationship("AssessmentSession", back_populates="sprint_results")

    def calculate_best_time(self):
        """Calculate the best time from the 3 runs."""
        times = [t for t in [self.run_1_time, self.run_2_time, self.run_3_time] if t is not None]
        if times:
            self.best_time = min(times)
