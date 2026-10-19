from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class SignRevisionRecommendation(BaseModel):
    sign_label: str
    category: str
    accuracy_percentage: float
    total_attempts: int
    failed_attempts: int
    recommendation_reason: str
    suggested_lesson_id: Optional[int] = None

class OverallProgressStats(BaseModel):
    total_lessons: int
    completed_lessons: int
    completion_percentage: float
    total_quizzes_attempted: int
    average_quiz_score: float
    total_practice_attempts: int
    practice_accuracy_percentage: float

class DailyProgressItem(BaseModel):
    date: str
    practice_count: int
    quiz_count: int

class RecentActivityItem(BaseModel):
    id: int
    activity_type: str  # 'lesson_completed', 'quiz_attempt', 'sign_practice'
    title: str
    description: str
    timestamp: datetime
    is_positive: bool

class StudentDashboardSummary(BaseModel):
    stats: OverallProgressStats
    revisions_needed: List[SignRevisionRecommendation] = []
    recent_activities: List[RecentActivityItem] = []
    continue_lesson: Optional[dict] = None
