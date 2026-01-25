from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import datetime
from app.db.base import Base


class Sport(Base):
    __tablename__ = "sports"
    __table_args__ = {"schema": "organization"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(20), nullable=False, unique=True)  # e.g., 'baseball', 'soccer', 'hockey'
    description = Column(Text, nullable=True)

    # Available assessment types for this sport
    available_assessments = Column(ARRAY(String), nullable=False, default=[])

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    players = relationship("Player", back_populates="sport")
