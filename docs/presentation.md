# The Lenny Growth Assistant — Presentation Deck
## Slide-by-Slide Executive Script & Outline (Section 50)

---

### Slide 1: The Lenny Growth Assistant
- **Title:** The Lenny Growth Assistant
- **Tagline:** Think Better. Ship Better.
- **Summary:** An AI-powered product and growth intelligence workspace transforming Lenny’s podcast and newsletter knowledge into a digital magazine, conversational research assistant, and executive writing engine.

---

### Slide 2: The Problem
- **Headline:** Scattered Knowledge vs. Actionable Execution
- **Pain Points:** Hundreds of hours of unindexed audio; generic LLMs hallucinating false PM metrics; static chat bubbles unable to render live tools; hours spent converting notes into essays.

---

### Slide 3: The Solution
- **Headline:** Editorial Intelligence + Grounded AI Workspace
- **Pillars:** Digital magazine exploration + strictly grounded conversational intelligence + Ship 30 for 30 writing studio + sandboxed interactive artifact generation.

---

### Slide 4: Product Experience
- **Workflow:** Discover ➔ Ask ➔ Evidence ➔ Create ➔ Ship.

---

### Slide 5: Design Direction
- **Headline:** Warm Editorial Intelligence
- **Tokens:** Warm Cream (`#F5F2EA`), Saddle Brown (`#9A5B2E`), Forest Green (`#245D55`), DM Serif Display & Playfair typography, Inter UI, 1px crisp borders, responsive dual-theme support.

---

### Slide 6: Information Architecture
- **Tree:** Complete navigation covering Home, Explore Magazine, Topic Deep Dives, Conversational Assistant, Writing Studio, Artifact Library, Slide Deck, and Source Index.

---

### Slide 7: Real-World User Journey
- **Scenario:** Startup PM struggling with activation ➔ retrieves grounded insights from Elena Verna & Shreyas Doshi ➔ transforms research into a ~1,250-word Ship 30 essay ➔ generates an interactive sandboxed onboarding calculator.

---

### Slide 8: System Architecture
- **Stack:** FastAPI backend, BM25 RAG engine (4,380+ chunks / 279 episodes), multi-provider LLM abstraction (Ollama/Claude/OpenAI/Fallback), dual-engine PostgreSQL & SQLite persistence, React 18 + Vite SPA.

---

### Slide 9: Grounding & Traceability
- **Integrity:** Verbatim transcript citations with audio timestamps; immediate refusal and zero fake citations for out-of-domain queries.

---

### Slide 10: Dedicated Agent Skills
- **Modularity:** Separation of concerns between Grounded Q&A, Ship 30 for 30 Writing Engine, and Interactive Artifact Generation.

---

### Slide 11: Artifact Security & Isolation
- **Defense-in-Depth:** Backend regex sanitization (`ArtifactSecurityPolicy`) + frontend iframe isolation without `allow-same-origin` + Safe Preview security badge.

---

### Slide 12: Model Flexibility
- **Portability:** Seamless real-time switching between local Ollama (`llama3.2`), Anthropic Claude 3.5 Sonnet, OpenAI GPT-4o, and built-in offline engine.

---

### Slide 13: Security, Failure Handling & Observability
- **Robustness:** 10 automated test suites with 100% pass rate; latency and chunk observability; graceful offline failovers.

---

### Slide 14: Why This Product Matters
- **North Star:** Transforming product knowledge into understanding and concrete, shippable action.
