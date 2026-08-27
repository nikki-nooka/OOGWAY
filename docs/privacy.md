# Privacy & Security Policy

The Lenny Growth Assistant is engineered with privacy-by-design and rigorous sandbox boundaries to prevent data leakage, prompt injection, cross-site scripting (XSS), and unauthorized resource inspection.

---

## 1. Zero Telemetry & Private Processing

* **Local LLM First**: Supports 100% offline and local execution via Ollama (`llama3.1`, `llama3.2`). No user inputs or company metrics leave the local machine when running locally.
* **Stateless Cloud Queries**: When using Claude or OpenAI, prompts contain only the relevant transcript chunks and sanitized user queries. No long-term cloud memory or third-party training is utilized.
* **Deterministic Fallback**: In the absence of an active LLM, the system executes pure offline keyword and BM25 extraction with grounded quotes and timestamps.

---

## 2. Interactive Artifact Security Policy (`ArtifactSecurityPolicy`)

Interactive HTML/CSS/JS artifacts (such as ROI calculators, PMF diagnostic widgets, and conversion trees) are passed through strict sanitization before rendering in the Claude-style side-by-side artifact viewer:

1. **Dangerous Script & Protocol Stripping**:
   - Strips `javascript:` URLs, `data:text/html`, and inline event attributes (`onerror=`, `onload=`, `onclick=`).
   - Strips malicious frame escape patterns (`window.top`, `window.parent`, `document.cookie`).
2. **Iframe Sandboxing**:
   Rendered inside sandboxed iframes:
   ```html
   <iframe sandbox="allow-scripts allow-forms" ... />
   ```
   Prevents top-level navigation, cookie access, popups, and arbitrary browser storage manipulation.

---

## 3. Data Retention & Clearing

Users have full autonomy over their stored data:
* **Selective Session Deletion**: Remove individual conversations and associated artifacts at any time.
* **Workspace Clear All**: Instantly wipe all conversation history, messages, context profiles, and artifacts via the Settings Modal (`/api/sessions/clear_all`).
