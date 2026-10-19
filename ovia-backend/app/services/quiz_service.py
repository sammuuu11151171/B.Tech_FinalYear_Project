import json
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.quiz import Quiz, QuizQuestion, QuizAttempt, QuizResponse
from app.models.user import User
from app.schemas.quiz import (
    QuizOut,
    QuizDetailOut,
    QuizQuestionOut,
    QuizSubmitRequest,
    QuizAttemptOut,
    QuestionResultOut,
    QuizCreate,
    QuestionCreate,
)

def list_quizzes(db: Session, category: Optional[str] = None) -> List[QuizOut]:
    query = db.query(Quiz).filter(Quiz.is_published == True)
    if category:
        query = query.filter(Quiz.category == category)
    quizzes = query.all()
    results = []
    for q in quizzes:
        results.append(
            QuizOut(
                id=q.id,
                title=q.title,
                category=q.category,
                description=q.description,
                time_limit_seconds=q.time_limit_seconds,
                passing_score=q.passing_score,
                question_count=len(q.questions),
                created_at=q.created_at,
            )
        )
    return results

def get_quiz_detail(db: Session, quiz_id: int) -> QuizDetailOut:
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.is_published == True).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")

    question_outs = []
    for q in quiz.questions:
        options = []
        if q.options_json:
            try:
                options = json.loads(q.options_json)
            except Exception:
                options = []
        
        # Notice: correct_answer is strictly EXCLUDED to maintain academic integrity
        question_outs.append(
            QuizQuestionOut(
                id=q.id,
                question_text=q.question_text,
                question_type=q.question_type,
                options=options,
                target_sign=q.target_sign,
                points=q.points,
                order_index=q.order_index,
            )
        )

    return QuizDetailOut(
        id=quiz.id,
        title=quiz.title,
        category=quiz.category,
        description=quiz.description,
        time_limit_seconds=quiz.time_limit_seconds,
        passing_score=quiz.passing_score,
        question_count=len(quiz.questions),
        created_at=quiz.created_at,
        questions=question_outs,
    )

def submit_quiz_attempt(
    db: Session,
    quiz_id: int,
    submission: QuizSubmitRequest,
    current_user: User,
) -> QuizAttemptOut:
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")

    total_max_points = sum(q.points for q in quiz.questions)
    if total_max_points == 0:
        total_max_points = 1.0

    questions_by_id = {q.id: q for q in quiz.questions}
    user_responses = {r.question_id: r for r in submission.responses}

    earned_points = 0.0
    question_results = []
    db_responses = []

    now = datetime.now(timezone.utc)

    for q in quiz.questions:
        user_resp = user_responses.get(q.id)
        selected_val = user_resp.selected_answer.strip().upper() if user_resp else ""
        correct_val = q.correct_answer.strip().upper()

        is_correct = (selected_val == correct_val)
        pts = q.points if is_correct else 0
        earned_points += pts

        question_results.append(
            QuestionResultOut(
                question_id=q.id,
                question_text=q.question_text,
                selected_answer=selected_val if selected_val else "No answer",
                correct_answer=correct_val,
                is_correct=is_correct,
                points_earned=pts,
                max_points=q.points,
            )
        )

        db_responses.append(
            QuizResponse(
                question_id=q.id,
                selected_answer=selected_val,
                is_correct=is_correct,
                confidence_score=user_resp.confidence_score if user_resp else None,
            )
        )

    percentage = round((earned_points / total_max_points) * 100, 1)
    passed = percentage >= quiz.passing_score

    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz.id,
        score=earned_points,
        total_points=total_max_points,
        passed=passed,
        started_at=now,
        completed_at=now,
    )
    db.add(attempt)
    db.flush()

    for resp in db_responses:
        resp.attempt_id = attempt.id
        db.add(resp)

    db.commit()

    return QuizAttemptOut(
        id=attempt.id,
        quiz_id=quiz.id,
        quiz_title=quiz.title,
        score=earned_points,
        total_points=total_max_points,
        percentage=percentage,
        passed=passed,
        started_at=attempt.started_at,
        completed_at=attempt.completed_at,
        results=question_results,
    )

def get_user_quiz_history(db: Session, user: User) -> List[QuizAttemptOut]:
    attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user.id).order_by(QuizAttempt.completed_at.desc()).all()
    results = []
    for a in attempts:
        pct = round((a.score / a.total_points) * 100, 1) if a.total_points > 0 else 0
        results.append(
            QuizAttemptOut(
                id=a.id,
                quiz_id=a.quiz_id,
                quiz_title=a.quiz.title if a.quiz else "Quiz",
                score=a.score,
                total_points=a.total_points,
                percentage=pct,
                passed=a.passed,
                started_at=a.started_at,
                completed_at=a.completed_at,
                results=[],
            )
        )
    return results
