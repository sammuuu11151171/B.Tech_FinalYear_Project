from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128)
    role: Optional[str] = Field("student", pattern="^(student|teacher|admin)$")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    current_password: Optional[str] = None
    new_password: Optional[str] = Field(None, min_length=6, max_length=128)
