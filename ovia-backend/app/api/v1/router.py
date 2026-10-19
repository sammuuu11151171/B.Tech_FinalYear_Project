from fastapi import APIRouter
from app.api.v1 import (
    auth,
    lessons,
    recognition,
    quizzes,
    progress,
    chatbot,
    teacher,
    admin,
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(lessons.router)
api_router.include_router(recognition.router)
api_router.include_router(quizzes.router)
api_router.include_router(progress.router)
api_router.include_router(chatbot.router)
api_router.include_router(teacher.router)
api_router.include_router(admin.router)
