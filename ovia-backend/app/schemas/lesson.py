from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class LessonBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    sign_label: str = Field(..., min_length=1, max_length=50)
    category: str = Field(..., pattern="^(alphabet|number|words)$")
    description: str
    instructions: str
    reference_image_url: Optional[str] = None
    video_url: Optional[str] = None
    difficulty: str = Field("beginner", pattern="^(beginner|intermediate|advanced)$")
    order_index: int = 0
    is_published: bool = True

class LessonCreate(LessonBase):
    pass

class LessonUpdate(BaseModel):
    title: Optional[str] = None
    sign_label: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    reference_image_url: Optional[str] = None
    video_url: Optional[str] = None
    difficulty: Optional[str] = None
    order_index: Optional[int] = None
    is_published: Optional[bool] = None

class LessonOut(LessonBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class LessonWithProgressOut(LessonOut):
    status: str = "not_started"  # 'not_started', 'in_progress', 'completed'
    completed_at: Optional[datetime] = None
