from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_user, get_optional_user
from app.models.user import User
from app.schemas.lesson import LessonWithProgressOut
from app.services import lesson_service

router = APIRouter(prefix="/lessons", tags=["Lessons"])

@router.get("", response_model=List[LessonWithProgressOut])
def get_lessons(
    category: Optional[str] = Query(None, description="Filter by category: alphabet, number, words"),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Retrieves list of published ISL lessons with user-specific progress indicators."""
    return lesson_service.get_lessons(db, category=category, current_user=current_user)

@router.get("/{lesson_id}", response_model=LessonWithProgressOut)
def get_lesson(
    lesson_id: int,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Retrieves full details for a specific ISL lesson."""
    return lesson_service.get_lesson_by_id(db, lesson_id=lesson_id, current_user=current_user)

@router.post("/{lesson_id}/complete", status_code=status.HTTP_200_OK)
def mark_complete(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Marks a lesson as completed for the authenticated learner."""
    return lesson_service.mark_lesson_complete(db, lesson_id=lesson_id, user=current_user)
