import os
import json
import re
import math
from pathlib import Path
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.core.config import settings

# Common english conversational stopwords & generic podcast filler words
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can",
    "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
    "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
    "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
    "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
    "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor",
    "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
    "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
    "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
    "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to",
    "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
    "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
    "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've",
    "your", "yours", "yourself", "yourselves", "tell", "give", "explain", "describe", "show", "know", "think",
    "issue", "problem", "solve", "way", "help", "need", "like", "good", "make", "get", "according", "say", "says",
    "lenny", "rachitsky", "podcast", "episode", "interviews", "talk", "talks", "content"
}

# Out-of-scope non-PM/Growth domain indicators that must trigger explicit guardrail
OUT_OF_DOMAIN_PATTERNS = [
    r"\b(?:cricket|football|soccer|nba|nfl|baseball|ipl|world cup|olympics)\b",
    r"\b(?:mars colonization|rocket propulsion|space exploration|astronomy|black hole|astrophysics)\b",
    r"\b(?:quantum physics|nuclear physics|relativity|thermodynamics)\b",
    r"\b(?:recipe|cooking|baking|cuisine|diet plan)\b",
    r"\b(?:docker|kubernetes|linux kernel|proximity issue|device driver)\b"
]

class TranscriptChunk(BaseModel):
    id: str
    episode_id: str
    episode_title: str
    guest: str
    guest_bio: str = ""
    source_url: str = ""
    topic: str = ""
    timestamp: str = ""
    text: str

class CitationItem(BaseModel):
    id: str
    episode_title: str
    guest: str
    timestamp: str
    source_url: str
    quote: str
    relevance_score: float = 0.0

class RAGEngine:
    def __init__(self, transcripts_dir: Optional[Path] = None):
        self.transcripts_dir = transcripts_dir or settings.TRANSCRIPTS_DIR
        self.chunks: List[TranscriptChunk] = []
        self.doc_freq: Dict[str, int] = {}
        self.avg_doc_len: float = 0.0
        self.total_docs: int = 0
        self.load_and_index()

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r"\b[a-zA-Z0-9_\-']+\b", text) if len(w) > 1]

    def _get_meaningful_tokens(self, text: str) -> List[str]:
        tokens = self._tokenize(text)
        return [t for t in tokens if t not in STOPWORDS and len(t) > 2]

    def is_explicit_out_of_domain(self, query: str) -> bool:
        q_lower = query.lower()
        for pat in OUT_OF_DOMAIN_PATTERNS:
            if re.search(pat, q_lower):
                return True
        return False

    def load_and_index(self):
        """Loads all JSON transcripts from the transcripts directory and builds the BM25 index."""
        self.chunks = []
        if not self.transcripts_dir.exists():
            os.makedirs(self.transcripts_dir, exist_ok=True)

        for file_path in self.transcripts_dir.glob("*.json"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        for item in data:
                            chunk = TranscriptChunk(**item)
                            self.chunks.append(chunk)
            except Exception as e:
                print(f"Error loading transcript {file_path}: {e}")

        # Indexing for BM25
        self.total_docs = len(self.chunks)
        self.doc_freq = {}
        total_len = 0

        for chunk in self.chunks:
            tokens = set(self._tokenize(chunk.text + " " + chunk.topic + " " + chunk.guest + " " + chunk.episode_title))
            total_len += len(self._tokenize(chunk.text))
            for token in tokens:
                self.doc_freq[token] = self.doc_freq.get(token, 0) + 1

        self.avg_doc_len = (total_len / self.total_docs) if self.total_docs > 0 else 1.0

    def search(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Performs high-precision BM25 ranking with explicit out-of-domain rejection.
        """
        if not self.chunks:
            return []

        # 1. Immediate guardrail for non-PM domains (e.g. cricket, mars, docker)
        if self.is_explicit_out_of_domain(query):
            return []

        meaningful_tokens = self._get_meaningful_tokens(query)
        if not meaningful_tokens:
            all_tokens = self._tokenize(query)
            if not all_tokens:
                return []
            meaningful_tokens = [t for t in all_tokens if t not in ["the", "a", "an", "is", "in", "to"]]

        query_lower = query.lower()
        scores: List[tuple[TranscriptChunk, float]] = []
        k1 = 1.5
        b = 0.75

        for chunk in self.chunks:
            doc_text = f"{chunk.text} {chunk.topic} {chunk.guest} {chunk.episode_title}"
            doc_tokens = self._tokenize(doc_text)
            doc_len = len(doc_tokens)
            doc_token_counts = {}
            for t in doc_tokens:
                doc_token_counts[t] = doc_token_counts.get(t, 0) + 1

            score = 0.0
            matched_meaningful = 0

            for token in meaningful_tokens:
                if token in doc_token_counts:
                    tf = doc_token_counts[token]
                    df = self.doc_freq.get(token, 1)
                    idf = math.log(1 + (self.total_docs - df + 0.5) / (df + 0.5))
                    numerator = tf * (k1 + 1)
                    denominator = tf + k1 * (1 - b + b * (doc_len / self.avg_doc_len))
                    score += idf * (numerator / denominator)
                    matched_meaningful += 1

            # Exact guest name match bonus
            if chunk.guest.lower() in query_lower:
                score += 25.0
            
            # Boost for exact keywords in title or topics
            for word in meaningful_tokens:
                if word in chunk.guest.lower():
                    score += 8.0
                if word in chunk.episode_title.lower():
                    score += 5.0

            if score > 2.5 and matched_meaningful > 0:
                scores.append((chunk, score))

        scores.sort(key=lambda x: x[1], reverse=True)

        if not scores or scores[0][1] < 3.0:
            return []

        results = []
        for chunk, score in scores[:top_k]:
            results.append({
                "chunk": chunk,
                "score": round(score, 3),
                "citation": CitationItem(
                    id=chunk.id,
                    episode_title=chunk.episode_title,
                    guest=chunk.guest,
                    timestamp=chunk.timestamp,
                    source_url=chunk.source_url,
                    quote=chunk.text[:220] + ("..." if len(chunk.text) > 220 else ""),
                    relevance_score=round(score, 3)
                )
            })

        return results

    def format_context_for_prompt(self, search_results: List[Dict[str, Any]]) -> str:
        if not search_results:
            return "No matching transcripts found in the knowledge base."

        formatted = []
        for i, res in enumerate(search_results, 1):
            c: TranscriptChunk = res["chunk"]
            formatted.append(
                f"[Source {i}: {c.episode_title} | Guest: {c.guest} | Timestamp: {c.timestamp}]\n"
                f"Quote: \"{c.text}\"\n"
                f"URL: {c.source_url}\n"
            )

        return "\n".join(formatted)

    def get_all_episodes(self) -> List[Dict[str, Any]]:
        episodes_map = {}
        for c in self.chunks:
            if c.episode_id not in episodes_map:
                episodes_map[c.episode_id] = {
                    "episode_id": c.episode_id,
                    "title": c.episode_title,
                    "guest": c.guest,
                    "guest_bio": c.guest_bio,
                    "source_url": c.source_url,
                    "chunks_count": 0,
                    "topics": set(),
                    "samples": []
                }
            episodes_map[c.episode_id]["chunks_count"] += 1
            for t in c.topic.split(","):
                episodes_map[c.episode_id]["topics"].add(t.strip())
            if len(episodes_map[c.episode_id]["samples"]) < 2:
                episodes_map[c.episode_id]["samples"].append({
                    "timestamp": c.timestamp,
                    "text": c.text
                })

        for ep in episodes_map.values():
            ep["topics"] = sorted(list(ep["topics"]))

        return list(episodes_map.values())

rag_engine = RAGEngine()
