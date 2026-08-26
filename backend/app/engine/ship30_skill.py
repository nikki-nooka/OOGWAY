from typing import List, Dict, Any

class Ship30Skill:
    """
    Dedicated Ship 30 for 30 essay generation skill.
    
    Writing Principles & Framework Encoded:
    1. The 1-3-1 Hook Structure:
       - 1 killer opening line (pattern interrupt or provocative question)
       - 3 short context sentences building tension
       - 1 thesis promise line stating the payoff
    2. Atomic Framework Progression:
       - 3-5 distinct, modular sub-frameworks/pillars
       - Skimmable H2 and H3 headlines
       - 'Tell them what you are going to tell them, give the principle, provide the proof/quote, then give the tactical execution step'
    3. Formatting Density:
       - Bullet points for tactical advice
       - Selective **bolding** of key mental models
       - No walls of text (max 2-3 sentences per paragraph)
    4. Grounded Citations:
       - Explicit integration of Lenny's Podcast insights with speaker names & timestamps
    5. Actionable One-Sentence Takeaway & Implementation Checklist.
    """

    SYSTEM_PROMPT = """You are a master digital writer and growth strategist specialized in the 'Ship 30 for 30' atomic writing methodology.
Your mission is to transform raw knowledge from Lenny's Podcast transcripts into a world-class, viral, highly actionable ~1,250-word essay.

Strict Formatting & Structure Rules:
1. TITLE: Create a Magnetic Headline with a clear number and outcome (e.g. 'The 4-Step Product-Market Fit Engine: How Elite PMs Validate Ideas in 48 Hours').
2. HOOK (1-3-1 Cadence):
   - Line 1: Provocative truth or contrarian insight.
   - Lines 2-4: Why most founders and PMs get this completely wrong and suffer.
   - Line 5: The exact promise and mental model covered in this essay.
3. 3 to 4 MODULAR PILLARS (H2 Subheadings):
   - For each pillar, use bold emphasis, punchy bullets, and a direct quote/framework from Lenny's Podcast guests (e.g., Shreyas Doshi, Brian Chesky, Elena Verna, Rahul Vohra, Gibson Biddle).
4. TACTICAL PLAYBOOK / IMPLEMENTATION PROTOCOL:
   - A step-by-step numbered checklist of what to do on Monday morning.
5. THE 1-SENTENCE GOLDEN TAKEAWAY:
   - A memorable, quotable summary insight.
6. SOURCE CITATIONS:
   - Explicit references to the exact episode, guest, and timestamp.

Target length: Approximately 1,200 to 1,300 words. Maintain crisp rhythm, zero fluff, and high informational density."""

    @classmethod
    def build_prompt(cls, topic: str, context_str: str) -> str:
        return f"""Write a comprehensive Ship 30 for 30-style essay (~1,250 words) on the following topic:

TOPIC:
{topic}

GROUNDED TRANSCRIPT KNOWLEDGE BASE:
{context_str}

Remember to follow the Ship 30 for 30 writing formula: Strong 1-3-1 hook, skimmable subheadings, bulleted actionable takeaways, selective bolding, and strict factual grounding in the transcript sources above."""

ship30_skill = Ship30Skill()
