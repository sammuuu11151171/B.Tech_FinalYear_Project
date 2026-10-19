from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field

class QuizQuestionOut(BaseModel):
    id: int
    question_text: str
    question_type: str  # 'multiple_choice' or 'sign_practice'
    options: List[str] = []
    target_sign: Optional[str] = None
    points: int
    order_index: int

class QuizOut(BaseModel):
    id: int
    title: str
    category: str
    description: str
    time_limit_seconds: int
    passing_score: int
    question_count: int
    created_at: datetime

    model_config = {"from_attributes": True}

class QuizDetailOut(QuizOut):
    questions: List[QuizQuestionOut] = []

class AnswerSubmissionItem(BaseModel):
    question_id: int
    selected_answer: str
    confidence_score: Optional[float] = None

class QuizSubmitRequest(BaseModel):
    responses: List[AnswerSubmissionItem]

class QuestionResultOut(BaseModel):
    question_id: int
    question_text: str
    selected_answer: str
    correct_answer: str
    is_correct: bool
    points_earned: int
    max_points: int

class QuizAttemptOut(BaseModel):
    id: int
    quiz_id: int
    quiz_title: str
    score: float
    total_points: float
    percentage: float
    passed: bool
    started_at: datetime
    completed_at: datetime
    results: List[QuestionResultOut] = []

    model_config = {"from_attributes": True}

class QuizCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    category: str = Field(..., pattern="^(alphabet|number|mixed)$")
    description: str
    time_limit_seconds: int = 300
    passing_score: int = 70
    is_published: bool = True

class QuestionCreate(BaseModel):
    question_text: str
    question_type: str = "multiple_choice"
    options: List[str] = []
    correct_answer: str
    target_sign: Optional[str] = None
    points: int = 10
    order_index: int = 0
