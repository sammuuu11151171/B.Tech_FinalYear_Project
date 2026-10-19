from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False, index=True)  # 'alphabet', 'numbers', 'mixed'
    description = Column(Text, nullable=False)
    time_limit_seconds = Column(Integer, default=300, nullable=False)
    passing_score = Column(Integer, default=70, nullable=False)  # percentage
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    is_published = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan", order_by="QuizQuestion.order_index")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default="multiple_choice", nullable=False)  # 'multiple_choice', 'sign_practice'
    options_json = Column(Text, nullable=True)     # JSON string of options [A, B, C, D] or image references
    correct_answer = Column(String(255), nullable=False) # Evaluated server-side only
    target_sign = Column(String(50), nullable=True)      # Target sign for sign practice questions
    points = Column(Integer, default=10, nullable=False)
    order_index = Column(Integer, default=0, nullable=False)

    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    responses = relationship("QuizResponse", back_populates="question", cascade="all, delete-orphan")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Float, nullable=False)
    total_points = Column(Float, nullable=False)
    passed = Column(Boolean, nullable=False)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")
    responses = relationship("QuizResponse", back_populates="attempt", cascade="all, delete-orphan")

class QuizResponse(Base):
    __tablename__ = "quiz_responses"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    selected_answer = Column(String(255), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    confidence_score = Column(Float, nullable=True)

    # Relationships
    attempt = relationship("QuizAttempt", back_populates="responses")
    question = relationship("QuizQuestion", back_populates="responses")
