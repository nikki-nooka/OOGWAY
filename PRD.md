# Product Requirements Document (PRD) & Discovery Brief
## Project: The Lenny Growth Assistant
**Author:** Forward Deployed Engineering Lead  
**Engagement Target:** Product & Growth Intelligence Platform  
**Version:** 1.0.0 (Production Release)  
**Theme:** Warm Editorial Intelligence

---

## 1. Executive Summary & Discovery Brief

### 1.1 User & Problem Statement
- **Primary Persona:** Senior Product Managers, Growth Leads, Founders, and Strategy Executives.
- **The Core Problem:** Lenny's Podcast and Newsletter constitute one of the world's highest-signal libraries of product, growth, pricing, and scaling knowledge. However, knowledge workers currently face severe operational friction:
  1. *Discovery & Retrieval Friction:* Hundreds of hours of audio make it difficult to locate specific tactical playbooks (e.g., Sean Ellis PMF test benchmarks, LNO task matrix, or B2B PLG loops).
  2. *Synthesizing Actionable Formats:* Converting conversational podcast insights into executive-ready essays or structured frameworks takes hours.
  3. *Static vs Interactive Tools:* PMs need interactive tooling (calculators, prioritization canvases, dashboard widgets) rather than just passive walls of text.

### 1.2 The Assistant's Value Proposition
The Lenny Growth Assistant provides an end-to-end editorial intelligence workspace that:
- Ingests and indexes 4,380+ verified transcript chunks across 279 episodes from Lenny's Podcast.
- Delivers **strictly grounded, hallucination-free strategic answers** with explicit speaker citations and audio timestamps.
- Features a **Ship 30 for 30 Content Engine** producing ~1,250-word atomic essays.
- Employs a **Claude-Style Split-Pane Artifact Viewer** to render live, sandboxed interactive HTML/CSS tools natively beside the chat.
- Provides a **Warm Editorial Magazine Feed** for discovery and interactive deep dives.

---

## 2. Success Metrics

| Metric Category | Target KPI | Measurement & Verification |
| :--- | :--- | :--- |
| **Grounding & Accuracy** | **100% Citation Coverage** | Every factual PM claim or quote links to an exact guest, episode ID, and timestamp. |
| **Hallucination Prevention** | **0 Unsubstantiated Claims** | System admits when knowledge base lacks context rather than hallucinating. |
| **Interactive Latency** | **< 1.5s First-Token Response** | Fast BM25 token search ensures sub-second retrieval across 4,380+ chunks. |
| **Evaluator Operability** | **< 30s Zero-Friction Setup** | 1-command startup (`start.bat` or `docker-compose.yml`) with automated SQLite fallback. |
| **Content Quality** | **Ship 30 Framework Adherence** | 1-3-1 hook structure, modular H2 pillars, bulleted takeaways, and ~1,250-word density. |

---

## 3. Core Functional Requirements Matrix

1. **Editorial Magazine Home (`/`):** Masthead, featured story, supporting cards, popular topics strip.
2. **Explore Magazine & Topic Deep Dives (`/explore`):** Filterable category grid, framework cards, guest index, and topic modal with verbatim quotes.
3. **Conversational Assistant (`/chat`):** 3-column research experience, session memory, verbatim timestamps, and out-of-domain guardrail.
4. **Writing Studio (`/writing`):** Ship 30 for 30 atomic essay generator with live preview and markdown editor.
5. **Artifact Viewer & Sandbox (`/artifacts`):** Side-by-side split screen with isolated iframe rendering and Safe Preview Security Banner.
6. **Settings & Diagnostics (`/settings`):** Dynamic multi-model switching (Local Ollama, Claude, OpenAI, Offline Fallback).
7. **Presentation Slide Deck (`/slides`):** Interactive 14-slide executive presentation.
