from datetime import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, EmailStr, Field

class UserAdminView(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class UserRoleUpdate(BaseModel):
    role: str = Field(..., pattern="^(student|teacher|admin)$")

class UserStatusUpdate(BaseModel):
    is_active: bool

class SystemOverviewStats(BaseModel):
    total_users: int
    student_count: int
    teacher_count: int
    admin_count: int
    total_lessons: int
    total_quizzes: int
    total_practice_attempts: int
    total_quiz_attempts: int
    database_status: str
    model_status: str
    rag_status: str

class AuditLogOut(BaseModel):
    id: int
    user_id: Optional[int]
    user_email: Optional[str] = None
    action: str
    details: Optional[str]
    ip_address: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}

