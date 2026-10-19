from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import require_admin
from app.models.user import User
from app.schemas.admin import (
    UserAdminView,
    UserRoleUpdate,
    UserStatusUpdate,
    SystemOverviewStats,
    AuditLogOut,
)
from app.services import admin_service

router = APIRouter(prefix="/admin", tags=["Administrator Operations"])

@router.get("/overview", response_model=SystemOverviewStats)
def get_admin_overview(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Retrieves real database-backed overview stats for system administration."""
    return admin_service.get_system_overview(db)

@router.get("/users", response_model=List[UserAdminView])
def get_users(
    role: Optional[str] = Query(None, description="Filter users by role"),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Lists registered accounts with active/inactive status and roles."""
    return admin_service.list_all_users(db, role=role)

@router.patch("/users/{user_id}/role", response_model=UserAdminView)
def change_user_role(
    user_id: int,
    payload: UserRoleUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Updates a user's role with administrative validation."""
    return admin_service.update_user_role(db, target_user_id=user_id, new_role=payload.role, admin_user=admin)

@router.patch("/users/{user_id}/status", response_model=UserAdminView)
def toggle_user_status(
    user_id: int,
    payload: UserStatusUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Activates or deactivates a user account."""
    return admin_service.toggle_user_active_status(db, target_user_id=user_id, is_active=payload.is_active, admin_user=admin)

@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_trail(
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Retrieves recent system audit trail entries."""
    return admin_service.get_audit_logs(db, limit=limit)
