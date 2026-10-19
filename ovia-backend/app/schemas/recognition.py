from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class LandmarkPoint(BaseModel):
    x: float
    y: float
    z: float = 0.0

class PredictRequest(BaseModel):
    target_sign: str = Field(..., description="Target sign label to evaluate (e.g. 'A', 'K', '1')")
    image_base64: Optional[str] = Field(None, description="Optional base64 JPEG/PNG webcam frame")
    landmarks: Optional[List[LandmarkPoint]] = Field(None, description="Optional pre-extracted 21 MediaPipe hand landmarks")
    lesson_id: Optional[int] = Field(None, description="Associated lesson ID if practicing a lesson")

class PredictResponse(BaseModel):
    predicted_sign: Optional[str]
    confidence: float
    is_correct: bool
    status: str  # 'success', 'no_hand_detected', 'low_confidence', 'model_not_configured', 'invalid_input'
    feedback: str
    target_sign: str
    top_candidates: List[dict] = []
    inference_time_ms: float = 0.0

class PracticeAttemptCreate(BaseModel):
    lesson_id: Optional[int] = None
    target_sign: str
    predicted_sign: str
    confidence: float
    is_correct: bool
    feedback_notes: Optional[str] = None

class PracticeAttemptOut(BaseModel):
    id: int
    user_id: int
    lesson_id: Optional[int]
    target_sign: str
    predicted_sign: str
    confidence: float
    is_correct: bool
    feedback_notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
