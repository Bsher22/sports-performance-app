from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class Exercise(Base):
    """Exercise library for corrective exercises."""

    __tablename__ = "exercises"
    __table_args__ = {"schema": "correctives"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    body_part = Column(String(50), nullable=True)
    movement_category = Column(String(50), nullable=True)
    difficulty_level = Column(String(20), nullable=True)
    video_url = Column(String(500), nullable=True)
    instructions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    mappings = relationship("ExerciseMapping", back_populates="exercise")


class ExerciseMapping(Base):
    """Maps assessment test results to corrective exercises."""

    __tablename__ = "exercise_mappings"
    __table_args__ = {"schema": "correctives"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    assessment_type = Column(String(50), nullable=False)
    test_code = Column(String(20), nullable=False)
    result_condition = Column(String(50), nullable=False)  # 'fail', 'neutral', 'asymmetry'
    exercise_id = Column(Integer, ForeignKey("correctives.exercises.id"), nullable=False)
    priority = Column(Integer, default=1)

    # Relationships
    exercise = relationship("Exercise", back_populates="mappings")
