from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, EmailStr

# --- Authentication & User Schemas ---
class UserSignup(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full Name")
    email: str = Field(..., description="Valid user email address")
    password: str = Field(..., min_length=6, description="Password (minimum 6 characters)")

class UserLogin(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=1, description="Password")

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str = "Product Builder"
    company: str = ""
    industry: str = "B2B SaaS"
    experience_level: str = "Senior"
    location: str = ""
    tagline: str = "Exploring growth, product strategy, and AI-powered products."
    interests: List[str] = ["Product Strategy", "Growth", "Retention", "PMF", "AI"]
    focus_goal: str = "Improve activation and time-to-value"
    focus_metric: str = "Activation Rate"
    focus_challenge: str = "Users are signing up but dropping off before reaching their primary Aha! milestone."
    focus_progress: int = 65
    privacy_use_context: bool = True
    privacy_personalize_explore: bool = True
    privacy_use_history: bool = False
    created_at: datetime

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    company: Optional[str] = None
    industry: Optional[str] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None
    tagline: Optional[str] = Field(None, max_length=150)
    interests: Optional[List[str]] = None
    focus_goal: Optional[str] = None
    focus_metric: Optional[str] = None
    focus_challenge: Optional[str] = None
    focus_progress: Optional[int] = Field(None, ge=0, le=100)
    privacy_use_context: Optional[bool] = None
    privacy_personalize_explore: Optional[bool] = None
    privacy_use_history: Optional[bool] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

class WorkspaceSummaryResponse(BaseModel):
    user: UserProfile
    context: Optional[Dict[str, Any]] = None
    stats: Dict[str, int]
    knowledge_dna: List[Dict[str, Any]]
    recent_thinking: List[Dict[str, Any]]
    active_learning: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
    profile_completeness: int

class PersonalContextUpdate(BaseModel):
    company_type: str = Field("B2B SaaS", description="e.g. B2B SaaS, Marketplace, Consumer")
    users_scale: str = Field("10,000 MAU", description="Current audience/user scale")
    activation_rate: str = Field("20%", description="Current activation baseline")
    problem: str = Field("", description="Primary friction or bottleneck")
    constraints: str = Field("", description="Team size, runway, constraints")

class PersonalContextResponse(BaseModel):
    id: str
    user_id: str
    company_type: str
    users_scale: str
    activation_rate: str
    problem: str
    constraints: str
    updated_at: datetime


# --- Chat & Session Schemas ---
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

# --- Differentiating Intelligence Schemas ---
class ChallengeRequest(BaseModel):
    topic: str
    claim: Optional[str] = ""

class ApplyContextRequest(BaseModel):
    topic: str
    company_type: Optional[str] = "B2B SaaS"
    users: Optional[str] = "15,000"
    activation: Optional[str] = "18%"
    problem: Optional[str] = "Weak onboarding & drop-off"
    constraints: Optional[str] = "Small engineering team"

class DecisionMemoRequest(BaseModel):
    decision_question: str
    options: List[str] = Field(default_factory=lambda: ["Option A", "Option B"])
    constraints: Optional[str] = ""

class ExperimentBriefRequest(BaseModel):
    problem: str
    primary_metric: Optional[str] = "Activation Rate"
    hypothesis: Optional[str] = ""

class FrameworkRequest(BaseModel):
    concept: str

class CompareGuestsRequest(BaseModel):
    topic: str
    guest_names: Optional[List[str]] = None

class PMFDiagnosticRequest(BaseModel):
    retention: Optional[float] = 0.65
    activation: Optional[float] = 0.50
    repeat_usage: Optional[float] = 0.60
    referral: Optional[float] = 0.40
    willingness_to_pay: Optional[float] = 0.70
    usage_frequency: Optional[float] = 0.55

class VerifyGroundingRequest(BaseModel):
    essay_text: str
