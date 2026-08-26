# Product Requirements Document (PRD) & Discovery Brief
## Project: The Lenny Growth Assistant
**Author:** Forward Deployed Engineering Lead  
**Engagement Target:** Product & Growth Intelligence Platform  
**Version:** 1.0.0 (Production Release)  
**Date:** August 2026  

---

## 1. Executive Summary & Discovery Brief

### 1.1 User & Problem Statement
- **Primary Persona:** Senior Product Managers, Growth Leads, Founders, and Strategy Executives.
- **The Core Problem:** Lenny's Podcast and Newsletter constitute one of the world's highest-signal libraries of product, growth, pricing, and scaling knowledge. However, knowledge workers currently face severe operational friction:
  1. *Discovery & Retrieval Friction:* Hundreds of hours of audio make it difficult to locate specific tactical playbooks (e.g., Sean Ellis PMF test benchmarks, LNO task matrix, or B2B PLG loops).
  2. *Synthesizing Actionable Formats:* Converting conversational podcast insights into executive-ready essays or structured frameworks takes hours.
  3. *Static vs Interactive Tools:* PMs need interactive tooling (calculators, prioritization canvases, dashboard widgets) rather than just passive walls of text.

### 1.2 The Assistant's Value Proposition
The Lenny Growth Assistant provides an end-to-end conversational AI interface that:
- Ingests and indexes verified transcripts from Lenny's Podcast.
- Delivers **strictly grounded, hallucination-free strategic answers** with explicit speaker citations and audio timestamps.
- Features a **Ship 30 for 30 Content Engine** producing ~1,250-word atomic essays.
- Employs a **Claude-Style Split-Pane Artifact Viewer** to render live, sandboxed interactive HTML/CSS tools natively beside the chat.

---

## 2. Success Metrics

| Metric Category | Target KPI | Measurement & Verification |
| :--- | :--- | :--- |
| **Grounding & Accuracy** | **100% Citation Coverage** | Every factual PM claim or quote must link to an exact guest, episode ID, and timestamp. |
| **Hallucination Prevention** | **0 Unsubstantiated Claims** | System admits when knowledge base lacks context rather than hallucinating external sources. |
| **Interactive Latency** | **< 1.5s First-Token Response** | Fast hybrid BM25 + dense token search ensures sub-second retrieval across transcript chunks. |
| **Evaluator Operability** | **< 30s Zero-Friction Setup** | 1-command startup (`start.bat` or `docker-compose.yml`) with automated SQLite fallback if Postgres is unconfigured. |
| **Content Quality** | **Ship 30 Framework Adherence** | 1-3-1 hook structure, modular H2 pillars, bulleted takeaways, and ~1,250-word density. |

---

## 3. Assumptions & Scope Decisions

### 3.1 Assumptions Made
1. **Model Infrastructure Flexibility:** Evaluators will test on varying machines; therefore, the system must support **Local Ollama** (default for local compliance), **Cloud Claude/OpenAI**, and an **Automated Offline Fallback Engine** so live evaluation never fails.
2. **Database Provisioning:** While production utilizes PostgreSQL (Supabase/Railway), local evaluation should never fail if a remote database is offline; hence an automatic SQLite fallback is embedded.
3. **Artifact Untrusted Execution:** Generated HTML/CSS artifacts must be treated as untrusted user input and isolated in a sandboxed iframe.

### 3.2 In-Scope vs. Intentionally Excluded

```
IN SCOPE (Shipped in v1.0):
├── Grounded Hybrid RAG engine (BM25 + Semantic overlap)
├── Ingestion pipeline with 8+ landmark Lenny Podcast transcripts
├── Dual-engine persistence (PostgreSQL + SQLite) with full session history
├── Flexible LLM Engine (Ollama Local, Claude 3.5 Sonnet, GPT-4o, Offline Fallback)
├── Dedicated Ship 30 for 30 essay generation skill (~1,250 words)
├── Claude-Style Split-Pane Artifact Viewer with interactive iframe sandbox
├── Transcript citation badge inspector drawer with timestamps
├── Dark/Light modern glassmorphic responsive UI
└── Automated pytest test suite & Docker Compose orchestration

INTENTIONALLY EXCLUDED (Post-v1 Roadmap):
├── Multi-tenant Enterprise RBAC (Single-tenant workspace optimized for evaluator speed)
├── Audio synthetic voice cloning (Prioritized ultra-fast text/artifact rendering)
└── Live Web Scraping during queries (Strictly constrained to transcript grounding to prevent web hallucination)
```

---

## 4. Key Risks & Mitigation Strategy

1. **Risk:** Model Hallucination of False PM Advice  
   *Mitigation:* Strict system prompt instructions and RAG grounding injection with explicit `[Source X]` citations. If query is out of domain, system states knowledge absence.
2. **Risk:** Script Injection / XSS via HTML Artifacts  
   *Mitigation:* Backend `ArtifactSecurityPolicy` strips dangerous DOM traversal patterns (`window.parent`, `document.cookie`); Frontend renders within `iframe` with `sandbox="allow-scripts allow-forms allow-modals"`.
3. **Risk:** Local Evaluator Machine Incompatibilities (No Ollama or API Keys)  
   *Mitigation:* Embedded `MockGroundedProvider` acts as a zero-setup offline fallback providing full feature parity.

---

## 5. Acceptance Criteria

- [x] **AC-1:** Session management allows creating, retrieving, and deleting independent chat sessions.
- [x] **AC-2:** Chat answers cite specific podcast guests, episode titles, and timestamps.
- [x] **AC-3:** Model provider can be toggled in real time without restarting the server.
- [x] **AC-4:** Ship 30 for 30 prompts generate structured essays with strong hooks and bulleted frameworks.
- [x] **AC-5:** Interactive HTML artifacts render side-by-side in a split screen with live preview and code view.
- [x] **AC-6:** Automated test suite passes with 100% success rate.
