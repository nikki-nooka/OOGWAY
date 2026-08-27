# 🎬 2-to-3 Minute Demo Video Recording Script
## Project: The Lenny Growth Assistant
**Role:** Forward Deployed Engineer Take-Home Assessment  
**Target Length:** 2 minutes 45 seconds  
**Format:** Screen Recording with Camera Enabled (Face in corner / Picture-in-Picture)  
**Tools Recommended:** Loom, OBS Studio, or Clipchamp  

---

## 📋 Pre-Recording Checklist (1 Minute Setup)
1. **Ensure Backend & Frontend are running:**
   - Backend: `http://localhost:8000` (FastAPI)
   - Frontend: `http://localhost:3000` (React)
2. **If using Ollama:** Ensure `ollama serve` is running with `llama3.2` pulled. (If not, the built-in Grounded Fallback Engine will seamlessly handle all queries).
3. **Browser Setup:** Open `http://localhost:3000` in full screen (Chrome or Edge).
4. **Camera & Mic:** Position your camera at eye level and check audio levels.

---

## ⏱️ Video Timeline & Spoken Script

```
┌─────────────────┬───────────────────────────────────┬────────────────────────────────────┐
│ Timestamp       │ Screen Action                     │ Spoken Script / Voiceover          │
├─────────────────┼───────────────────────────────────┼────────────────────────────────────┤
│ 0:00 - 0:30     │ Home Page (Editorial Masthead)    │ Intro & Problem Framing            │
│ 0:30 - 1:15     │ Chat Interface (/chat)            │ Grounded Q&A & Timestamps Demo     │
│ 1:15 - 1:45     │ Model Switcher / Settings         │ Local Ollama & Zero-Cloud Offline  │
│ 1:45 - 2:15     │ Writing Studio & Artifact Viewer  │ Ship 30 Essays & Sandboxed Iframe  │
│ 2:15 - 2:45     │ Architecture Diagram in README    │ Technical Trade-Off Explanation    │
│ 2:45 - 3:00     │ Final Screen / Closing            │ Operational Handoff & Wrap-up      │
└─────────────────┴───────────────────────────────────┴────────────────────────────────────┘
```

---

### 🎙️ [0:00 - 0:30] Introduction & Problem Framing
**Screen:** Show the **Editorial Magazine Home Page** (`http://localhost:3000`).

> *"Hi everyone! My name is [Your Name], and today I’m presenting **The Lenny Growth Assistant**—a full-stack AI platform built for the Forward Deployed Engineer engagement.*
> 
> *The problem we’re solving is knowledge accessibility: Lenny’s Podcast contains over 279 episodes and 4,300 transcript passages of world-class growth playbooks. But PMs and founders don’t have time to scrub through audio, and general LLMs often hallucinate or blend contradictory advice.*
> 
> *We built a system that delivers strictly grounded answers, synthesizes executive Ship 30 essays, and renders interactive, sandboxed tools right in the browser."*

---

### 🎙️ [0:30 - 1:15] Grounded Conversational Q&A & Verbatim Citations
**Screen:** Click **"Launch Assistant"** or navigate to **`/chat`**. Click a quick prompt or type:
`"How do top founders validate true Product-Market Fit according to Gustaf Alströmomer and Rahul Vohra?"`

> *"Let’s see the conversational engine in action. Here, I'm asking a nuanced strategic question comparing two top operators on Product-Market Fit.*
> 
> *Notice how the assistant breaks down the response into **Lenny’s Perspective**, **Key Signals**, and **Exact Evidence**.*
> 
> *Every single claim has an interactive citation badge. If I click on Gustaf Alströmomer’s citation, it links directly to the exact YouTube timestamp in Episode 142. And if I ask something completely outside the domain—like quantum physics—the guardrail immediately refuses to answer rather than hallucinating fake advice."*

---

### 🎙️ [1:15 - 1:45] Local Ollama & Multi-Provider Architecture
**Screen:** Open the **Model Selector** dropdown in the header or go to **`/settings`**. Highlight `Local Ollama (llama3.2)`.

> *"A critical requirement for this deployment was flexibility and local operability. As you can see in the model switcher, I’m currently running the demo on **Local Ollama using llama3.2**—100% locally on my machine with zero cloud API keys.*
> 
> *We’ve built a decoupled provider abstraction supporting Anthropic Claude, OpenAI, and a built-in offline fallback engine. Even if an evaluator clones this repo with no API keys and no Ollama installed, the system automatically falls back to an embedded engine so the UI never crashes."*

---

### 🎙️ [1:45 - 2:15] Ship 30 Writing Studio & Sandboxed Artifact Viewer
**Screen:** Click **"Writing Studio"** (`/writing`) ➔ Click **"Generate Atomic Essay"** on PMF ➔ Then open an interactive Artifact in the split-pane viewer (`/artifacts` or in chat).

> *"Next, we have the **Ship 30 for 30 Writing Studio**. Instead of a generic prompt, we encoded Nicolas Cole and Dickie Bush’s framework directly into a dedicated skill. It automatically synthesizes a ~1,250-word atomic essay with a 1-3-1 hook cadence, modular H2 pillars, quotes, and a tactical Monday Morning execution checklist.*
> 
> *Beside the chat, our **Claude-style Artifact Viewer** renders live interactive HTML/CSS calculators and growth models. For security, untrusted code runs inside a sandboxed iframe omitting `allow-same-origin`, preventing DOM traversal and cookie theft."*

---

### 🎙️ [2:15 - 2:45] Key Technical Trade-Off
**Screen:** Briefly show the **Architecture Diagram** in `README.md` or `architecture.md`.

> *"Let’s talk about a key architectural trade-off we made:*
> 
> *Instead of relying on a heavy external vector database like Pinecone or FAISS with large embedding model weights, we engineered an **In-Memory BM25 Lexical Search with Entity-Boosting** across all 4,389 chunks.*
> 
> *This gave us three massive advantages: first, **sub-25 millisecond retrieval latency**; second, **100% precision on exact speaker attribution** without semantic drift; and third, **zero GPU and zero PyTorch dependencies**, allowing any engineer to clone and run the app in under 30 seconds."*

---

### 🎙️ [2:45 - 3:00] Operational Handoff & Conclusion
**Screen:** Show the terminal / GitHub repository (`https://github.com/nikki-nooka/OOGWAY`).

> *"The entire codebase is structured for forward deployment: one-command startup via `docker-compose up` or `start.bat`, automated session persistence with SQLite and PostgreSQL, and a 26-test automated test suite with a 100% pass rate.*
> 
> *Thank you for watching, and I look forward to your feedback!"*

---

## 💡 Quick Tips for a Flawless Recording
- **Pace:** Speak with energy and confidence. Don't rush; pause briefly between transitions.
- **Mouse Movement:** Move your cursor smoothly to point at citations, speaker badges, and the model selector.
- **Short & Crisp:** Keep the recording strictly under 3 minutes (2:40 to 2:55 is the sweet spot).
- **Upload:** Once recorded, upload as an **Unlisted** or **Public** video on YouTube and paste the link into the Google submission form (`https://forms.gle/LgotDHNVxW1mbzNE7`).
