import time
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, desc, and_, or_
from sqlalchemy.orm import selectinload

from app.db.database import get_db
from app.db.models import UserModel, PersonalContextModel, SessionModel, MessageModel, ArtifactModel
from app.api.schemas import (
    UserSignup, UserLogin, UserProfile, AuthResponse,
    PersonalContextUpdate, PersonalContextResponse,
    ChatRequest, ChatResponse,
    SessionCreate, SessionSummary, SessionDetail, MessageDetail, ArtifactSchema,
    WritingRequest, WritingResponse, ArtifactCreateRequest, TopicSummary,
    ModelSwitchRequest, HealthStatus,
    ChallengeRequest, ApplyContextRequest, DecisionMemoRequest, ExperimentBriefRequest,
    FrameworkRequest, CompareGuestsRequest, PMFDiagnosticRequest, VerifyGroundingRequest
)
from app.core.security import hash_password, verify_password, create_access_token
from app.api.auth import get_current_user, get_optional_user, verify_session_ownership, verify_artifact_ownership
from app.engine.agent import agent_orchestrator
from app.engine.rag import rag_engine
from app.engine.llm_provider import LLMFactory
from app.engine.ship30_skill import ship30_skill
from app.engine.intelligence_engine import intelligence_engine
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

# --- Authentication Endpoints ---
@router.post("/auth/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(req: UserSignup, db: AsyncSession = Depends(get_db)):
    clean_email = req.email.strip().lower()
    
    # Check if email is already taken
    stmt = select(UserModel).where(UserModel.email == clean_email)
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in."
        )
    
    new_user = UserModel(
        name=req.name.strip(),
        email=clean_email,
        password_hash=hash_password(req.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Create default personal context
    context = PersonalContextModel(
        user_id=new_user.id,
        company_type="B2B SaaS",
        users_scale="10,000 MAU",
        activation_rate="20%",
        problem="Weak onboarding drop-off before reaching primary Aha! moment",
        constraints="Small team, 6 months runway"
    )
    db.add(context)
    await db.commit()

    token = create_access_token({"sub": new_user.id, "email": new_user.email, "name": new_user.name})
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfile(
            id=new_user.id,
            name=new_user.name,
            email=new_user.email,
            created_at=new_user.created_at
        )
    )

@router.post("/auth/login", response_model=AuthResponse)
async def login(req: UserLogin, db: AsyncSession = Depends(get_db)):
    clean_email = req.email.strip().lower()
    stmt = select(UserModel).where(UserModel.email == clean_email, UserModel.is_active == True)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = create_access_token({"sub": user.id, "email": user.email, "name": user.name})
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfile(
            id=user.id,
            name=user.name,
            email=user.email,
            created_at=user.created_at
        )
    )

@router.get("/auth/me", response_model=UserProfile)
async def get_current_user_profile(user: UserModel = Depends(get_current_user)):
    return UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        created_at=user.created_at
    )

@router.post("/auth/logout")
async def logout():
    return {"message": "Successfully signed out. Session token cleared."}

# --- Personal Context & Company Profile Endpoints ---
@router.get("/user/context", response_model=PersonalContextResponse)
async def get_user_context(
    user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(PersonalContextModel).where(PersonalContextModel.user_id == user.id)
    res = await db.execute(stmt)
    ctx = res.scalar_one_or_none()
    if not ctx:
        ctx = PersonalContextModel(user_id=user.id)
        db.add(ctx)
        await db.commit()
        await db.refresh(ctx)
    return PersonalContextResponse(
        id=ctx.id,
        user_id=ctx.user_id,
        company_type=ctx.company_type,
        users_scale=ctx.users_scale,
        activation_rate=ctx.activation_rate,
        problem=ctx.problem,
        constraints=ctx.constraints,
        updated_at=ctx.updated_at
    )

@router.post("/user/context", response_model=PersonalContextResponse)
async def update_user_context(
    req: PersonalContextUpdate,
    user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(PersonalContextModel).where(PersonalContextModel.user_id == user.id)
    res = await db.execute(stmt)
    ctx = res.scalar_one_or_none()
    if not ctx:
        ctx = PersonalContextModel(user_id=user.id)
        db.add(ctx)
    
    ctx.company_type = req.company_type
    ctx.users_scale = req.users_scale
    ctx.activation_rate = req.activation_rate
    ctx.problem = req.problem
    ctx.constraints = req.constraints
    
    await db.commit()
    await db.refresh(ctx)
    return PersonalContextResponse(
        id=ctx.id,
        user_id=ctx.user_id,
        company_type=ctx.company_type,
        users_scale=ctx.users_scale,
        activation_rate=ctx.activation_rate,
        problem=ctx.problem,
        constraints=ctx.constraints,
        updated_at=ctx.updated_at
    )

# --- Model Switcher & Status ---
@router.get("/models")
async def get_models_status():
    return await LLMFactory.get_providers_status()

@router.get("/models/status")
async def get_models_status_alias():
    return await LLMFactory.get_providers_status()

@router.post("/models/set")
async def set_active_model(req: ModelSwitchRequest):
    new_active = LLMFactory.set_active_provider(req.provider)
    return {"message": f"Active model set to {new_active}", "active": new_active}

# --- Curated Topics & Frameworks ---
CURATED_TOPICS = [
    {
        "id": "pmf",
        "title": "Product-Market Fit & Retention",
        "category": "Core Strategy",
        "description": "Discover how top founders and PMs measure PMF, track cohort retention floors, and run the Sean Ellis 40% benchmark.",
        "chunk_count": 842,
        "top_guests": ["Gustaf Alströmer", "Rahul Vohra", "Casey Winters"],
        "frameworks": ["Sean Ellis 40% Benchmark", "Retention Floor Test", "Cohort Decay Curve", "Product-Market-Model Fit"],
        "sample_questions": [
            "What does Gustaf Alströmer say about product-market fit and retention curves?",
            "How did Rahul Vohra use the Sean Ellis benchmark at Superhuman?",
            "What are the leading indicators of PMF according to Casey Winters?"
        ]
    },
    {
        "id": "growth-loops",
        "title": "B2B Product-Led Growth & Viral Loops",
        "category": "Growth & Distribution",
        "description": "Tactical architectures for self-serve onboarding, B2B viral referral loops, bottom-up enterprise expansion, and pricing tiers.",
        "chunk_count": 620,
        "top_guests": ["Elena Verna", "Patrick Campbell", "Hila Qu"],
        "frameworks": ["Elena Verna's B2B Viral Loop", "PLG Monetization Ladder", "Self-Serve Activation Velocity"],
        "sample_questions": [
            "How does Elena Verna design B2B viral and product-led loops?",
            "What are the common pricing mistakes in early SaaS according to Patrick Campbell?",
            "How do top companies transition from self-serve PLG to enterprise sales?"
        ]
    },
    {
        "id": "product-craft",
        "title": "Product Craft & 11-Star Experience",
        "category": "Design & Craft",
        "description": "How Brian Chesky and Apple product leaders build magical customer journeys, unscalable delight, and emotional connection.",
        "chunk_count": 510,
        "top_guests": ["Brian Chesky", "Gibson Biddle", "Julie Zhuo"],
        "frameworks": ["Brian Chesky 11-Star Experience", "Gibson Biddle DHM Model", "Delight vs Table Stakes Matrix"],
        "sample_questions": [
            "What is Brian Chesky's 11-star product experience framework?",
            "How does Gibson Biddle's DHM (Delight, Hard-to-copy, Margin-enhancing) model work?",
            "How do elite PMs balance speed with exceptional design quality?"
        ]
    },
    {
        "id": "agency-leadership",
        "title": "High Agency & The LNO Framework",
        "category": "Execution & Career",
        "description": "Master high-agency product leadership, energy management, prioritization, and team influence from Shreyas Doshi.",
        "chunk_count": 730,
        "top_guests": ["Shreyas Doshi", "Nikhyl Singhal", "Ken Norton"],
        "frameworks": ["Shreyas Doshi LNO Framework", "High Agency Operating Principles", "Pre-Mortem Risk Analysis"],
        "sample_questions": [
            "Explain Shreyas Doshi's LNO framework in detail.",
            "How does Shreyas Doshi define high-agency product management?",
            "What are the most common failure modes for senior PMs transitioning to leadership?"
        ]
    },
    {
        "id": "positioning",
        "title": "Positioning & Competitive Sales",
        "category": "Marketing & Sales",
        "description": "April Dunford's battle-tested 10-step framework to define market category, outmaneuver incumbents, and craft clear messaging.",
        "chunk_count": 390,
        "top_guests": ["April Dunford", "Bob Moesta", "Sachin Rekhi"],
        "frameworks": ["April Dunford 10-Step Positioning Playbook", "Jobs to Be Done (JTBD) Switch Matrix", "Differentiation Canvas"],
        "sample_questions": [
            "How does April Dunford define product positioning vs messaging?",
            "What are the 5 components of effective positioning according to April Dunford?",
            "How do you determine whether to create a new category or compete in an existing one?"
        ]
    },
    {
        "id": "consumer-growth",
        "title": "Viral Consumer Apps & Psychology",
        "category": "Consumer Growth",
        "description": "How Nikita Bier and consumer giants design viral mechanics, notification triggers, and word-of-mouth loops.",
        "chunk_count": 480,
        "top_guests": ["Nikita Bier", "Todd Jackson", "Bangaly Kaba"],
        "frameworks": ["Nikita Bier Viral App Formula", "Adjacent User Theory", "Psych Framework for User Motivation"],
        "sample_questions": [
            "What is Nikita Bier's playbook for building viral consumer apps?",
            "How does Bangaly Kaba explain the Adjacent User Theory for expansion?",
            "What metrics should consumer social apps watch in the first 7 days?"
        ]
    }
]

@router.get("/topics", response_model=List[TopicSummary])
async def list_topics():
    return [TopicSummary(**t) for t in CURATED_TOPICS]

@router.get("/topics/{topic_id}")
async def get_topic_detail(topic_id: str):
    topic = next((t for t in CURATED_TOPICS if t["id"] == topic_id), None)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    sample_chunks = rag_engine.search(topic["title"] + " " + " ".join(topic["top_guests"]), top_k=5)
    return {
        **topic,
        "evidence_samples": [
            {
                "id": c["chunk"].id,
                "guest": c["chunk"].guest,
                "episode_title": c["chunk"].episode_title,
                "timestamp": c["chunk"].timestamp,
                "source_url": c["chunk"].source_url,
                "quote": c["chunk"].text
            }
            for c in sample_chunks
        ]
    }

# --- Transcripts & Sources Knowledge Base (Public Domain Knowledge) ---
@router.get("/sources")
@router.get("/transcripts")
async def list_sources(query: Optional[str] = None):
    if query:
        search_results = rag_engine.search(query, top_k=8)
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
    episodes = rag_engine.get_all_episodes()
    return {
        "total_chunks": len(rag_engine.chunks),
        "total_episodes": len(episodes),
        "episodes": episodes
    }

@router.get("/sources/{episode_id}")
async def get_source_detail(episode_id: str):
    episodes = rag_engine.get_all_episodes()
    ep = next((e for e in episodes if e["episode_id"] == episode_id), None)
    if not ep:
        ep = next((e for e in episodes if episode_id.lower() in e["title"].lower() or episode_id.lower() in e["guest"].lower()), None)
    if not ep:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    episode_chunks = [
        c.model_dump() for c in rag_engine.chunks 
        if c.episode_id == ep["episode_id"] or ep["title"].lower() in c.episode_title.lower()
    ]
    
    return {
        **ep,
        "all_chunks": episode_chunks
    }

# --- Sessions Management (Isolated by User) ---
@router.get("/sessions", response_model=List[SessionSummary])
async def list_sessions(
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    if user:
        stmt = (
            select(SessionModel)
            .where(SessionModel.user_id == user.id)
            .options(selectinload(SessionModel.messages), selectinload(SessionModel.artifacts))
            .order_by(desc(SessionModel.updated_at))
        )
    else:
        stmt = (
            select(SessionModel)
            .where(SessionModel.user_id.is_(None))
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
async def create_session(
    req: SessionCreate,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    new_session = SessionModel(
        user_id=user.id if user else None,
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
async def clear_all_sessions(
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    if user:
        user_sessions_stmt = select(SessionModel.id).where(SessionModel.user_id == user.id)
        user_sessions_res = await db.execute(user_sessions_stmt)
        s_ids = [row[0] for row in user_sessions_res.all()]
        if s_ids:
            await db.execute(delete(ArtifactModel).where(ArtifactModel.session_id.in_(s_ids)))
            await db.execute(delete(MessageModel).where(MessageModel.session_id.in_(s_ids)))
            await db.execute(delete(SessionModel).where(SessionModel.id.in_(s_ids)))
    else:
        guest_sessions_stmt = select(SessionModel.id).where(SessionModel.user_id.is_(None))
        guest_sessions_res = await db.execute(guest_sessions_stmt)
        s_ids = [row[0] for row in guest_sessions_res.all()]
        if s_ids:
            await db.execute(delete(ArtifactModel).where(ArtifactModel.session_id.in_(s_ids)))
            await db.execute(delete(MessageModel).where(MessageModel.session_id.in_(s_ids)))
            await db.execute(delete(SessionModel).where(SessionModel.id.in_(s_ids)))
            
    await db.commit()
    return {"message": "Conversations cleared successfully for your workspace."}

@router.get("/sessions/{session_id}", response_model=SessionDetail)
async def get_session_detail(
    session_id: str,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    session = await verify_session_ownership(session_id, user, db)
    
    # Reload with relationships
    stmt = (
        select(SessionModel)
        .where(SessionModel.id == session.id)
        .options(selectinload(SessionModel.messages), selectinload(SessionModel.artifacts))
    )
    res = await db.execute(stmt)
    full_session = res.scalar_one()

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
        for m in full_session.messages
    ]

    artifacts = [
        ArtifactSchema(
            id=a.id,
            title=a.title,
            artifact_type=a.artifact_type,
            content=a.content,
            meta=a.meta or {}
        )
        for a in full_session.artifacts
    ]

    return SessionDetail(
        id=full_session.id,
        title=full_session.title,
        model_provider=full_session.model_provider,
        messages=messages,
        artifacts=artifacts,
        created_at=full_session.created_at,
        updated_at=full_session.updated_at
    )

@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    await verify_session_ownership(session_id, user, db)
    stmt = delete(SessionModel).where(SessionModel.id == session_id)
    await db.execute(stmt)
    await db.commit()
    return {"message": "Session deleted successfully"}

# --- Chat & Ask Endpoint ---
@router.post("/chat", response_model=ChatResponse)
@router.post("/ask", response_model=ChatResponse)
async def chat_endpoint(
    req: ChatRequest,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    session_id = req.session_id
    clean_title = req.message.strip().split("\n")[0][:45]

    if not session_id:
        new_session = SessionModel(
            user_id=user.id if user else None,
            title=clean_title,
            model_provider=req.model or LLMFactory.get_active_provider_name()
        )
        db.add(new_session)
        await db.commit()
        await db.refresh(new_session)
        session_id = new_session.id
    else:
        # Verify ownership of existing session
        await verify_session_ownership(session_id, user, db)

    # Fetch prior conversation history
    hist_stmt = (
        select(MessageModel)
        .where(MessageModel.session_id == session_id)
        .order_by(MessageModel.created_at)
    )
    hist_res = await db.execute(hist_stmt)
    history_records = hist_res.scalars().all()
    # Execute chat via Agent Orchestrator with RAG grounding and user_id isolation
    result = await agent_orchestrator.execute_chat(
        db=db,
        session_id=session_id,
        user_message=req.message,
        model_override=req.model,
        user_id=user.id if user else None
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


# --- Ship 30 for 30 Writing Studio ---
@router.post("/writing/ship30", response_model=WritingResponse)
@router.post("/writing/generate", response_model=WritingResponse)
async def generate_ship30_essay(
    req: WritingRequest,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    start_time = time.time()
    
    # Check if user has personal context to incorporate
    personal_ctx = ""
    if user:
        ctx_stmt = select(PersonalContextModel).where(PersonalContextModel.user_id == user.id)
        ctx_res = await db.execute(ctx_stmt)
        user_ctx = ctx_res.scalar_one_or_none()
        if user_ctx and user_ctx.problem:
            personal_ctx = f"Company Context: {user_ctx.company_type} ({user_ctx.users_scale}), Bottleneck: {user_ctx.problem}"

    essay = await ship30_skill.generate_atomic_essay(
        topic=req.topic,
        target_words=req.target_words or 1250,
        style=req.style or "ship30",
        guest_focus=req.guest_focus
    )
    latency_ms = int((time.time() - start_time) * 1000)

    # Persist generated essay into user's private artifacts
    art_model = ArtifactModel(
        user_id=user.id if user else None,
        session_id=req.session_id,
        title=essay.title,
        artifact_type="markdown",
        content=essay.content,
        meta={"style": req.style, "word_count": essay.word_count, "hook": essay.hook}
    )
    db.add(art_model)
    await db.commit()
    await db.refresh(art_model)

    return WritingResponse(
        title=essay.title,
        content=essay.content,
        hook=essay.hook,
        word_count=essay.word_count,
        citations=essay.citations,
        artifact={
            "id": art_model.id,
            "title": essay.title,
            "type": "markdown",
            "word_count": essay.word_count
        },
        model_used=LLMFactory.get_active_provider_name(),
        latency_ms=latency_ms
    )

# --- Artifacts Management (Private to User) ---
@router.get("/artifacts", response_model=List[ArtifactSchema])
async def list_artifacts(
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    if user:
        stmt = (
            select(ArtifactModel)
            .where(ArtifactModel.user_id == user.id)
            .order_by(desc(ArtifactModel.created_at))
        )
    else:
        stmt = (
            select(ArtifactModel)
            .where(ArtifactModel.user_id.is_(None))
            .order_by(desc(ArtifactModel.created_at))
        )
        
    res = await db.execute(stmt)
    artifacts = res.scalars().all()

    return [
        ArtifactSchema(
            id=a.id,
            title=a.title,
            artifact_type=a.artifact_type,
            content=a.content,
            meta=a.meta or {}
        )
        for a in artifacts
    ]

@router.post("/artifacts", response_model=ArtifactSchema)
async def create_artifact(
    req: ArtifactCreateRequest,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    new_art = ArtifactModel(
        user_id=user.id if user else None,
        session_id=req.session_id,
        title=req.title,
        artifact_type=req.artifact_type,
        content=req.content,
        meta=req.meta or {}
    )
    db.add(new_art)
    await db.commit()
    await db.refresh(new_art)

    return ArtifactSchema(
        id=new_art.id,
        title=new_art.title,
        artifact_type=new_art.artifact_type,
        content=new_art.content,
        meta=new_art.meta or {}
    )

@router.get("/artifacts/{artifact_id}", response_model=ArtifactSchema)
async def get_artifact_detail(
    artifact_id: str,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    art = await verify_artifact_ownership(artifact_id, user, db)
    return ArtifactSchema(
        id=art.id,
        title=art.title,
        artifact_type=art.artifact_type,
        content=art.content,
        meta=art.meta or {}
    )

@router.delete("/artifacts/{artifact_id}")
async def delete_artifact(
    artifact_id: str,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    await verify_artifact_ownership(artifact_id, user, db)
    stmt = delete(ArtifactModel).where(ArtifactModel.id == artifact_id)
    await db.execute(stmt)
    await db.commit()
    return {"message": "Artifact deleted successfully from private library"}

# --- Differentiating Intelligence Endpoints ---
@router.post("/challenge")
async def challenge_advice_route(req: ChallengeRequest):
    return intelligence_engine.challenge_advice(req.topic, req.claim)

@router.post("/context/apply")
@router.post("/apply-context")
async def apply_context_route(
    req: ApplyContextRequest,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    context_dict = {
        "company_type": req.company_type,
        "users": req.users,
        "activation": req.activation,
        "problem": req.problem,
        "constraints": req.constraints
    }
    
    # If user is authenticated, also sync to their personal_context model
    if user:
        ctx_stmt = select(PersonalContextModel).where(PersonalContextModel.user_id == user.id)
        ctx_res = await db.execute(ctx_stmt)
        ctx = ctx_res.scalar_one_or_none()
        if ctx:
            ctx.company_type = req.company_type
            ctx.users_scale = req.users
            ctx.activation_rate = req.activation
            ctx.problem = req.problem
            ctx.constraints = req.constraints
            await db.commit()

    return intelligence_engine.apply_context(context_dict, req.topic)

@router.post("/decision/memo")
@router.post("/decision-memo")
@router.post("/decisions")
async def generate_decision_memo_route(
    req: DecisionMemoRequest,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    res = intelligence_engine.generate_decision_memo(req.decision_question, req.options, req.constraints)
    
    # Save decision memo into user's private artifacts
    art_model = ArtifactModel(
        user_id=user.id if user else None,
        title=res["title"],
        artifact_type="markdown",
        content=res["artifact_content"],
        meta={"type": "decision_memo", "question": req.decision_question}
    )
    db.add(art_model)
    await db.commit()
    await db.refresh(art_model)
    
    res["artifact_id"] = art_model.id
    return res

@router.post("/experiment/brief")
@router.post("/experiment-brief")
@router.post("/experiments")
async def generate_experiment_brief_route(
    req: ExperimentBriefRequest,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    res = intelligence_engine.generate_experiment_brief(req.problem, req.primary_metric, req.hypothesis)
    
    # Save experiment brief into user's private artifacts
    content_str = res.get("artifact_content") or res.get("brief_content") or ""
    art_model = ArtifactModel(
        user_id=user.id if user else None,
        title=res["title"],
        artifact_type="markdown",
        content=content_str,
        meta={"type": "experiment_brief", "problem": req.problem}
    )

    db.add(art_model)
    await db.commit()
    await db.refresh(art_model)
    
    res["artifact_id"] = art_model.id
    return res

@router.post("/framework/build")
@router.post("/framework-build")
@router.post("/frameworks")
async def build_framework_route(
    req: FrameworkRequest,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    res = intelligence_engine.build_framework(req.concept)
    
    # Save framework tree into user's private artifacts
    content_str = res.get("artifact_content") or res.get("diagram") or ""
    art_model = ArtifactModel(
        user_id=user.id if user else None,
        title=f"Framework: {req.concept}",
        artifact_type="markdown",
        content=content_str,
        meta={"type": "framework_tree", "concept": req.concept}
    )

    db.add(art_model)
    await db.commit()
    await db.refresh(art_model)
    
    res["artifact_id"] = art_model.id
    return res


@router.post("/compare/guests")
@router.post("/compare-guests")
async def compare_guests_route(req: CompareGuestsRequest):
    return intelligence_engine.compare_guests(req.topic, req.guest_names)

@router.get("/knowledge/graph")
@router.get("/knowledge-graph")
async def get_knowledge_graph_route():
    return intelligence_engine.get_knowledge_graph()

@router.post("/pmf/diagnostic")
@router.post("/pmf-diagnostic")
async def evaluate_pmf_diagnostic_route(req: PMFDiagnosticRequest):
    signals = {
        "retention": req.retention,
        "activation": req.activation,
        "repeat_usage": req.repeat_usage,
        "referral": req.referral,
        "willingness_to_pay": req.willingness_to_pay,
        "usage_frequency": req.usage_frequency
    }
    return intelligence_engine.evaluate_pmf_diagnostic(signals)

@router.post("/essay/verify_grounding")
@router.post("/verify-grounding")
async def verify_essay_grounding_route(req: VerifyGroundingRequest):
    return intelligence_engine.verify_essay_grounding(req.essay_text)

