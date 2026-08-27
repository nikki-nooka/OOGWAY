# 📰 The Lenny Growth Assistant

> **AI-Powered Product & Strategy Intelligence Platform Grounded in Transcripts from *Lenny's Podcast*.**  
> *Full-stack conversational assistant, Ship 30 writing studio, and interactive artifact viewer built with FastAPI, React 18, and PostgreSQL/SQLite.*

<div align="center">

[![Public GitHub](https://img.shields.io/badge/GitHub-OOGWAY-181717?style=for-the-badge&logo=github)](https://github.com/nikki-nooka/OOGWAY)
[![CI Pipeline](https://img.shields.io/badge/CI%20Pipeline-Passing-22c55e?style=for-the-badge&logo=githubactions)](https://github.com/nikki-nooka/OOGWAY/actions)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-YouTube%20Walkthrough-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=K3OxMGg3kC8)
[![Automated Tests](https://img.shields.io/badge/pytest-50%2F50%20Passed%20(100%25)-22c55e?style=for-the-badge&logo=pytest)](backend/tests/)
[![Release](https://img.shields.io/badge/Release-v1.0.0-blue?style=for-the-badge&logo=github)](https://github.com/nikki-nooka/OOGWAY/releases)
[![Model Providers](https://img.shields.io/badge/Models-Ollama%20%7C%20Claude%20%7C%20OpenAI%20%7C%20Offline-6366f1?style=for-the-badge&logo=anthropic)](backend/app/engine/llm_provider.py)

</div>

---

<div align="center">

### 🗺️ Quick Navigation

[![Overview](https://img.shields.io/badge/📌-Overview-2B5C7D?style=flat-square)](#-project-overview)
[![Demo Video](https://img.shields.io/badge/🎥-Demo_Video-FF0000?style=flat-square)](#-demo-video-walkthrough)
[![Features](https://img.shields.io/badge/✨-Features-245D55?style=flat-square)](#-core-features-built--verified)
[![Architecture](https://img.shields.io/badge/🏗️-Architecture-9A5B2E?style=flat-square)](#-system-architecture)
[![Quickstart](https://img.shields.io/badge/🚀-Quickstart-D7A94B?style=flat-square)](#-quickstart--one-command-run-guide)
[![Models](https://img.shields.io/badge/🤖-Models-6366f1?style=flat-square)](#-local-ollama--model-setup)
[![API](https://img.shields.io/badge/📡-API_Reference-009688?style=flat-square)](#-api-endpoints-reference)
[![Tests](https://img.shields.io/badge/🧪-Tests-22c55e?style=flat-square)](#-test-verification--quality-records)
[![Deliverables](https://img.shields.io/badge/📋-Deliverables-181717?style=flat-square)](#-required-take-home-deliverables-mapping)

</div>

---

## 📌 Project Overview

**The Lenny Growth Assistant** turns the complete corpus of *Lenny's Podcast* (279 episodes, 4,389 transcript chunks) into a production-grade internal assistant for Product Managers, Growth Leads, and Founders.

### Key Capabilities:
1. **Grounded Answers with Exact Timestamps:** Searches across 4,389 passages using BM25 + speaker entity boosting, attributing every claim to guest, episode title, and clickable YouTube audio timestamp.
2. **Ship 30 for 30 Writing Studio:** Algorithmic essay generator crafting ~1,250-word atomic essays adhering to the 1-3-1 hook structure, modular framework pillars, and Monday morning execution checklists.
3. **Claude-Style Sandboxed Artifact Viewer:** Renders live, interactive HTML/CSS calculators, growth simulators, and dashboards inside a secure, origin-isolated iframe sandbox.
4. **Multi-Provider LLM Engine:** Seamlessly switch between Local Ollama (`llama3.2`), Anthropic Claude (`claude-3-5-sonnet`), OpenAI (`gpt-4o`), and a built-in deterministic Offline Fallback Engine.
5. **Private Workspaces & Auth:** Complete user lifecycle with PBKDF2 password hashing, HMAC-SHA256 JWT tokens, and private session isolation.

---

## 🎥 Demo Video Walkthrough

<div align="center">

[![The Lenny Growth Assistant Demo Video](https://img.youtube.com/vi/K3OxMGg3kC8/maxresdefault.jpg)](https://www.youtube.com/watch?v=K3OxMGg3kC8)

**[▶️ Click Here to Watch the Full Walkthrough on YouTube](https://www.youtube.com/watch?v=K3OxMGg3kC8)**

</div>

### ⏱️ Key Video Chapters:
- **`0:00`** — *Executive Summary & Discovery Brief* (Problem framing, target personas, JTBD)
- **`0:30`** — *Grounded Conversational Q&A* (4,389 chunks RAG, entity boost, timestamp citations)
- **`1:15`** — *Local Ollama & Multi-Model Switcher* (`llama3.2` execution, zero API keys, fallback resilience)
- **`1:45`** — *Ship 30 for 30 Studio & Claude Split-View* (1-3-1 hook engine, live HTML artifact sandbox)
- **`2:15`** — *Architectural Decisions & Trade-Offs* (In-memory BM25 vs heavy vector DBs, origin-isolated iframe)
- **`2:45`** — *Operational Handoff & Automated Tests* (50 passing automated tests, CI/CD pipeline)

---

## ✨ Core Features Built & Verified

### 1. Grounded Conversational Assistant (`/chat`)
- **4,389-Chunk In-Memory Index:** Fast BM25 lexical search with speaker entity-boosting (+25.0 score weight).
- **Exact Verbatim Citations:** Every claim cites the speaker, episode title, and clickable YouTube audio timestamp.
- **Multi-Turn Context & Session Isolation:** Conversations and memory are strictly isolated per session and user.
- **Domain Guardrail:** Rejects out-of-domain queries to eliminate hallucinations.

### 2. Ship 30 for 30 Writing Studio (`/writing`)
- **Algorithmic Hook Engine:** 1-3-1 hook structure (single-line hook, 3-line tension paragraph, 1-line thesis).
- **Modular Framework Pillars:** Structured H2 sections with bold takeaway headers.
- **Monday Morning Protocol:** Actionable execution checklists for PMs.
- **Grounding Verification:** Automated claim verification against the transcript index.
- **Live Markdown Workspace:** Real-time word count, copy-to-clipboard, and `.md` export.

### 3. Claude-Style Split-Pane Artifact Viewer (`/artifacts`)
- **Interactive Sandbox:** Live side-by-side rendering of HTML/CSS calculators, growth simulators, and dashboards.
- **Security Policy:** All untrusted code runs inside `sandbox="allow-scripts allow-forms allow-modals"` (omitting `allow-same-origin`), blocking DOM traversal, cookie access, and storage theft.
- **View Modes:** Toggle between live Preview, Raw Code, and Rendered Markdown.

### 4. Knowledge Base Explorer (`/explore` & `/sources`)
- **279-Episode Directory:** Filterable by guest, company, or framework (PMF, Retention, Pricing, PLG).
- **Transcript Search:** Deep-search across all 4,389 chunks with instant playback deep links.
- **Episode Detail Modal:** Full passage inspector with timestamps and speaker labels.

### 5. Multi-Provider LLM Engine (`/settings`)
- **Local Ollama:** Runs `llama3.2` (or `mistral`) 100% locally with zero cloud API keys.
- **Anthropic Claude:** `claude-3-5-sonnet-20241022` integration.
- **OpenAI:** `gpt-4o` integration.
- **Offline Grounded Fallback Engine:** Built-in zero-dependency deterministic synthesizer ensuring 100% functionality offline.
- **Live UI Switcher:** Change models on the fly in Settings.

### 6. User Authentication & Private Workspaces
- **PBKDF2 Password Hashing:** 100,000 rounds with random salt (zero native C-dependencies).
- **HMAC-SHA256 Signed JWTs:** Secure token authentication with 7-day expiration.
- **Private Session Isolation:** Discussions, messages, and artifacts isolated per user account.
- **Guest-to-User Adoption:** Unassigned guest sessions are automatically linked upon account creation/login.
- **Feature Protection:** Gated actions clearly prompt unauthenticated visitors to log in while preserving typed draft questions.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client["React 18 + Vite SPA (Port 3000)"]
    FastAPI["FastAPI Backend (Port 8000)"]
    
    Client -->|REST API + Bearer JWT| FastAPI
    
    subgraph "Backend Engine"
        FastAPI --> AuthMgr["Auth & Workspace Manager"]
        FastAPI --> SessionMgr["Session Isolation Service"]
        FastAPI --> AgentRouter["Agent Orchestrator & Router"]
        FastAPI --> SecurityPolicy["Artifact Security Sanitizer"]
        
        AgentRouter --> GroundedRAG["BM25 Grounded RAG Engine"]
        AgentRouter --> Ship30Skill["Ship 30 Content Engine"]
        AgentRouter --> LLMFactory["LLM Provider Abstraction Layer"]
        
        GroundedRAG --> KnowledgeIndex["4,389 Indexed Chunks / 279 Episodes"]
        
        LLMFactory --> Ollama["Local Ollama (llama3.2)"]
        LLMFactory --> Claude["Anthropic Claude 3.5"]
        LLMFactory --> OpenAI["OpenAI GPT-4o"]
        LLMFactory --> OfflineEngine["Offline Grounded Engine"]
    end

    subgraph "Persistence"
        SessionMgr --> DB["Async SQLAlchemy"]
        DB --> Postgres[("PostgreSQL")]
        DB -.->|Fallback| SQLite[("SQLite (lenny_growth.db)")]
    end

    subgraph "Client Sandbox"
        Client --> SandboxedIframe["Iframe (sandbox='allow-scripts allow-forms allow-modals')"]
    end
```

---

## 🚀 Quickstart & One-Command Run Guide

### Option 1: One-Click Startup (Recommended)
- **Windows:** Double-click [`start.bat`](start.bat)
- **macOS / Linux:** Run `chmod +x start.sh && ./start.sh`

### Option 2: Docker Compose
```bash
docker-compose up --build
```

### Option 3: Manual Startup

```bash
# 1. Backend Setup
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 2. Frontend Setup (in a second terminal)
cd frontend
npm install
npm run dev -- --port 3000 --host 127.0.0.1
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **FastAPI OpenAPI Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🤖 Local Ollama & Model Setup

1. Install [Ollama](https://ollama.com/) and pull the local model:
   ```bash
   ollama pull llama3.2
   ```
2. The assistant automatically connects to `http://localhost:11434`.
3. To optionally use Cloud LLMs, configure `backend/.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   OPENAI_API_KEY=sk-proj-...
   ```

---

## 📡 API Endpoints Reference

| Endpoint | Method | Description | Access |
| :--- | :---: | :--- | :---: |
| `/api/health` | `GET` | System health, database connection, chunk count | Public |
| `/api/auth/signup` | `POST` | User registration (PBKDF2 password hashing) | Public |
| `/api/auth/login` | `POST` | User login (returns HMAC-SHA256 JWT) | Public |
| `/api/me` | `GET` | Fetch authenticated user profile | Bearer Token |
| `/api/sessions` | `GET` | List sessions for current user | User/Guest |
| `/api/sessions` | `POST` | Create a new isolated chat session | User/Guest |
| `/api/sessions/{id}` | `GET` | Get session messages and artifacts | User/Guest |
| `/api/sessions/{id}` | `DELETE`| Delete session | User/Guest |
| `/api/chat` | `POST` | Send grounded chat message with RAG citations | User/Guest |
| `/api/writing/ship30` | `POST` | Generate full-length ~1,250-word Ship 30 atomic essay | User/Guest |
| `/api/verify-grounding`| `POST` | Evaluate factual grounding confidence of an essay | Public |
| `/api/sources` | `GET` | Search and explore 279 podcast episodes & transcripts | Public |
| `/api/sources/{id}` | `GET` | Get episode transcript chunks and metadata | Public |
| `/api/knowledge-graph`| `GET` | Graph topology of guests, topics, and frameworks | Public |
| `/api/pmf-diagnostic` | `POST` | Calculate PMF diagnostic score across 6 signals | Public |
| `/api/decisions` | `POST` | Generate structured executive decision memo | User/Guest |
| `/api/experiments` | `POST` | Generate hypothesis-driven experiment brief | User/Guest |
| `/api/frameworks` | `POST` | Generate framework diagram and mental model | User/Guest |
| `/api/compare-guests` | `POST` | Compare competing guest viewpoints on a topic | Public |
| `/api/models` | `GET` | List available models and current active provider | Public |
| `/api/models/set` | `POST` | Switch active model provider dynamically | Public |

---

## 🧪 Test Verification & Quality Records

The platform includes **50 automated pytest tests** covering API contracts, RAG ranking, agent routing, Ship 30 essays, artifact security, and database persistence with a **100% pass rate**.

### Run Test Suite:
```bash
cd backend
python -m pytest tests/ -v
```

### Test Coverage Summary:
| Test Category | Suite File | Tests | Scope & Assertions | Result |
| :--- | :--- | :---: | :--- | :---: |
| **API & Health** | `test_api.py` | 4 | Health diagnostics, model list, transcript search, session lifecycle | ✅ Passed |
| **RAG & Grounding** | `test_rag.py` | 5 | 4,389-chunk index loading, BM25 scoring, entity-boosting, timestamps | ✅ Passed |
| **Agent & Skills** | `test_agent.py` | 4 | Ship 30 prompt builder, HTML artifact extraction, multi-model fallback | ✅ Passed |
| **Security & Sandbox** | `test_security.py` | 2 | XSS prevention, iframe sanitization, script isolation | ✅ Passed |
| **Authentication** | `test_authentication.py` | 7 | PBKDF2 hashing, signup, login, JWT validation, profile route | ✅ Passed |
| **Authorization** | `test_authorization.py` | 2 | Cross-user session & artifact access block | ✅ Passed |
| **User Isolation** | `test_user_isolation.py` | 2 | Session list & personal context isolation | ✅ Passed |
| **Profile & Workspaces**| `test_profile_workspace.py`| 4 | Identity updates, workspace metrics, multi-user isolation | ✅ Passed |
| **Differentiating AI** | `test_differentiating_intelligence.py` | 10 | Decision memos, experiment briefs, PMF diagnostics, guest comparisons | ✅ Passed |
| **End-to-End Evaluation**| `test_fde_full_evaluation.py` | 10 | 10 Killer Test cases (hallucination refusal, model fallback, persistence) | ✅ Passed |

**Total:** **50 / 50 Tests Passing (100% Pass Rate)** 🟢

---

## 📁 Repository Structure

```
OOGWAY/
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions CI pipeline (Pytest + Vite Build)
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routes, auth endpoints, Pydantic schemas
│   │   ├── db/           # Async SQLAlchemy models, database engines
│   │   ├── engine/       # BM25 RAG, Agent router, Ship 30 skill, LLM providers
│   │   └── main.py       # FastAPI application entrypoint
│   ├── data/             # Ingested transcripts (279 episodes, 4,389 chunks)
│   ├── tests/            # Automated test suite (50 tests)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # ChatArea, WritingStudio, ArtifactViewer, Modals
│   │   ├── services/     # API client and JWT token manager
│   │   ├── App.jsx       # Root application layout & state
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── agent-transcripts/     # Coding agent execution traces and debug logs
├── docs/                 # Architecture, user flows, and demo script
├── PRD.md                # Discovery brief, JTBD, success metrics, assumptions, risks
├── design.md             # UI/UX design system, tokens, and screen specs
├── architecture.md       # Topology, ERD schemas, security policies
├── TESTING.md            # Automated test documentation & manual UI plan
├── docker-compose.yml    # One-command containerized deployment
├── start.bat             # Windows one-click startup script
├── start.sh              # macOS/Linux one-click startup script
└── README.md             # Main project documentation
```

---

## 📋 Required Take-Home Deliverables Mapping

| # | Deliverable | Location | Status |
| :-: | :--- | :--- | :---: |
| **1** | Public GitHub Repository | [https://github.com/nikki-nooka/OOGWAY](https://github.com/nikki-nooka/OOGWAY) | ✅ Live & Synced |
| **2** | Executive README | [README.md](README.md) | ✅ Complete |
| **3** | PRD (Discovery Brief) | [PRD.md](PRD.md) | ✅ Complete |
| **4** | Design Specification | [design.md](design.md) | ✅ Complete |
| **5** | Architecture & Security | [architecture.md](architecture.md) | ✅ Complete |
| **6** | Agent Transcripts | [agent-transcripts/](agent-transcripts/) | ✅ Complete |
| **7** | Automated Test Suite (50 Tests) | [TESTING.md](TESTING.md) & [backend/tests/](backend/tests/) | ✅ 50/50 Passed |
| **8** | CI/CD GitHub Actions | [.github/workflows/ci.yml](.github/workflows/ci.yml) | ✅ 100% Green |
| **9** | Production Tagged Release | [v1.0.0 Release](https://github.com/nikki-nooka/OOGWAY/releases) | ✅ Published |
| **10**| Demo Video Walkthrough | [YouTube Link](https://www.youtube.com/watch?v=K3OxMGg3kC8) | ✅ Uploaded & Live |

---

<div align="center">

**Submitted for the Forward Deployed Engineer Role**  
*Built by **NOOKA NIKSHITH** (`nikki-nooka`)*

</div>
