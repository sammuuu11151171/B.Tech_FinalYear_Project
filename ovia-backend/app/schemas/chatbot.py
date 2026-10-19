from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class SourceCitation(BaseModel):
    title: str
    category: str
    lesson_id: Optional[int] = None
    sign_label: Optional[str] = None
    reference_image_url: Optional[str] = None
    similarity_score: float
    snippet: str

class ChatQueryRequest(BaseModel):
    message: str = Field(..., min_length=2, max_length=1000)
    session_id: Optional[int] = None

class ChatQueryResponse(BaseModel):
    session_id: int
    answer: str
    sources: List[SourceCitation] = []
    suggested_signs: List[str] = []
    is_grounded: bool = True
    provider: str

class ChatMessageOut(BaseModel):
    id: int
    sender: str
    message: str
    retrieved_sources: List[SourceCitation] = []
    created_at: datetime

    model_config = {"from_attributes": True}

class ChatSessionOut(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageOut] = []

    model_config = {"from_attributes": True}

