from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.progress import StudentDashboardSummary
from app.services import progress_service

router = APIRouter(prefix="/progress", tags=["Progress & Personalization"])

@router.get("/me", response_model=StudentDashboardSummary)
def get_my_progress_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Computes real learner metrics from database records:
    - Overall lesson and quiz metrics
    - Transparent rule-based revision recommendations
    - Real recent activity feed
    """
    return progress_service.get_student_dashboard_summary(db, user=current_user)
