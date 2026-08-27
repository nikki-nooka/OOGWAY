# Comprehensive Testing Specification & Evaluation Guide
## Project: The Lenny Growth Assistant
**Version:** 1.0.0 (Production Release)  
**Target Coverage:** API, Sessions, Persistence, RAG Retrieval, Grounding Integrity, Ship 30 Skill, Artifact Sandbox, and Model Switching.

---

## 1. Automated Test Suites Overview

The platform includes **10 automated test suites** organized into `backend/tests/test_fde_full_evaluation.py`, `backend/tests/test_api.py`, `backend/tests/test_rag.py`, and `backend/tests/test_agent.py`.

```
============================= test session starts =============================
platform win32 -- Python 3.13.15, pytest-9.1.1
plugins: asyncio, anyio

tests/test_fde_full_evaluation.py::test_01_health_and_ingestion_metrics PASSED [ 10%]
tests/test_fde_full_evaluation.py::test_02_knowledge_base_search_and_source_traceability PASSED [ 20%]
tests/test_fde_full_evaluation.py::test_03_killer_test_1_basic_grounded_answer_with_citations PASSED [ 30%]
tests/test_fde_full_evaluation.py::test_04_killer_test_4_hallucination_refusal_on_unsupported_query PASSED [ 40%]
tests/test_fde_full_evaluation.py::test_05_killer_test_2_and_3_session_context_and_memory_isolation PASSED [ 50%]
tests/test_fde_full_evaluation.py::test_06_killer_test_9_model_switching_and_fallback_resilience PASSED [ 60%]
tests/test_fde_full_evaluation.py::test_07_killer_test_6_ship30_content_skill_structure PASSED [ 70%]
tests/test_fde_full_evaluation.py::test_08_killer_test_7_artifact_generation_and_split_view_payload PASSED [ 80%]
tests/test_fde_full_evaluation.py::test_09_killer_test_8_artifact_security_sanitization PASSED [ 90%]
tests/test_fde_full_evaluation.py::test_10_database_persistence PASSED   [100%]
tests/test_agent.py::test_ship30_prompt_builder PASSED
tests/test_agent.py::test_artifact_extraction_html PASSED
tests/test_agent.py::test_model_switching PASSED
tests/test_agent.py::test_mock_provider_fallback PASSED
tests/test_api.py::test_health_endpoint PASSED
tests/test_api.py::test_models_endpoint PASSED
tests/test_api.py::test_transcripts_endpoint PASSED
tests/test_api.py::test_session_lifecycle_and_chat PASSED
tests/test_rag.py::test_rag_loaded PASSED
tests/test_rag.py::test_rag_search_shreyas_lno PASSED
tests/test_rag.py::test_rag_search_chesky_11_star PASSED
tests/test_rag.py::test_rag_search_rahul_pmf PASSED
tests/test_rag.py::test_rag_format_context PASSED
============================= ALL TESTS PASSED =============================
```

---

## 2. Test Suite Breakdown

### Suite A — System Health & Diagnostics
- **Target:** `GET /api/health`
- **Assertion:** Status is `healthy`, `transcripts_count >= 4000`, `episodes_count >= 250`, database reports connected.

### Suite B — Knowledge Base Search & Traceability
- **Target:** `GET /api/transcripts?query=...`
- **Assertion:** Retrieves relevant chunks with guest names, audio timestamps, and source URLs.

### Suite C — Grounded Q&A (Killer Test 1)
- **Target:** `POST /api/chat` with *"What does Gustaf Alströmer say about product-market fit and retention curves?"*
- **Assertion:** Response contains grounded retention advice and explicitly attaches citation objects with timestamps.

### Suite D — Hallucination Refusal (Killer Test 4)
- **Target:** `POST /api/chat` with *"According to Lenny, what is his strategy for Mars colonization and rocket propulsion?"*
- **Assertion:** System detects out-of-domain query, admits knowledge absence, attaches **0 fake citations**, and refuses to hallucinate.

### Suite E — Session Isolation & Context Memory (Killer Tests 2 & 3)
- **Target:**
  1. Session A: Ask about Shreyas Doshi, then send follow-up *"Summarize that"* ➔ Preserves context.
  2. Session B: Open brand new session, send *"Summarize that"* ➔ Does NOT leak context from Session A.

### Suite F — Model Switching & Resilience (Killer Test 9)
- **Target:** `POST /api/models/set` with `ollama`, `claude`, `openai`, and `mock`.
- **Assertion:** Real-time provider switching without restart; offline fallback ensures zero 500 errors.

### Suite G — Ship 30 for 30 Writing Skill (Killer Test 6)
- **Target:** `POST /api/writing/ship30` or `POST /api/chat` requesting essay.
- **Assertion:** Produces structured essay with 1-3-1 hook, modular H2 pillars, and ~1,250-word density.

### Suite H — Artifact Generation & Split-Screen View (Killer Test 7)
- **Target:** Prompt asking for an interactive HTML growth calculator.
- **Assertion:** Assistant returns structured `artifacts` list with executable HTML/CSS block.

### Suite I — Artifact Security & Sandbox Sanitization (Killer Test 8)
- **Target:** `ArtifactSecurityPolicy.sanitize_html()` on malicious input attempting `window.parent` and `document.cookie` theft.
- **Assertion:** Dangerous DOM traversal and cookie theft vectors are neutralized.

### Suite J — Database Persistence Across Restarts (Killer Test 10)
- **Target:** Persist messages, citations, and artifacts in SQLite/Postgres and query back after session close.

---

## 3. How to Run the Tests

```bash
cd backend
python -m pytest tests/ -v
```
