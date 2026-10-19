from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="not_started", nullable=False)  # 'not_started', 'in_progress', 'completed'
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="lesson_progress")
    lesson = relationship("Lesson", back_populates="progress_records")

class PracticeAttempt(Base):
    __tablename__ = "practice_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True, index=True)
    target_sign = Column(String(50), nullable=False, index=True)
    predicted_sign = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    feedback_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="practice_attempts")
    lesson = relationship("Lesson", back_populates="practice_attempts")
