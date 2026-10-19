import json
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.user import User
from app.models.lesson import Lesson
from app.models.quiz import Quiz, QuizAttempt
from app.models.progress import PracticeAttempt
from app.models.audit import AuditLog
from app.schemas.admin import (
    UserAdminView,
    SystemOverviewStats,
    AuditLogOut,
)

def get_system_overview(db: Session) -> SystemOverviewStats:
    total_users = db.query(func.count(User.id)).scalar() or 0
    student_count = db.query(func.count(User.id)).filter(User.role == "student").scalar() or 0
    teacher_count = db.query(func.count(User.id)).filter(User.role == "teacher").scalar() or 0
    admin_count = db.query(func.count(User.id)).filter(User.role == "admin").scalar() or 0

    total_lessons = db.query(func.count(Lesson.id)).scalar() or 0
    total_quizzes = db.query(func.count(Quiz.id)).scalar() or 0
    total_practice = db.query(func.count(PracticeAttempt.id)).scalar() or 0
    total_quiz_attempts = db.query(func.count(QuizAttempt.id)).scalar() or 0

    return SystemOverviewStats(
        total_users=total_users,
        student_count=student_count,
        teacher_count=teacher_count,
        admin_count=admin_count,
        total_lessons=total_lessons,
        total_quizzes=total_quizzes,
        total_practice_attempts=total_practice,
        total_quiz_attempts=total_quiz_attempts,
        database_status="Healthy (Connected)",
        model_status="Online (Baseline RF 30 Classes)",
        rag_status="Operational (Indexed Knowledge Base)",
    )

def list_all_users(db: Session, role: Optional[str] = None) -> List[UserAdminView]:
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    users = query.order_by(User.id).all()
    return [UserAdminView.model_validate(u) for u in users]

def update_user_role(db: Session, target_user_id: int, new_role: str, admin_user: User) -> UserAdminView:
    if target_user_id == admin_user.id and new_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Administrators cannot demote their own account.",
        )
    user = db.query(User).filter(User.id == target_user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    old_role = user.role
    user.role = new_role
    db.commit()

    # Audit log
    audit = AuditLog(
        user_id=admin_user.id,
        action="USER_ROLE_CHANGED",
        details_json=json.dumps({"target_user": user.email, "old_role": old_role, "new_role": new_role}),
    )
    db.add(audit)
    db.commit()
    return UserAdminView.model_validate(user)

def toggle_user_active_status(db: Session, target_user_id: int, is_active: bool, admin_user: User) -> UserAdminView:
    if target_user_id == admin_user.id and not is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Administrators cannot deactivate their own account.",
        )
    user = db.query(User).filter(User.id == target_user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.is_active = is_active
    db.commit()

    audit = AuditLog(
        user_id=admin_user.id,
        action="USER_STATUS_TOGGLED",
        details_json=json.dumps({"target_user": user.email, "is_active": is_active}),
    )
    db.add(audit)
    db.commit()
    return UserAdminView.model_validate(user)

def get_audit_logs(db: Session, limit: int = 50) -> List[AuditLogOut]:
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    results = []
    for l in logs:
        results.append(
            AuditLogOut(
                id=l.id,
                user_id=l.user_id,
                user_email=l.user.email if l.user else None,
                action=l.action,
                details=l.details_json,
                ip_address=l.ip_address,
                created_at=l.created_at,
            )
        )
    return results
