import re
from typing import List, Dict, Any

class GreetingHandler:
    GREETING_PATTERNS = [
        r"^(?:hi|hey|heii|hii|hello|howdy|greetings|hola|sup|good\s*(?:morning|afternoon|evening))\b",
        r"^who\s+are\s+you",
        r"^what\s+can\s+you\s+do",
        r"^help\b"
    ]

    @classmethod
    def is_greeting(cls, text: str) -> bool:
        clean = text.strip().lower()
        if len(clean) <= 15:
            for pat in cls.GREETING_PATTERNS:
                if re.search(pat, clean):
                    return True
        return False

    @classmethod
    def get_greeting_response(cls) -> str:
        return """Hey there! 👋 I'm **The Lenny Growth Assistant**, an AI product & strategy copilot grounded in **4,380+ transcript chunks across 279 episodes** from *Lenny's Podcast*.

### How I can help you today:
1. **Validate & Measure PMF:** Explore retention floors (Gustaf Alströmer) and the Sean Ellis 40% test (Rahul Vohra).
2. **Ship 30 for 30 Essays:** Ask me to write a structured, ~1,250-word atomic essay on any PM or growth topic.
3. **Product Leadership & Frameworks:** Learn Shreyas Doshi's LNO task matrix, Brian Chesky's 11-star experience, or Elena Verna's B2B PLG loops.
4. **Interactive Artifacts:** Ask me to build an interactive growth calculator, prioritization canvas, or PM dashboard in HTML/CSS.

What product or growth challenge are you working on?"""
