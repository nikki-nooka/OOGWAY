# Knowledge Pipeline & Grounded RAG Architecture
## Project: The Lenny Growth Assistant
**Document Version:** 1.0.0

---

## 1. Grounded Knowledge Pipeline Overview

The RAG pipeline ingests and indexes transcripts from **279 full episodes of Lenny's Podcast** (4,380+ chunks), preserving exact speaker names, episode titles, audio timestamps, and canonical URLs.

```mermaid
graph TD
    Transcripts["Official Transcript JSONs<br/>(279 Episodes / 4,380+ Chunks)"] --> Ingestion["RAGEngine Ingestion & Cleaning"]
    Ingestion --> Tokenizer["Meaningful Token Extraction & Stopword Filter"]
    Tokenizer --> InvertedIndex["BM25 Inverted Index<br/>(k1 = 1.5, b = 0.75)"]
    
    UserQuery["User Query"] --> Guardrail{"Out-of-Domain Guardrail?"}
    Guardrail -->|Yes (e.g. Mars, Cricket)| Refusal["Explicit Knowledge Refusal (0 Citations)"]
    Guardrail -->|No| BM25["BM25 Ranking + Entity Boost"]
    
    BM25 --> TopK["Top-k Chunks (k = 4 to 6)"]
    TopK --> PromptContext["Context Injection with Audio Timestamps"]
    PromptContext --> LLM["LLM Provider (Ollama / Cloud / Fallback)"]
    LLM --> FormattedResponse["Editorial Perspective + Grounded Citations"]
```

---

## 2. Tokenization & BM25 Scoring Formula

The retrieval engine computes BM25 relevance scores over the document corpus:

$$\text{Score}(D, Q) = \sum_{i=1}^{N} \text{IDF}(q_i) \cdot \frac{f(q_i, D) \cdot (k_1 + 1)}{f(q_i, D) + k_1 \cdot \left(1 - b + b \cdot \frac{|D|}{\text{avgdl}}\right)}$$

Where:
- $k_1 = 1.5$: Term frequency saturation parameter.
- $b = 0.75$: Document length normalization parameter.
- $\text{IDF}(q_i) = \ln\left(1 + \frac{N - n(q_i) + 0.5}{n(q_i) + 0.5}\right)$.

### Entity Boosting
If an exact guest name (e.g. `"Elena Verna"`, `"Shreyas Doshi"`, `"Brian Chesky"`, `"Gustaf Alströmer"`, `"Rahul Vohra"`) appears in the query, a **+25.0 score boost** is applied to prioritize chunks spoken by that specific guest.

---

## 3. Out-of-Domain Guardrail & Hallucination Prevention
To prevent hallucinations on unsupported topics (such as infrastructure DevOps, sports, astrophysics, cooking), queries matching explicit non-PM regex patterns or failing meaningful token similarity are intercepted immediately. The system responds with an explicit boundary notice and **zero fake citations**.
