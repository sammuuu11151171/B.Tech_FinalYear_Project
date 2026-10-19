from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.auth import UserCreate, UserLogin, UserProfileUpdate
from app.core.security import hash_password, verify_password, create_access_token

def register_user(db: Session, user_in: UserCreate, ip_address: Optional[str] = None) -> User:
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists.",
        )
    
    # Create new user
    user = User(
        email=user_in.email.lower().strip(),
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name.strip(),
        role=user_in.role or "student",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Log audit event
    audit = AuditLog(
        user_id=user.id,
        action="USER_REGISTERED",
        details_json=f'{{"email": "{user.email}", "role": "{user.role}"}}',
        ip_address=ip_address,
    )
    db.add(audit)
    db.commit()

    return user

def authenticate_user(db: Session, login_data: UserLogin, ip_address: Optional[str] = None) -> dict:
    user = db.query(User).filter(User.email == login_data.email.lower().strip()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated. Please contact an administrator.",
        )

    access_token = create_access_token(subject=user.email, role=user.role)

    # Audit log
    audit = AuditLog(
        user_id=user.id,
        action="USER_LOGIN_SUCCESS",
        details_json=f'{{"email": "{user.email}"}}',
        ip_address=ip_address,
    )
    db.add(audit)
    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }

def update_user_profile(db: Session, user: User, update_data: UserProfileUpdate) -> User:
    if update_data.full_name:
        user.full_name = update_data.full_name.strip()

    if update_data.new_password:
        if not update_data.current_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is required to set a new password.",
            )
        if not verify_password(update_data.current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password.",
            )
        user.hashed_password = hash_password(update_data.new_password)

    db.commit()
    db.refresh(user)
    return user
