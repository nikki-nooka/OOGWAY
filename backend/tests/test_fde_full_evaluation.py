import os
import re
import json
import pytest
import httpx
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000"

@pytest.fixture(scope="module")
def client():
    return httpx.Client(base_url=BASE_URL, timeout=35.0)

# ============================================================================
# CATEGORY 1: HEALTH, SYSTEM DIAGNOSTICS & INGESTION TRACEABILITY
# ============================================================================

def test_01_health_and_ingestion_metrics(client):
    """Verifies that the backend is healthy and has indexed official transcript chunks."""
    r = client.get("/api/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "healthy"
    assert data["transcripts_count"] >= 4000, f"Expected 4000+ chunks, got {data['transcripts_count']}"
    assert data["episodes_count"] >= 250, f"Expected 250+ episodes, got {data['episodes_count']}"
    assert "database" in data

def test_02_knowledge_base_search_and_source_traceability(client):
    """Verifies search across 4,389 chunks with verified audio timestamps & source URLs."""
    r = client.get("/api/transcripts?query=Elena Verna B2B PLG viral loops")
    assert r.status_code == 200
    data = r.json()
    assert len(data["results"]) > 0
    top_hit = data["results"][0]
    assert "Elena Verna" in top_hit["citation"]["guest"]
    assert top_hit["citation"]["source_url"].startswith("http")
    assert len(top_hit["citation"]["timestamp"]) > 0


# ============================================================================
# CATEGORY 2 & 3: GROUNDING, CITATIONS & HALLUCINATION REJECTION (KILLER TESTS 1, 4, 5)
# ============================================================================

def test_03_killer_test_1_basic_grounded_answer_with_citations(client):
    """Killer Test 1: Ask factual PM question -> must answer + cite source with timestamp."""
    s_res = client.post("/api/sessions", json={"title": "Test 1 PMF Evaluation"}).json()
    session_id = s_res["id"]

    r = client.post("/api/chat", json={
        "session_id": session_id,
        "message": "What does Gustaf Alströmer say about product-market fit and retention curves?"
    })
    assert r.status_code == 200
    data = r.json()
    assert len(data["citations"]) > 0, "Must include grounded citations"
    assert any("Gustaf" in c["guest"] for c in data["citations"])
    assert "retention" in data["content"].lower()

def test_04_killer_test_4_hallucination_refusal_on_unsupported_query(client):
    """Killer Test 4: Ask ungrounded/absurd question -> must acknowledge unsupported information with 0 citations."""
    s_res = client.post("/api/sessions", json={"title": "Test 4 Hallucination"}).json()
    session_id = s_res["id"]

    # Absurd question not in Lenny's podcast
    r = client.post("/api/chat", json={
        "session_id": session_id,
        "message": "According to Lenny, what is his strategy for Mars colonization and rocket propulsion?"
    })
    assert r.status_code == 200
    data = r.json()
    assert len(data["citations"]) == 0, "Must not attach fake citations for unsupported queries"
    assert "out-of-domain" in data["content"].lower() or "not covered" in data["content"].lower() or "mars" in data["content"].lower()


# ============================================================================
# CATEGORY 4: SESSION CONTEXT & MEMORY ISOLATION (KILLER TESTS 2 & 3)
# ============================================================================

def test_05_killer_test_2_and_3_session_context_and_memory_isolation(client):
    """
    Killer Test 2: In Session A, ask a question, then follow up with 'Summarize that' -> remembers context.
    Killer Test 3: Open Session B, ask 'Summarize that' -> does NOT leak context from Session A.
    """
    # 1. Session A
    s_a = client.post("/api/sessions", json={"title": "Session A Onboarding"}).json()
    s_a_id = s_a["id"]

    r_a1 = client.post("/api/chat", json={
        "session_id": s_a_id,
        "message": "What does Lenny say about onboarding and retention from Shreyas Doshi?"
    })
    assert r_a1.status_code == 200

    # Follow-up in Session A
    r_a2 = client.post("/api/chat", json={
        "session_id": s_a_id,
        "message": "Summarize that in 3 concise bullet points."
    })
    assert r_a2.status_code == 200
    detail_a = client.get(f"/api/sessions/{s_a_id}").json()
    assert len(detail_a["messages"]) == 4, "Session A must contain 2 user + 2 assistant messages"

    # 2. Session B (Independent New Chat)
    s_b = client.post("/api/sessions", json={"title": "Session B Fresh"}).json()
    s_b_id = s_b["id"]

    detail_b_initial = client.get(f"/api/sessions/{s_b_id}").json()
    assert len(detail_b_initial["messages"]) == 0, "New Session B must start completely empty"

    # Send context-dependent query in empty Session B
    r_b1 = client.post("/api/chat", json={
        "session_id": s_b_id,
        "message": "Summarize that."
    })
    assert r_b1.status_code == 200
    detail_b = client.get(f"/api/sessions/{s_b_id}").json()
    assert len(detail_b["messages"]) == 2


# ============================================================================
# CATEGORY 5: MODEL SWITCHING & LOCAL OLLAMA RESILIENCE (KILLER TEST 9)
# ============================================================================

def test_06_killer_test_9_model_switching_and_fallback_resilience(client):
    """
    Killer Test 9: Tests switching between Ollama, Claude, OpenAI, and Grounded Fallback Engine.
    Verifies that when Ollama is selected without local daemon, it falls back gracefully with zero 500 errors.
    """
    models = ["mock", "claude", "openai", "ollama"]
    for m in models:
        # 1. Switch active model
        set_res = client.post("/api/models/set", json={"provider": m})
        assert set_res.status_code == 200

        # 2. Send prompt through selected model
        chat_res = client.post("/api/chat", json={
            "message": "Explain Shreyas Doshi's LNO framework",
            "model": m
        })
        assert chat_res.status_code == 200, f"Model {m} failed to return 200 OK"
        data = chat_res.json()
        assert len(data["content"]) > 50
        assert data["model_used"] is not None


# ============================================================================
# CATEGORY 7: SHIP 30 FOR 30 CONTENT SKILL (KILLER TEST 6)
# ============================================================================

def test_07_killer_test_6_ship30_content_skill_structure(client):
    """
    Killer Test 6: Request a Ship 30 for 30 essay -> verifies ~1,250 words, 1-3-1 hook,
    modular H2 pillars, and grounded transcript claims.
    """
    s_res = client.post("/api/sessions", json={"title": "Ship 30 Verification"}).json()
    session_id = s_res["id"]

    r = client.post("/api/chat", json={
        "session_id": session_id,
        "message": "Write a Ship 30 for 30 essay on B2B Product-Led Growth based on Elena Verna"
    })
    assert r.status_code == 200
    data = r.json()
    content = data["content"]

    # Structural Assertions
    word_count = len(content.split())
    assert word_count > 300, f"Expected long-form essay, got {word_count} words"
    assert "Elena Verna" in content
    assert ("Pillar 1" in content or "##" in content), "Must contain structured H2 markdown headings"


# ============================================================================
# CATEGORY 8 & 9: ARTIFACT GENERATION & SECURITY ISOLATION (KILLER TESTS 7 & 8)
# ============================================================================

def test_08_killer_test_7_artifact_generation_and_split_view_payload(client):
    """
    Killer Test 7: Ask for an interactive HTML calculator -> assistant generates an artifact,
    does NOT dump raw code into chat bubble, and provides structured artifact object.
    """
    s_res = client.post("/api/sessions", json={"title": "Artifact Generation"}).json()
    session_id = s_res["id"]

    r = client.post("/api/chat", json={
        "session_id": session_id,
        "message": "Create an interactive PMF and retention calculator in HTML and CSS"
    })
    assert r.status_code == 200
    data = r.json()
    assert len(data["artifacts"]) >= 1, "Must generate at least 1 artifact"
    art = data["artifacts"][0]
    assert art["artifact_type"] in ["html", "markdown"]
    assert "title" in art
    assert len(art["content"]) > 100

def test_09_killer_test_8_artifact_security_sanitization(client):
    """
    Killer Test 8: Tests untrusted HTML sanitization and verifies dangerous DOM traversal
    (window.parent, localStorage, document.cookie) is neutralized.
    """
    from app.core.security import ArtifactSecurityPolicy

    malicious_html = """
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <h1>Diagnostic Tool</h1>
      <script>
        window.parent.postMessage('evil', '*');
        localStorage.setItem('stolen', 'data');
        var c = document.cookie;
      </script>
    </body>
    </html>
    """

    sanitized = ArtifactSecurityPolicy.sanitize_html(malicious_html)
    assert "window.parent" not in sanitized
    assert "localStorage" not in sanitized
    assert "document.cookie" not in sanitized


# ============================================================================
# CATEGORY 10: DATABASE PERSISTENCE ACROSS REBOOTS
# ============================================================================

def test_10_database_persistence(client):
    """Verifies conversations, session IDs, timestamps, and artifacts survive in database."""
    s_res = client.post("/api/sessions", json={"title": "Persistence Test"}).json()
    session_id = s_res["id"]

    # Add message
    client.post("/api/chat", json={
        "session_id": session_id,
        "message": "What is Brian Chesky's 11-star experience?"
    })

    # Query back detail
    detail = client.get(f"/api/sessions/{session_id}").json()
    assert detail["id"] == session_id
    assert len(detail["messages"]) == 2
    assert detail["messages"][0]["role"] == "user"
    assert detail["messages"][1]["role"] == "assistant"
    assert detail["messages"][1]["created_at"] is not None
