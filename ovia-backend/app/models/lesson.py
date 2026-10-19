from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    sign_label = Column(String(50), nullable=False, index=True)  # e.g. "A", "B", "1", "2"
    category = Column(String(50), nullable=False, index=True)    # 'alphabet', 'number', 'words'
    description = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)                 # Step-by-step visual instructions
    reference_image_url = Column(String(500), nullable=True)     # Managed path or static asset URL
    video_url = Column(String(500), nullable=True)
    difficulty = Column(String(50), default="beginner", nullable=False)  # 'beginner', 'intermediate', 'advanced'
    order_index = Column(Integer, default=0, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    progress_records = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")
    practice_attempts = relationship("PracticeAttempt", back_populates="lesson")
