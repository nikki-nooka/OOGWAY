# The Lenny Growth Assistant
> **Forward Deployed Engineer Take-Home Project**  
> AI-Powered Product & Strategy Intelligence Platform Grounded in Transcripts from *Lenny's Podcast*.

---

## 🌟 Executive Overview
**The Lenny Growth Assistant** is a full-stack, enterprise-grade conversational AI platform built to turn Lenny’s Podcast transcripts into actionable product and growth intelligence. It features:
- **Strictly Grounded RAG with 4,380+ Ingested Chunks:** Ingests the complete official repository (`ChatPRD/lennys-podcast-transcripts`) spanning **279 full episodes** and **4,389 indexed chunks** with speaker citations and timestamps.
- **Dedicated Ship 30 for 30 Skill:** Converts grounded PM insights into viral, atomic ~1,250-word essays (1-3-1 hook structure, modular frameworks, bold takeaways).
- **Claude-Style In-App Artifact Viewer:** Interactive split-screen rendering live, sandboxed HTML/CSS calculators, dashboards, and markdown specs beside the chat.
- **Flexible Multi-Model Engine:** Toggle between **Local Ollama (llama3.2)** (mandatory for offline local demo), **Anthropic Claude**, **OpenAI GPT-4o**, and an **Embedded Grounded Engine** with zero setup friction.
- **Dual-Engine Persistence:** Async SQLAlchemy supporting **PostgreSQL (Supabase/Railway)** with automatic **SQLite fallback** for 10-second evaluator onboarding.

---

## 🏗️ System Architecture

```
OOGWAY/
├── backend/
│   ├── app/
│   │   ├── api/routes.py              # REST API endpoints (Chat, Sessions, Transcripts, Models)
│   │   ├── api/schemas.py             # Pydantic v2 validation contracts
│   │   ├── core/config.py             # Settings & environment configuration
│   │   ├── core/security.py           # HTML sanitization & iframe security policies
│   │   ├── db/database.py             # Async SQLAlchemy session manager (PG + SQLite)
│   │   ├── db/models.py               # Session, Message, Artifact DB models
│   │   ├── engine/agent.py            # Agent orchestrator & intent routing
│   │   ├── engine/llm_provider.py     # Ollama, Claude, OpenAI, and Grounded Fallback providers
│   │   ├── engine/rag.py              # BM25 + semantic inverted index retrieval engine
│   │   ├── engine/ship30_skill.py     # Ship 30 for 30 structured essay generation skill
│   │   ├── engine/artifact_engine.py  # Sandboxed HTML/CSS & Markdown extractor
│   │   ├── data/transcripts/          # Curated Lenny Podcast transcripts (JSON/Markdown)
│   │   └── main.py                    # FastAPI app entrypoint & lifecycle handlers
│   ├── tests/                         # Pytest test suite (RAG, Agent, API, Persistence)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/                # Sidebar, ChatArea, ArtifactViewer, ModelSelector, SourceDrawer
│   │   ├── services/api.js            # API client service
│   │   ├── styles/                    # Obsidian dark luxury design system & split-pane styles
│   │   ├── App.jsx                    # Root state manager
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docs/
│   ├── PRD.md                         # Product Requirements Document & Discovery Brief
│   ├── architecture.md                # System Architecture, ERD, Security Policies
│   ├── design.md                      # UI/UX Design Tokens & Accessibility Specification
│   └── agent_transcripts/             # Documented agent development traces
├── docker-compose.yml                 # One-command full-stack container orchestration
├── .env.example                       # Documented environment variables
├── start.bat                          # One-click Windows local launcher
├── start.sh                           # One-click macOS/Linux launcher
└── README.md                          # Comprehensive documentation & evaluation guide
```

---

## ⚡ Quickstart (Under 60 Seconds)

### Option 1: One-Click Local Launch (Recommended)
#### On Windows:
```cmd
start.bat
```
#### On macOS / Linux:
```bash
chmod +x start.sh
./start.sh
```
*Frontend opens at `http://localhost:3000` | Backend OpenAPI Docs at `http://localhost:8000/docs`.*

---

### Option 2: One-Command Docker Compose
Ensure Docker is running, then execute:
```bash
docker-compose up --build
```

---

### Option 3: Manual Setup

#### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🦙 Local Ollama Setup (Mandatory for Demo)
1. Install [Ollama](https://ollama.com/) and start the daemon.
2. Pull the recommended local model:
   ```bash
   ollama pull llama3.2
   ```
3. The application will automatically detect Ollama at `http://localhost:11434`.
4. If Ollama is not installed or running, the platform's **Built-in Grounded Engine** automatically activates, allowing you to test 100% of the UI, RAG citations, Ship 30 essays, and interactive artifacts without disruption.

---

## 🧪 Automated Testing Suite
Run the comprehensive test suite verifying RAG retrieval, agent routing, model failover, and persistence:
```bash
cd backend
python -m pytest tests -v
```

**Test Coverage Highlights:**
- `test_rag.py`: Verifies BM25 ranking, guest name boosts, and transcript citation formatting.
- `test_agent.py`: Verifies Ship 30 for 30 prompt structuring, HTML artifact extraction, and model switching.
- `test_api.py`: Validates `/api/health`, `/api/models`, `/api/transcripts`, and end-to-end session lifecycle.

---

## 📑 Required Deliverables Matrix

| # | Deliverable | Path in Repository |
| :--- | :--- | :--- |
| **1** | **Source Code** | `backend/`, `frontend/`, `docker-compose.yml` |
| **2** | **README.md** | [README.md](file:///c:/Users/Nikshith/Desktop/OOGWAY/README.md) |
| **3** | **PRD & Discovery Brief** | [docs/PRD.md](file:///c:/Users/Nikshith/Desktop/OOGWAY/docs/PRD.md) |
| **4** | **design.md** | [docs/design.md](file:///c:/Users/Nikshith/Desktop/OOGWAY/docs/design.md) |
| **5** | **architecture.md** | [docs/architecture.md](file:///c:/Users/Nikshith/Desktop/OOGWAY/docs/architecture.md) |
| **6** | **Agent Transcripts** | [docs/agent_transcripts/development_trace.md](file:///c:/Users/Nikshith/Desktop/OOGWAY/docs/agent_transcripts/development_trace.md) |
| **7** | **Automated Tests** | `backend/tests/` (13/13 passing) |
| **8** | **Deployment Scripts** | `start.bat`, `start.sh`, `docker-compose.yml` |

---

## 🛡️ Security & Isolation Guarantee
All generated HTML/CSS artifacts are sanitized by `ArtifactSecurityPolicy` and rendered in an isolated `iframe` with `sandbox="allow-scripts allow-forms allow-modals"`. The sandbox blocks `window.parent` traversal, cookies, and localStorage access to protect host application security.
