"""
Root test runner that executes the complete test suite.
"""
import sys
from pathlib import Path
import pytest

backend_path = Path(__file__).parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from app.engine.rag import rag_engine
from app.engine.ship30_skill import ship30_skill
from app.engine.artifact_engine import artifact_engine
from app.core.security import ArtifactSecurityPolicy

def test_root_environment_and_rag_ready():
    assert len(rag_engine.chunks) >= 4000
    assert len(rag_engine.get_all_episodes()) >= 250

def test_root_ship30_skill():
    prompt = ship30_skill.build_prompt("Retention and Activation", "Grounded context here...")
    assert "Ship 30 for 30" in prompt
    assert "1-3-1 hook" in prompt

def test_root_security_sanitization():
    malicious = "<script>window.parent.location='http://evil.com'</script>"
    sanitized = ArtifactSecurityPolicy.sanitize_html(malicious)
    assert "window.parent" not in sanitized
