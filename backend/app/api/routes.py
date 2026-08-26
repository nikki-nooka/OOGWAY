from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, desc
from sqlalchemy.orm import selectinload

from app.db.database import get_db
from app.db.models import SessionModel, MessageModel, ArtifactModel
from app.api.schemas import (
    ChatRequest, ChatResponse,
    SessionCreate, SessionSummary, SessionDetail, MessageDetail, ArtifactSchema,
    ModelSwitchRequest, HealthStatus
)
from app.engine.agent import agent_orchestrator
from app.engine.rag import rag_engine
from app.engine.llm_provider import LLMFactory
from app.core.config import settings

router = APIRouter()

# --- Health & Diagnostic ---
@router.get("/health", response_model=HealthStatus)
async def get_health():
    episodes = rag_engine.get_all_episodes()
    return HealthStatus(
        status="healthy",
        database="connected",
        transcripts_count=len(rag_engine.chunks),
        episodes_count=len(episodes),
        active_model=LLMFactory.get_active_provider_name()
    )

# --- Model Switcher & Status ---
@router.get("/models")
async def get_models_status():
    return await LLMFactory.get_providers_status()

@router.post("/models/set")
async def set_active_model(req: ModelSwitchRequest):
    new_active = LLMFactory.set_active_provider(req.provider)
    return {"message": f"Active model set to {new_active}", "active": new_active}

# --- Transcripts Knowledge Base ---
@router.get("/transcripts")
async def list_transcripts(query: Optional[str] = None):
    if query:
        search_results = rag_engine.search(query, top_k=6)
        return {
            "query": query,
            "results": [
                {
                    "chunk": res["chunk"].model_dump(),
                    "score": res["score"],
                    "citation": res["citation"].model_dump()
                }
                for res in search_results
            ]
        }
    return {
        "total_chunks": len(rag_engine.chunks),
        "episodes": rag_engine.get_all_episodes()
    }

# --- Sessions Management ---
@router.get("/sessions", response_model=List[SessionSummary])
async def list_sessions(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(SessionModel)
        .options(selectinload(SessionModel.messages), selectinload(SessionModel.artifacts))
        .order_by(desc(SessionModel.updated_at))
    )
    res = await db.execute(stmt)
    sessions = res.scalars().all()

    summaries = []
    for s in sessions:
        summaries.append(SessionSummary(
            id=s.id,
            title=s.title,
            model_provider=s.model_provider,
            message_count=len(s.messages),
            artifact_count=len(s.artifacts),
            created_at=s.created_at,
            updated_at=s.updated_at
        ))
    return summaries

@router.post("/sessions", response_model=SessionSummary)
async def create_session(req: SessionCreate, db: AsyncSession = Depends(get_db)):
    # Auto-cleanup previous empty sessions with 0 messages to prevent clutter
    try:
        empty_stmt = select(SessionModel).options(selectinload(SessionModel.messages))
        empty_res = await db.execute(empty_stmt)
        for old_s in empty_res.scalars().all():
            if len(old_s.messages) == 0:
                await db.delete(old_s)
        await db.commit()
    except Exception:
        pass

    new_session = SessionModel(
        title=req.title or "New Discussion",
        model_provider=req.model_provider or LLMFactory.get_active_provider_name()
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)

    return SessionSummary(
        id=new_session.id,
        title=new_session.title,
        model_provider=new_session.model_provider,
        message_count=0,
        artifact_count=0,
        created_at=new_session.created_at,
        updated_at=new_session.updated_at
    )

@router.delete("/sessions/clear_all")
async def clear_all_sessions(db: AsyncSession = Depends(get_db)):
    await db.execute(delete(ArtifactModel))
    await db.execute(delete(MessageModel))
    await db.execute(delete(SessionModel))
    await db.commit()
    return {"message": "All sessions cleared successfully"}

@router.get("/sessions/{session_id}", response_model=SessionDetail)
async def get_session_detail(session_id: str, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(SessionModel)
        .where(SessionModel.id == session_id)
        .options(selectinload(SessionModel.messages), selectinload(SessionModel.artifacts))
    )
    res = await db.execute(stmt)
    session = res.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = [
        MessageDetail(
            id=m.id,
            role=m.role,
            content=m.content,
            citations=m.citations or [],
            artifacts=m.artifacts or [],
            model_used=m.model_used,
            latency_ms=m.latency_ms,
            created_at=m.created_at
        )
        for m in session.messages
    ]

    artifacts = [
        ArtifactSchema(
            id=a.id,
            title=a.title,
            artifact_type=a.artifact_type,
            content=a.content,
            meta=a.meta or {}
        )
        for a in session.artifacts
    ]

    return SessionDetail(
        id=session.id,
        title=session.title,
        model_provider=session.model_provider,
        messages=messages,
        artifacts=artifacts,
        created_at=session.created_at,
        updated_at=session.updated_at
    )

@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str, db: AsyncSession = Depends(get_db)):
    stmt = delete(SessionModel).where(SessionModel.id == session_id)
    result = await db.execute(stmt)
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session deleted successfully"}

# --- Chat Endpoint ---
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    # 1. Resolve or create session
    session_id = req.session_id
    clean_title = req.message.strip().split("\n")[0][:45]

    if not session_id:
        new_session = SessionModel(
            title=clean_title,
            model_provider=req.model or LLMFactory.get_active_provider_name()
        )
        db.add(new_session)
        await db.commit()
        await db.refresh(new_session)
        session_id = new_session.id
    else:
        s_stmt = select(SessionModel).where(SessionModel.id == session_id)
        s_res = await db.execute(s_stmt)
        current_session = s_res.scalar_one_or_none()
        if not current_session:
            new_session = SessionModel(id=session_id, title=clean_title)
            db.add(new_session)
            await db.commit()
        elif current_session.title in ["New Discussion", "New Conversation"]:
            current_session.title = clean_title
            await db.commit()

    # 2. Run agent orchestrator
    result = await agent_orchestrator.execute_chat(
        db=db,
        session_id=session_id,
        user_message=req.message,
        model_override=req.model
    )

    return ChatResponse(
        message_id=result["message_id"],
        session_id=result["session_id"],
        role=result["role"],
        content=result["content"],
        citations=result["citations"],
        artifacts=result["artifacts"],
        model_used=result["model_used"],
        latency_ms=result["latency_ms"]
    )
