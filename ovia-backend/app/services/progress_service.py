from typing import List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.lesson import Lesson
from app.models.progress import LessonProgress, PracticeAttempt
from app.models.quiz import QuizAttempt
from app.models.user import User
from app.schemas.progress import (
    OverallProgressStats,
    SignRevisionRecommendation,
    RecentActivityItem,
    StudentDashboardSummary,
)

def get_student_dashboard_summary(db: Session, user: User) -> StudentDashboardSummary:
    # 1. Lesson metrics
    total_lessons = db.query(func.count(Lesson.id)).filter(Lesson.is_published == True).scalar() or 0
    completed_lessons = db.query(func.count(LessonProgress.id)).filter(
        LessonProgress.user_id == user.id,
        LessonProgress.status == "completed",
    ).scalar() or 0

    completion_pct = round((completed_lessons / total_lessons * 100), 1) if total_lessons > 0 else 0.0

    # 2. Quiz metrics
    quiz_attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user.id).all()
    total_quizzes = len(quiz_attempts)
    avg_score = 0.0
    if total_quizzes > 0:
        total_percentages = [
            (a.score / a.total_points * 100) for a in quiz_attempts if a.total_points > 0
        ]
        avg_score = round(sum(total_percentages) / len(total_percentages), 1) if total_percentages else 0.0

    # 3. Practice metrics
    practice_attempts = db.query(PracticeAttempt).filter(PracticeAttempt.user_id == user.id).all()
    total_practices = len(practice_attempts)
    correct_practices = sum(1 for p in practice_attempts if p.is_correct)
    practice_accuracy = round((correct_practices / total_practices * 100), 1) if total_practices > 0 else 0.0

    stats = OverallProgressStats(
        total_lessons=total_lessons,
        completed_lessons=completed_lessons,
        completion_percentage=completion_pct,
        total_quizzes_attempted=total_quizzes,
        average_quiz_score=avg_score,
        total_practice_attempts=total_practices,
        practice_accuracy_percentage=practice_accuracy,
    )

    # 4. Transparent Rule-Based Sign Revision Recommendations
    # Group practice attempts by target_sign
    sign_stats: Dict[str, Dict[str, Any]] = {}
    for p in practice_attempts:
        sign = p.target_sign.upper()
        if sign not in sign_stats:
            sign_stats[sign] = {"total": 0, "correct": 0, "lesson_id": p.lesson_id}
        sign_stats[sign]["total"] += 1
        if p.is_correct:
            sign_stats[sign]["correct"] += 1
        if p.lesson_id and not sign_stats[sign]["lesson_id"]:
            sign_stats[sign]["lesson_id"] = p.lesson_id

    revisions_needed: List[SignRevisionRecommendation] = []
    for sign, data in sign_stats.items():
        total = data["total"]
        correct = data["correct"]
        failed = total - correct
        accuracy = round((correct / total) * 100, 1)

        # Recommendation Rule:
        # If attempted at least 2 times and accuracy is below 70%, or at least 1 failed attempt with 0% accuracy
        if (total >= 2 and accuracy < 70.0) or (total >= 1 and correct == 0):
            # Fetch matching lesson for linking
            lesson = db.query(Lesson).filter(Lesson.sign_label == sign).first()
            lesson_id = lesson.id if lesson else data["lesson_id"]
            cat = lesson.category if lesson else "alphabet"

            reason = f"Struggled with accuracy ({accuracy}%) across {total} attempts ({failed} mistakes)."
            revisions_needed.append(
                SignRevisionRecommendation(
                    sign_label=sign,
                    category=cat,
                    accuracy_percentage=accuracy,
                    total_attempts=total,
                    failed_attempts=failed,
                    recommendation_reason=reason,
                    suggested_lesson_id=lesson_id,
                )
            )

    # Sort revisions by lowest accuracy first
    revisions_needed.sort(key=lambda x: x.accuracy_percentage)

    # 5. Recent Activity Feed
    recent_activities: List[RecentActivityItem] = []
    # Fetch recent lesson completions
    recent_lessons = (
        db.query(LessonProgress)
        .filter(LessonProgress.user_id == user.id)
        .order_by(LessonProgress.last_accessed_at.desc())
        .limit(3)
        .all()
    )
    for lp in recent_lessons:
        lesson_title = lp.lesson.title if lp.lesson else f"Lesson #{lp.lesson_id}"
        desc = f"Completed sign lesson for '{lp.lesson.sign_label}'" if lp.status == "completed" else "Lesson accessed"
        recent_activities.append(
            RecentActivityItem(
                id=lp.id * 1000 + 1,
                activity_type="lesson_completed",
                title=lesson_title,
                description=desc,
                timestamp=lp.last_accessed_at,
                is_positive=(lp.status == "completed"),
            )
        )

    # Fetch recent quizzes
    recent_quiz_att = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user.id)
        .order_by(QuizAttempt.completed_at.desc())
        .limit(3)
        .all()
    )
    for qa in recent_quiz_att:
        pct = round((qa.score / qa.total_points * 100), 1) if qa.total_points > 0 else 0
        recent_activities.append(
            RecentActivityItem(
                id=qa.id * 1000 + 2,
                activity_type="quiz_attempt",
                title=qa.quiz.title if qa.quiz else "ISL Quiz",
                description=f"Scored {pct}% ({'Passed' if qa.passed else 'Needs revision'})",
                timestamp=qa.completed_at,
                is_positive=qa.passed,
            )
        )

    # Fetch recent practices
    recent_practices = (
        db.query(PracticeAttempt)
        .filter(PracticeAttempt.user_id == user.id)
        .order_by(PracticeAttempt.created_at.desc())
        .limit(4)
        .all()
    )
    for pa in recent_practices:
        recent_activities.append(
            RecentActivityItem(
                id=pa.id * 1000 + 3,
                activity_type="sign_practice",
                title=f"Practice: Sign '{pa.target_sign}'",
                description=f"Result: {pa.predicted_sign} ({round(pa.confidence * 100, 1)}% confidence)",
                timestamp=pa.created_at,
                is_positive=pa.is_correct,
            )
        )

    # Sort combined activity feed by timestamp descending
    recent_activities.sort(key=lambda x: x.timestamp, reverse=True)
    recent_activities = recent_activities[:6]

    # Next lesson suggestion
    next_lesson = (
        db.query(Lesson)
        .filter(
            Lesson.is_published == True,
            ~Lesson.id.in_(
                db.query(LessonProgress.lesson_id).filter(
                    LessonProgress.user_id == user.id,
                    LessonProgress.status == "completed",
                )
            ),
        )
        .order_by(Lesson.order_index, Lesson.id)
        .first()
    )

    continue_dict = None
    if next_lesson:
        continue_dict = {
            "id": next_lesson.id,
            "title": next_lesson.title,
            "sign_label": next_lesson.sign_label,
            "category": next_lesson.category,
            "difficulty": next_lesson.difficulty,
        }

    return StudentDashboardSummary(
        stats=stats,
        revisions_needed=revisions_needed,
        recent_activities=recent_activities,
        continue_lesson=continue_dict,
    )
