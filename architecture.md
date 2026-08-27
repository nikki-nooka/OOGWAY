# System Architecture, Schemas & Security Specification
## Project: The Lenny Growth Assistant
**Document Version:** 1.0.0 (Production Release)  
**Theme:** Warm Editorial Intelligence

---

## 1. High-Level Architecture Topology

```mermaid
graph TD
    Client["React 18 + Vite SPA<br/>(Warm Editorial UI / Claude Split-Pane)"]
    FastAPI["FastAPI Backend (Port 8000)"]
    
    Client -->|REST & SSE API| FastAPI
    
    subgraph "Core Backend Services"
        FastAPI --> SessionMgr["Session & Message Service"]
        FastAPI --> AgentRouter["Agent Orchestrator & Skill Router"]
        FastAPI --> ArtifactService["Artifact Sanitizer & Engine"]
        
        AgentRouter -->|Intent: Q&A| GroundedRAG["Grounded BM25 RAG Engine"]
        AgentRouter -->|Intent: Ship 30| Ship30Skill["Ship 30 for 30 Writing Engine"]
        AgentRouter -->|Intent: Tool/HTML| ArtifactGen["Interactive Artifact Engine"]
        AgentRouter -->|Intent: Out-of-Domain| Guardrail["Domain Boundary Guardrail"]
        
        GroundedRAG --> KnowledgeIndex["4,389 Ingested Chunks / 279 Episodes"]
        
        AgentRouter --> LLMFactory["LLM Provider Abstraction Layer"]
        LLMFactory --> Ollama["Local Ollama (llama3.2)"]
        LLMFactory --> Claude["Anthropic Claude 3.5 Sonnet"]
        LLMFactory --> OpenAI["OpenAI GPT-4o"]
        LLMFactory --> MockEngine["Built-in Grounded Fallback Engine"]
    end

    subgraph "Persistence Layer"
        SessionMgr --> DB["Async SQLAlchemy Engine"]
        DB --> Postgres[("PostgreSQL (Primary)")]
        DB -.->|Auto-Fallback| SQLite[("SQLite (Embedded Fallback)")]
    end

    subgraph "Client-Side Isolation"
        Client --> SandboxedIframe["Sandboxed Iframe<br/>(no allow-same-origin)"]
    end
```

---

## 2. Database Schema (Relational ERD)

```mermaid
erDiagram
    SESSIONS ||--o{ MESSAGES : "contains"
    SESSIONS ||--o{ ARTIFACTS : "generates"
    
    SESSIONS {
        uuid id PK
        string title
        string model_provider
        datetime created_at
        datetime updated_at
    }

    MESSAGES {
        uuid id PK
        uuid session_id FK
        string role
        text content
        json citations
        json artifacts
        string model_used
        int latency_ms
        datetime created_at
    }

    ARTIFACTS {
        uuid id PK
        uuid session_id FK
        string title
        string type
        string language
        text content
        datetime created_at
    }
```

---

## 3. Grounded Retrieval Flow

```text
User Question
      ↓
Query Tokenization & Normalization
      ↓
Out-of-Domain Guardrail Check
      ↓ (Passed)
BM25 Inverted Index Search + Entity Boost (+25.0 guest match)
      ↓
Top-k Ranked Evidence Chunks (k = 4)
      ↓
Context Assembly with Audio Timestamps & Canonical URLs
      ↓
Model Provider Synthesis
      ↓
Persisted Message + Citation Objects + Live Split View
```
