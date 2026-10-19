from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.chatbot import (
    ChatQueryRequest,
    ChatQueryResponse,
    ChatSessionOut,
)
from app.services import chatbot_service

router = APIRouter(prefix="/chatbot", tags=["RAG AI Tutor"])

@router.post("/ask", response_model=ChatQueryResponse)
def ask_tutor(
    request: ChatQueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submits question to the RAG AI Tutor.
    Retrieves verified knowledge, generates grounded response, and returns lesson/image citations.
    """
    return chatbot_service.ask_ai_tutor(db, request=request, current_user=current_user)

@router.get("/sessions", response_model=List[ChatSessionOut])
def get_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieves authenticated learner's chat history with the AI Tutor."""
    return chatbot_service.get_user_chat_sessions(db, user=current_user)
