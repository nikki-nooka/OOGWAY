import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    # Professional Identity & Tagline
    role = Column(String(100), default="Product Builder")
    company = Column(String(100), default="")
    industry = Column(String(100), default="B2B SaaS")
    experience_level = Column(String(50), default="Senior")
    location = Column(String(100), default="")
    tagline = Column(String(255), default="Exploring growth, product strategy, and AI-powered products.")

    # Interests & Topic Chips
    interests = Column(JSON, default=lambda: ["Product Strategy", "Growth", "Retention", "PMF", "AI"])

    # Current Focus & Goals (Signature Component)
    focus_goal = Column(String(255), default="Improve activation and time-to-value")
    focus_metric = Column(String(100), default="Activation Rate")
    focus_challenge = Column(Text, default="Users are signing up but dropping off before reaching their primary Aha! milestone.")
    focus_progress = Column(Integer, default=65)

    # Privacy & Context Controls
    privacy_use_context = Column(Boolean, default=True)
    privacy_personalize_explore = Column(Boolean, default=True)
    privacy_use_history = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    sessions = relationship("SessionModel", back_populates="user", cascade="all, delete-orphan", order_by="desc(SessionModel.updated_at)")
    artifacts = relationship("ArtifactModel", back_populates="user", cascade="all, delete-orphan", order_by="desc(ArtifactModel.created_at)")
    personal_context = relationship("PersonalContextModel", back_populates="user", uselist=False, cascade="all, delete-orphan")


class PersonalContextModel(Base):
    __tablename__ = "personal_context"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    company_type = Column(String(100), nullable=False, default="B2B SaaS")
    users_scale = Column(String(100), nullable=False, default="10,000 MAU")
    activation_rate = Column(String(100), nullable=False, default="20%")
    problem = Column(Text, nullable=False, default="")
    constraints = Column(Text, nullable=False, default="")
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("UserModel", back_populates="personal_context")

class SessionModel(Base):
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(255), nullable=False, default="New Discussion")
    model_provider = Column(String(50), default="ollama")
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("UserModel", back_populates="sessions")
    messages = relationship("MessageModel", back_populates="session", cascade="all, delete-orphan", order_by="MessageModel.created_at")
    artifacts = relationship("ArtifactModel", back_populates="session", cascade="all, delete-orphan", order_by="ArtifactModel.created_at")

class MessageModel(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(20), nullable=False) # 'user', 'assistant', 'system'
    content = Column(Text, nullable=False)
    citations = Column(JSON, default=list) # List of cited sources with episode, guest, timestamp, text
    artifacts = Column(JSON, default=list) # List of generated artifact summaries
    model_used = Column(String(50), nullable=True)
    latency_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    session = relationship("SessionModel", back_populates="messages")

class ArtifactModel(Base):
    __tablename__ = "artifacts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=True, index=True)
    message_id = Column(String(36), nullable=True)
    title = Column(String(255), nullable=False)
    artifact_type = Column(String(50), nullable=False) # 'html', 'markdown', 'css', 'react'
    content = Column(Text, nullable=False)
    meta = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("UserModel", back_populates="artifacts")
    session = relationship("SessionModel", back_populates="artifacts")
