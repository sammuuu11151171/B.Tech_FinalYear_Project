from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Validates the JWT token and returns the current authenticated User."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or session has expired.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception

    user_email: str = payload.get("sub")
    if not user_email:
        raise credentials_exception

    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated. Please contact an administrator.",
        )
    return user

def get_optional_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Retrieves user if token is provided, returns None otherwise."""
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    user_email = payload.get("sub")
    if not user_email:
        return None
    return db.query(User).filter(User.email == user_email, User.is_active == True).first()

def require_role(allowed_roles: List[str]):
    """Role-based authorization guard enforced on the backend."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role in {allowed_roles}, but current role is '{current_user.role}'.",
            )
        return current_user
    return role_checker

# Explicit role dependencies
require_student = require_role(["student", "teacher", "admin"])
require_teacher = require_role(["teacher", "admin"])
require_admin = require_role(["admin"])
