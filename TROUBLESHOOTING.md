# Troubleshooting & FAQ Guide
## Project: The Lenny Growth Assistant
**Document Version:** 1.0.0

---

## 1. Common Scenarios & Instant Resolutions

### 1.1 Local Ollama is Offline or Not Installed
- **Symptom:** In the Settings Modal or Header, Ollama displays `"Offline / Not Running"`.
- **Resolution:**
  1. Start the Ollama daemon on your system: `ollama serve`
  2. Ensure you have pulled the recommended model: `ollama pull llama3.2`
  3. **Zero-Setup Fallback:** If you do not have Ollama installed, simply select **"Offline Grounded Engine"** in the Model Settings. The built-in deterministic synthesizer will generate answers and Ship 30 essays using verified transcript chunks with 100% feature parity.

---

### 1.2 Cloud API Keys (Claude / OpenAI) Are Not Configured
- **Symptom:** Selecting Claude or OpenAI gives an API key error.
- **Resolution:**
  - Create a `.env` file in the `backend/` directory or root:
    ```env
    ANTHROPIC_API_KEY=sk-ant-...
    OPENAI_API_KEY=sk-...
    ```
  - Restart the backend server.

---

### 1.3 Port Conflicts on Port 8000 or Port 3000
- **Symptom:** `Error: [WinError 10048] Only one usage of each socket address is normally permitted`.
- **Resolution:**
  - Check for existing running instances of uvicorn or node:
    - On Windows: `netstat -ano | findstr :8000` then `taskkill /PID <PID> /F`
    - On macOS/Linux: `lsof -i :8000` then `kill -9 <PID>`

---

### 1.4 Windows PowerShell Script Execution Policy
- **Symptom:** `npm : File ... npm.ps1 cannot be loaded because running scripts is disabled on this system`.
- **Resolution:**
  - Run with `npm.cmd run dev` or `npm.cmd run build`, or set execution policy:
    ```powershell
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```

---

### 1.5 Database Persistence Across Restarts
- **Symptom:** Conversations reset when moving machines.
- **Resolution:**
  - The SQLite database is saved to `backend/lenny_growth.db`. Ensure this file is retained across runs to preserve all historical sessions, messages, and generated artifacts.
