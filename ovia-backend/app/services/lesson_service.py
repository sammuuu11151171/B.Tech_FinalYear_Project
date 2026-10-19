from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.lesson import Lesson
from app.models.progress import LessonProgress
from app.models.user import User
from app.schemas.lesson import LessonCreate, LessonUpdate, LessonWithProgressOut

def get_lessons(
    db: Session,
    category: Optional[str] = None,
    current_user: Optional[User] = None,
) -> List[LessonWithProgressOut]:
    query = db.query(Lesson).filter(Lesson.is_published == True)
    if category:
        query = query.filter(Lesson.category == category)
    lessons = query.order_by(Lesson.order_index, Lesson.id).all()

    progress_map = {}
    if current_user:
        user_progress = db.query(LessonProgress).filter(LessonProgress.user_id == current_user.id).all()
        for p in user_progress:
            progress_map[p.lesson_id] = p

    results = []
    for lesson in lessons:
        prog = progress_map.get(lesson.id)
        status_val = prog.status if prog else "not_started"
        comp_at = prog.completed_at if prog else None
        results.append(
            LessonWithProgressOut(
                id=lesson.id,
                title=lesson.title,
                sign_label=lesson.sign_label,
                category=lesson.category,
                description=lesson.description,
                instructions=lesson.instructions,
                reference_image_url=lesson.reference_image_url,
                video_url=lesson.video_url,
                difficulty=lesson.difficulty,
                order_index=lesson.order_index,
                is_published=lesson.is_published,
                created_at=lesson.created_at,
                updated_at=lesson.updated_at,
                status=status_val,
                completed_at=comp_at,
            )
        )
    return results

def get_lesson_by_id(
    db: Session,
    lesson_id: int,
    current_user: Optional[User] = None,
) -> LessonWithProgressOut:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found.")

    status_val = "not_started"
    comp_at = None
    if current_user:
        prog = db.query(LessonProgress).filter(
            LessonProgress.user_id == current_user.id,
            LessonProgress.lesson_id == lesson_id,
        ).first()
        if prog:
            status_val = prog.status
            comp_at = prog.completed_at
            # Update last accessed time
            prog.last_accessed_at = datetime.now(timezone.utc)
            db.commit()
        else:
            # Mark in progress upon first access
            new_prog = LessonProgress(
                user_id=current_user.id,
                lesson_id=lesson_id,
                status="in_progress",
                last_accessed_at=datetime.now(timezone.utc),
            )
            db.add(new_prog)
            db.commit()
            status_val = "in_progress"

    return LessonWithProgressOut(
        id=lesson.id,
        title=lesson.title,
        sign_label=lesson.sign_label,
        category=lesson.category,
        description=lesson.description,
        instructions=lesson.instructions,
        reference_image_url=lesson.reference_image_url,
        video_url=lesson.video_url,
        difficulty=lesson.difficulty,
        order_index=lesson.order_index,
        is_published=lesson.is_published,
        created_at=lesson.created_at,
        updated_at=lesson.updated_at,
        status=status_val,
        completed_at=comp_at,
    )

def mark_lesson_complete(db: Session, lesson_id: int, user: User) -> dict:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found.")

    prog = db.query(LessonProgress).filter(
        LessonProgress.user_id == user.id,
        LessonProgress.lesson_id == lesson_id,
    ).first()

    now = datetime.now(timezone.utc)
    if not prog:
        prog = LessonProgress(
            user_id=user.id,
            lesson_id=lesson_id,
            status="completed",
            completed_at=now,
            last_accessed_at=now,
        )
        db.add(prog)
    else:
        prog.status = "completed"
        prog.completed_at = now
        prog.last_accessed_at = now

    db.commit()
    return {"message": "Lesson marked as completed successfully.", "lesson_id": lesson_id, "status": "completed"}
