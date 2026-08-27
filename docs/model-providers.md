# AI Model Providers & Abstraction Layer
## Project: The Lenny Growth Assistant
**Document Version:** 1.0.0

---

## 1. Multi-Provider Abstraction Architecture

The application is built upon a uniform `BaseModelProvider` interface:

```mermaid
graph TD
    Factory["LLMFactory (Unified Interface)"]
    Factory --> Ollama["OllamaProvider (Local localhost:11434)"]
    Factory --> Claude["ClaudeProvider (Anthropic API)"]
    Factory --> OpenAI["OpenAIProvider (OpenAI API)"]
    Factory --> Mock["MockGroundedProvider (Deterministic Fallback)"]
```

---

## 2. Supported Providers

### 2.1 Local Ollama (Mandatory Demo Layer)
- **Endpoint:** `http://localhost:11434`
- **Supported Models:** `llama3.2`, `llama3.1`, `mistral`, `qwen2.5`
- **Zero Cloud Leakage:** All inference runs on the evaluator's local hardware.

### 2.2 Anthropic Claude 3.5 Sonnet
- **Model:** `claude-3-5-sonnet-20241022`
- **Configuration:** Set `ANTHROPIC_API_KEY` in environment.

### 2.3 OpenAI GPT-4o
- **Model:** `gpt-4o`
- **Configuration:** Set `OPENAI_API_KEY` in environment.

### 2.4 Built-in Offline Grounded Engine
- **Purpose:** Enables zero-setup, instant evaluation even if Ollama is not running and cloud API keys are absent.
- **Behavior:** Synthesizes structured grounded answers directly from matched transcript chunks with 100% citation coverage.
