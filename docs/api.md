# OpenAPI & REST Endpoint Reference
## Project: The Lenny Growth Assistant
**Base URL:** `http://localhost:8000/api`  
**Interactive Swagger Docs:** `http://localhost:8000/docs`

---

## 1. Endpoints Summary Table

| Method | Path | Description | Request Body | Response Model |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | System health, database connection, transcript count | None | `HealthStatus` |
| `GET` | `/models` | List all AI model providers and readiness status | None | `Dict[str, Any]` |
| `POST` | `/models/set` | Dynamically set the active AI model | `{"provider": "ollama"}` | `{"message": str, "active": str}` |
| `GET` | `/topics` | List curated growth and product topics | None | `List[TopicSummary]` |
| `GET` | `/topics/{id}` | Get topic details, key frameworks, and sample quotes | None | `TopicDetail` |
| `GET` | `/sources` | Search and list podcast episodes and chunk counts | `?query=...` | `List[EpisodeSummary]` |
| `GET` | `/sources/{id}` | Get episode metadata and all transcript chunks | None | `EpisodeDetail` |
| `GET` | `/sessions` | List all chat sessions ordered by recency | None | `List[SessionSummary]` |
| `POST` | `/sessions` | Create a new session | `{"title": str, "model_provider": str}` | `SessionSummary` |
| `GET` | `/sessions/{id}` | Get session details, messages, citations, and artifacts | None | `SessionDetail` |
| `DELETE` | `/sessions/{id}` | Delete a session and its associated messages/artifacts | None | `{"message": str}` |
| `DELETE` | `/sessions/clear_all` | Clear all historical sessions and messages | None | `{"message": str}` |
| `POST` | `/chat` (or `/ask`) | Execute chat query with RAG grounding and artifact synthesis | `ChatRequest` | `ChatResponse` |
| `POST` | `/writing/ship30` | Dedicated Ship 30 for 30 essay generation endpoint | `WritingRequest` | `WritingResponse` |
| `GET` | `/artifacts` | List all generated and saved artifacts | None | `List[ArtifactSchema]` |
| `POST` | `/artifacts` | Create and save a custom artifact | `ArtifactCreateRequest` | `ArtifactSchema` |
| `GET` | `/artifacts/{id}` | Get single artifact by UUID | None | `ArtifactSchema` |
| `DELETE` | `/artifacts/{id}` | Delete an artifact by UUID | None | `{"message": str}` |

---

## 2. Request & Response Payload Examples

### 2.1 Chat / Q&A (`POST /api/chat`)
**Request:**
```json
{
  "message": "What does Gustaf Alströmer say about product-market fit?",
  "session_id": "8f8b0307-f273-455b-a78b-9fa1070e1762",
  "model": "ollama"
}
```

**Response:**
```json
{
  "message_id": "c1f7a6a4-...",
  "session_id": "8f8b0307-...",
  "role": "assistant",
  "content": "### Lenny's perspective\n\nGustaf Alströmer emphasizes that Product-Market Fit is primarily indicated by a flattening cohort retention curve...",
  "citations": [
    {
      "id": "ep_04_chunk_1",
      "guest": "Gustaf Alströmer",
      "episode_title": "How to Measure Product-Market Fit",
      "timestamp": "08:45",
      "source_url": "https://www.lennyspodcast.com/gustaf-alstromer-on-pmf/",
      "quote": "If your retention curve does not flatten out, you do not have product-market fit...",
      "relevance_score": 38.45
    }
  ],
  "artifacts": [],
  "model_used": "ollama",
  "latency_ms": 842
}
```

---

### 2.2 Writing Studio (`POST /api/writing/ship30`)
**Request:**
```json
{
  "topic": "B2B Product-Led Growth & Viral Loops",
  "target_words": 1250,
  "style": "ship30",
  "guest_focus": "Elena Verna"
}
```
