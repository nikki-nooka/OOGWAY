from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User prompt or PM/Growth question")
    session_id: Optional[str] = Field(None, description="Active session UUID")
    model: Optional[str] = Field(None, description="Optional override for model provider ('ollama', 'claude', 'openai', 'mock')")

class CitationSchema(BaseModel):
    id: str
    episode_title: str
    guest: str
    timestamp: str
    source_url: str
    quote: str
    relevance_score: float = 0.0

class ArtifactSchema(BaseModel):
    id: str
    title: str
    artifact_type: str
    content: str
    meta: Dict[str, Any] = {}

class ChatResponse(BaseModel):
    message_id: str
    session_id: str
    role: str
    content: str
    citations: List[Dict[str, Any]] = []
    artifacts: List[Dict[str, Any]] = []
    model_used: str
    latency_ms: int

class SessionCreate(BaseModel):
    title: Optional[str] = "New Discussion"
    model_provider: Optional[str] = "ollama"

class SessionSummary(BaseModel):
    id: str
    title: str
    model_provider: str
    message_count: int = 0
    artifact_count: int = 0
    created_at: datetime
    updated_at: datetime

class MessageDetail(BaseModel):
    id: str
    role: str
    content: str
    citations: List[Dict[str, Any]] = []
    artifacts: List[Dict[str, Any]] = []
    model_used: Optional[str] = None
    latency_ms: Optional[int] = None
    created_at: datetime

class SessionDetail(BaseModel):
    id: str
    title: str
    model_provider: str
    messages: List[MessageDetail] = []
    artifacts: List[ArtifactSchema] = []
    created_at: datetime
    updated_at: datetime

class WritingRequest(BaseModel):
    topic: str = Field(..., min_length=2, description="Essay topic or growth framework")
    target_words: Optional[int] = Field(1250, description="Target word count (~1,250)")
    style: Optional[str] = Field("ship30", description="Writing style ('ship30', 'memo', 'brief', 'summary')")
    guest_focus: Optional[str] = Field(None, description="Optional guest name to focus on")
    session_id: Optional[str] = Field(None, description="Optional session UUID")
    model: Optional[str] = Field(None, description="Model override")

class WritingResponse(BaseModel):
    title: str
    content: str
    hook: str
    word_count: int
    citations: List[Dict[str, Any]] = []
    artifact: Optional[Dict[str, Any]] = None
    model_used: str
    latency_ms: int

class ArtifactCreateRequest(BaseModel):
    title: str = Field(..., min_length=1)
    artifact_type: str = Field("markdown", description="'html', 'markdown', or 'css'")
    content: str = Field(..., min_length=1)
    session_id: Optional[str] = None
    meta: Optional[Dict[str, Any]] = {}

class TopicSummary(BaseModel):
    id: str
    title: str
    description: str
    category: str
    chunk_count: int
    top_guests: List[str]
    frameworks: List[str]
    sample_questions: List[str]

class ModelSwitchRequest(BaseModel):
    provider: str = Field(..., description="'ollama', 'claude', 'openai', or 'mock'")

class HealthStatus(BaseModel):
    status: str
    database: str
    transcripts_count: int
    episodes_count: int
    active_model: str

