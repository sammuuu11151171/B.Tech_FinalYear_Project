import os
import sys
import json
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

# Ensure rag module is accessible
rag_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "rag"))
if rag_dir not in sys.path:
    sys.path.insert(0, rag_dir)

from rag_pipeline import rag_pipeline
from app.models.chatbot import ChatSession, ChatMessage
from app.models.user import User
from app.schemas.chatbot import (
    ChatQueryRequest,
    ChatQueryResponse,
    ChatSessionOut,
    ChatMessageOut,
    SourceCitation,
)

def ask_ai_tutor(
    db: Session,
    request: ChatQueryRequest,
    current_user: User,
) -> ChatQueryResponse:
    # 1. Resolve or create chat session
    session = None
    if request.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == request.session_id,
            ChatSession.user_id == current_user.id,
        ).first()

    if not session:
        # Create a new session with initial query as title snippet
        title_snippet = (request.message[:40] + "...") if len(request.message) > 40 else request.message
        session = ChatSession(
            user_id=current_user.id,
            title=title_snippet,
        )
        db.add(session)
        db.flush()

    # 2. Record user's query
    user_msg = ChatMessage(
        session_id=session.id,
        sender="user",
        message=request.message,
    )
    db.add(user_msg)

    # 3. Retrieve relevant knowledge documents
    retrieved_docs = rag_pipeline.retrieve(request.message, top_k=2)

    # 4. Generate grounded answer
    rag_result = rag_pipeline.generate_answer(request.message, retrieved_docs)

    # 5. Record tutor's answer
    tutor_msg = ChatMessage(
        session_id=session.id,
        sender="tutor",
        message=rag_result["answer"],
        retrieved_sources_json=json.dumps(rag_result["sources"]),
    )
    db.add(tutor_msg)
    db.commit()

    citations = [
        SourceCitation(
            title=s["title"],
            category=s["category"],
            lesson_id=s.get("lesson_id"),
            sign_label=s.get("sign_label"),
            reference_image_url=s.get("reference_image_url"),
            similarity_score=s["similarity_score"],
            snippet=s["snippet"],
        )
        for s in rag_result["sources"]
    ]

    return ChatQueryResponse(
        session_id=session.id,
        answer=rag_result["answer"],
        sources=citations,
        suggested_signs=rag_result.get("suggested_signs", []),
        is_grounded=rag_result["is_grounded"],
        provider=rag_result["provider"],
    )

def get_user_chat_sessions(db: Session, user: User) -> List[ChatSessionOut]:
    sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == user.id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )
    results = []
    for s in sessions:
        msg_outs = []
        for m in s.messages:
            sources = []
            if m.retrieved_sources_json:
                try:
                    raw_sources = json.loads(m.retrieved_sources_json)
                    sources = [SourceCitation(**src) for src in raw_sources]
                except Exception:
                    sources = []
            msg_outs.append(
                ChatMessageOut(
                    id=m.id,
                    sender=m.sender,
                    message=m.message,
                    retrieved_sources=sources,
                    created_at=m.created_at,
                )
            )
        results.append(
            ChatSessionOut(
                id=s.id,
                title=s.title,
                created_at=s.created_at,
                updated_at=s.updated_at,
                messages=msg_outs,
            )
        )
    return results
