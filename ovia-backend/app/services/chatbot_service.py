import os
import sys
import json
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

# --------------------------------------------------
# Ensure the OVIA RAG module is accessible
# --------------------------------------------------

# Project root:
# B.Tech_FinalYear_Project-main/
project_root = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..")
)

# Actual RAG directory:
# B.Tech_FinalYear_Project-main/ovia-ML/rag/
rag_dir = os.path.join(project_root, "ovia-ML", "rag")

if not os.path.isfile(os.path.join(rag_dir, "rag_pipeline.py")):
    raise FileNotFoundError(
        f"RAG pipeline not found. Expected file: "
        f"{os.path.join(rag_dir, 'rag_pipeline.py')}"
    )

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
        session = (
            db.query(ChatSession)
            .filter(
                ChatSession.id == request.session_id,
                ChatSession.user_id == current_user.id,
            )
            .first()
        )

    if not session:
        title_snippet = (
            request.message[:40] + "..."
            if len(request.message) > 40
            else request.message
        )

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
    retrieved_docs = rag_pipeline.retrieve(
        request.message,
        top_k=2,
    )

    # 4. Generate a grounded answer
    rag_result = rag_pipeline.generate_answer(
        request.message,
        retrieved_docs,
    )

    # 5. Record tutor's answer
    tutor_msg = ChatMessage(
        session_id=session.id,
        sender="tutor",
        message=rag_result["answer"],
        retrieved_sources_json=json.dumps(
            rag_result["sources"]
        ),
    )

    db.add(tutor_msg)
    db.commit()

    # 6. Format citations for the frontend
    citations = [
        SourceCitation(
            title=source["title"],
            category=source["category"],
            lesson_id=source.get("lesson_id"),
            sign_label=source.get("sign_label"),
            reference_image_url=source.get(
                "reference_image_url"
            ),
            similarity_score=source["similarity_score"],
            snippet=source["snippet"],
        )
        for source in rag_result["sources"]
    ]

    # 7. Return response
    return ChatQueryResponse(
        session_id=session.id,
        answer=rag_result["answer"],
        sources=citations,
        suggested_signs=rag_result.get(
            "suggested_signs", []
        ),
        is_grounded=rag_result["is_grounded"],
        provider=rag_result["provider"],
    )


def get_user_chat_sessions(
    db: Session,
    user: User,
) -> List[ChatSessionOut]:

    sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == user.id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )

    results = []

    for session in sessions:
        msg_outs = []

        for message in session.messages:
            sources = []

            if message.retrieved_sources_json:
                try:
                    raw_sources = json.loads(
                        message.retrieved_sources_json
                    )

                    sources = [
                        SourceCitation(**source)
                        for source in raw_sources
                    ]

                except (json.JSONDecodeError, TypeError, ValueError):
                    sources = []

            msg_outs.append(
                ChatMessageOut(
                    id=message.id,
                    sender=message.sender,
                    message=message.message,
                    retrieved_sources=sources,
                    created_at=message.created_at,
                )
            )

        results.append(
            ChatSessionOut(
                id=session.id,
                title=session.title,
                created_at=session.created_at,
                updated_at=session.updated_at,
                messages=msg_outs,
            )
        )

    return results
