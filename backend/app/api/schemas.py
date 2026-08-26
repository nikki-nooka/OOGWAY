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

class ModelSwitchRequest(BaseModel):
    provider: str = Field(..., description="'ollama', 'claude', 'openai', or 'mock'")

class HealthStatus(BaseModel):
    status: str
    database: str
    transcripts_count: int
    episodes_count: int
    active_model: str
