"""
Agent module for The Lenny Growth Assistant.
Provides skill routing, intent classification, and LLM orchestration.
"""
import sys
from pathlib import Path

# Add backend to sys.path for direct imports
backend_path = Path(__file__).parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from app.engine.agent import agent, AgentOrchestrator
from app.engine.ship30_skill import ship30_skill, Ship30Skill
from app.engine.artifact_engine import artifact_engine, ArtifactEngine

__all__ = ["agent", "AgentOrchestrator", "ship30_skill", "Ship30Skill", "artifact_engine", "ArtifactEngine"]
