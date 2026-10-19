from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.quiz import (
    QuizOut,
    QuizDetailOut,
    QuizSubmitRequest,
    QuizAttemptOut,
)
from app.services import quiz_service

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.get("", response_model=List[QuizOut])
def get_all_quizzes(
    category: Optional[str] = Query(None, description="Filter by category: alphabet, number, mixed"),
    db: Session = Depends(get_db),
):
    """Fetches all published ISL quizzes."""
    return quiz_service.list_quizzes(db, category=category)

@router.get("/attempts/me", response_model=List[QuizAttemptOut])
def get_my_quiz_attempts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieves authenticated learner's quiz attempt history."""
    return quiz_service.get_user_quiz_history(db, user=current_user)

@router.get("/{quiz_id}", response_model=QuizDetailOut)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    """Fetches quiz questions with options (correct answers omitted for test security)."""
    return quiz_service.get_quiz_detail(db, quiz_id=quiz_id)

@router.post("/{quiz_id}/submit", response_model=QuizAttemptOut)
def submit_quiz(
    quiz_id: int,
    submission: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submits responses, grades them on the server, and records the score."""
    return quiz_service.submit_quiz_attempt(db, quiz_id=quiz_id, submission=submission, current_user=current_user)
