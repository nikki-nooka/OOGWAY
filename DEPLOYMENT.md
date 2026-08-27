# Deployment & Operations Guide
## Project: The Lenny Growth Assistant
**Document Version:** 1.0.0

---

## 1. Zero-Friction Local Deployment

### 1.1 One-Click Windows Launcher
Double-click `start.bat` or run in terminal:
```cmd
start.bat
```
*Automatically installs Python requirements, initializes SQLite database, builds/serves the frontend on port 3000, and starts the FastAPI server on port 8000.*

### 1.2 One-Click macOS & Linux Launcher
```bash
chmod +x start.sh
./start.sh
```

---

## 2. Docker & Container Orchestration

### 2.1 Multi-Container Compose
The included `docker-compose.yml` orchestrates the entire decoupled stack:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite+aiosqlite:///./lenny_growth.db
      - DEFAULT_MODEL_PROVIDER=ollama
      - OLLAMA_BASE_URL=http://host.docker.internal:11434
    volumes:
      - ./backend/lenny_growth.db:/app/lenny_growth.db

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend
```

To run:
```bash
docker-compose up --build
```

---

## 3. Environment Variables Reference

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | `sqlite+aiosqlite:///./lenny_growth.db` | Async SQLAlchemy database connection string (PostgreSQL or SQLite). |
| `DEFAULT_MODEL_PROVIDER` | `ollama` | Default model provider (`ollama`, `claude`, `openai`, `mock`). |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Endpoint for local Ollama daemon. |
| `OLLAMA_MODEL` | `llama3.2` | Model name pulled in Ollama. |
| `ANTHROPIC_API_KEY` | *(optional)* | API key for Anthropic Claude 3.5 Sonnet. |
| `OPENAI_API_KEY` | *(optional)* | API key for OpenAI GPT-4o. |
| `CORS_ORIGINS` | `["http://localhost:3000", "http://localhost:5173"]` | Allowed CORS origins for API requests. |
