from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    Token,
    UserResponse,
    UserProfileUpdate,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, request: Request, db: Session = Depends(get_db)):
    """Registers a new learner, teacher, or admin account."""
    ip = request.client.host if request.client else None
    user = auth_service.register_user(db, user_in, ip_address=ip)
    auth_data = auth_service.authenticate_user(
        db, UserLogin(email=user_in.email, password=user_in.password), ip_address=ip
    )
    return auth_data

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Authenticates credentials and returns a secure JWT access token."""
    ip = request.client.host if request.client else None
    return auth_service.authenticate_user(db, login_data, ip_address=ip)

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Fetches currently authenticated user's profile details."""
    return current_user

@router.put("/me", response_model=UserResponse)
def update_profile(
    update_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Updates user display name or password."""
    return auth_service.update_user_profile(db, current_user, update_data)
