import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.dependencies.auth import require_teacher
from app.models.user import User
from app.models.lesson import Lesson
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt
from app.models.progress import PracticeAttempt
from app.schemas.lesson import LessonCreate, LessonOut
from app.schemas.quiz import QuizCreate, QuestionCreate, QuizOut

router = APIRouter(prefix="/teacher", tags=["Teacher Operations"])

@router.get("/overview")
def get_teacher_overview(
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    """Provides teacher overview metrics."""
    student_count = db.query(func.count(User.id)).filter(User.role == "student").scalar() or 0
    lesson_count = db.query(func.count(Lesson.id)).scalar() or 0
    quiz_count = db.query(func.count(Quiz.id)).scalar() or 0
    practice_count = db.query(func.count(PracticeAttempt.id)).scalar() or 0

    return {
        "teacher_name": teacher.full_name,
        "student_count": student_count,
        "lesson_count": lesson_count,
        "quiz_count": quiz_count,
        "total_practice_attempts": practice_count,
    }

@router.post("/lessons", response_model=LessonOut, status_code=status.HTTP_201_CREATED)
def create_lesson(
    lesson_in: LessonCreate,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    """Allows teachers to add verified ISL lesson content."""
    lesson = Lesson(
        title=lesson_in.title,
        sign_label=lesson_in.sign_label.upper().strip(),
        category=lesson_in.category,
        description=lesson_in.description,
        instructions=lesson_in.instructions,
        reference_image_url=lesson_in.reference_image_url,
        video_url=lesson_in.video_url,
        difficulty=lesson_in.difficulty,
        order_index=lesson_in.order_index,
        is_published=lesson_in.is_published,
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson

@router.post("/quizzes", response_model=QuizOut, status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz_in: QuizCreate,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    """Allows teachers to create a new quiz set."""
    quiz = Quiz(
        title=quiz_in.title,
        category=quiz_in.category,
        description=quiz_in.description,
        time_limit_seconds=quiz_in.time_limit_seconds,
        passing_score=quiz_in.passing_score,
        created_by=teacher.id,
        is_published=quiz_in.is_published,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return QuizOut(
        id=quiz.id,
        title=quiz.title,
        category=quiz.category,
        description=quiz.description,
        time_limit_seconds=quiz.time_limit_seconds,
        passing_score=quiz.passing_score,
        question_count=0,
        created_at=quiz.created_at,
    )

@router.post("/quizzes/{quiz_id}/questions", status_code=status.HTTP_201_CREATED)
def add_quiz_question(
    quiz_id: int,
    q_in: QuestionCreate,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    """Adds a question to an existing quiz."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    question = QuizQuestion(
        quiz_id=quiz_id,
        question_text=q_in.question_text,
        question_type=q_in.question_type,
        options_json=json.dumps(q_in.options),
        correct_answer=q_in.correct_answer,
        target_sign=q_in.target_sign,
        points=q_in.points,
        order_index=q_in.order_index,
    )
    db.add(question)
    db.commit()
    return {"message": "Question added successfully", "question_id": question.id}

@router.get("/students")
def list_student_performance(
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    """Lists enrolled students and their learning metrics."""
    students = db.query(User).filter(User.role == "student").all()
    results = []
    for s in students:
        completed = len([p for p in s.lesson_progress if p.status == "completed"])
        quizzes = len(s.quiz_attempts)
        avg_score = (
            round(sum((a.score / a.total_points * 100) for a in s.quiz_attempts if a.total_points > 0) / quizzes, 1)
            if quizzes > 0
            else 0.0
        )
        results.append({
            "id": s.id,
            "full_name": s.full_name,
            "email": s.email,
            "completed_lessons": completed,
            "quizzes_attempted": quizzes,
            "avg_quiz_score": avg_score,
            "practice_count": len(s.practice_attempts),
        })
    return results
