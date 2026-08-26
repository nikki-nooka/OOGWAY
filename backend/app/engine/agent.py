import time
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.engine.rag import rag_engine, CitationItem
from app.engine.llm_provider import LLMFactory
from app.engine.ship30_skill import ship30_skill
from app.engine.artifact_engine import artifact_engine
from app.engine.greeting_handler import GreetingHandler
from app.db.models import MessageModel, ArtifactModel, SessionModel

logger = logging.getLogger("lenny.agent")

class AgentOrchestrator:
    """
    Main Agent Orchestrator for The Lenny Growth Assistant.
    Coordinates Grounded RAG, Ship 30 for 30 generation, Artifacts, and Out-of-Domain Detection.
    """

    BASE_SYSTEM_PROMPT = """You are 'The Lenny Growth Assistant', an elite, grounded product and growth intelligence system built on transcripts from Lenny's Podcast.

CORE OPERATING DIRECTIVES:
1. STRICT GROUNDING: Answer questions strictly based on the provided Lenny's Podcast transcripts.
2. CITATIONS: Always cite the specific guest, episode title, and timestamp when stating frameworks or claims.
3. HANDLING UNCERTAINTY: If the transcripts do not contain enough facts to answer accurately, explicitly state that the topic is not covered in Lenny's Podcast knowledge base. Do not hallucinate.
4. ARTIFACTS: When the user requests an interactive calculator, dashboard, matrix, or visual component, produce a clean, self-contained HTML/CSS/JS block inside ```html ``` code fences."""

    async def execute_chat(
        self,
        db: AsyncSession,
        session_id: str,
        user_message: str,
        model_override: Optional[str] = None
    ) -> Dict[str, Any]:
        start_time = time.time()

        # 1. Handle simple greetings naturally
        if GreetingHandler.is_greeting(user_message):
            greeting_text = GreetingHandler.get_greeting_response()
            latency_ms = int((time.time() - start_time) * 1000)

            user_msg_record = MessageModel(session_id=session_id, role="user", content=user_message)
            db.add(user_msg_record)

            assistant_msg_record = MessageModel(
                session_id=session_id,
                role="assistant",
                content=greeting_text,
                citations=[],
                artifacts=[],
                model_used="lenny_growth_copilot",
                latency_ms=latency_ms
            )
            db.add(assistant_msg_record)
            await db.commit()

            return {
                "message_id": assistant_msg_record.id,
                "session_id": session_id,
                "role": "assistant",
                "content": greeting_text,
                "citations": [],
                "artifacts": [],
                "model_used": "lenny_growth_copilot",
                "latency_ms": latency_ms
            }

        # 2. Classify intent
        msg_lower = user_message.lower()
        is_ship30 = "ship 30" in msg_lower or "atomic essay" in msg_lower or "ship30" in msg_lower
        is_artifact_request = any(k in msg_lower for k in ["calculator", "dashboard", "matrix", "tool", "interactive", "html", "artifact", "canvas"])

        # 3. Retrieve grounded knowledge from 4,380+ chunks
        search_results = rag_engine.search(user_message, top_k=4)

        # 4. Out-of-Domain Guardrail: If no transcript chunks match the query with high confidence
        if not search_results and not is_artifact_request and not is_ship30:
            out_of_domain_text = f"""Based on the **4,380+ transcript chunks across 279 episodes** of *Lenny's Podcast*, your query — **"{user_message}"** — is an **out-of-domain topic** (e.g., infrastructure, DevOps, low-level server configuration, or unrelated fields) that is not covered in Lenny's podcast interviews.

---

### 🎙️ What This Knowledge Base Covers:
*Lenny's Podcast* is the definitive repository for:
- **Product Management & Craft:** Shreyas Doshi (LNO framework), Brian Chesky (11-Star Experience), Gibson Biddle (DHM Model).
- **Growth & PMF Metrics:** Gustaf Alströmer (Retention floors), Rahul Vohra (Sean Ellis 40% PMF benchmark), Nikita Bier (Viral consumer loops).
- **B2B Strategy & PLG:** Elena Verna (B2B viral loops), April Dunford (Positioning & competitive sales).
- **Pricing & Monetization:** Patrick Campbell, Casey Winters.

👉 *Try asking about a Product Management, Growth, Pricing, or Strategy question from any of the 279 podcast guests!*"""

            latency_ms = int((time.time() - start_time) * 1000)
            user_msg_record = MessageModel(session_id=session_id, role="user", content=user_message)
            db.add(user_msg_record)

            assistant_msg_record = MessageModel(
                session_id=session_id,
                role="assistant",
                content=out_of_domain_text,
                citations=[],
                artifacts=[],
                model_used="lenny_grounding_guardrail",
                latency_ms=latency_ms
            )
            db.add(assistant_msg_record)
            await db.commit()

            return {
                "message_id": assistant_msg_record.id,
                "session_id": session_id,
                "role": "assistant",
                "content": out_of_domain_text,
                "citations": [],
                "artifacts": [],
                "model_used": "lenny_grounding_guardrail",
                "latency_ms": latency_ms
            }

        context_str = rag_engine.format_context_for_prompt(search_results)
        citations = [res["citation"].model_dump() for res in search_results]

        # 5. Construct prompt & Execute LLM
        if is_ship30:
            system_prompt = ship30_skill.SYSTEM_PROMPT
            prompt = ship30_skill.build_prompt(user_message, context_str)
        else:
            system_prompt = self.BASE_SYSTEM_PROMPT
            artifact_instruction = "\nPlease provide a fully functional, beautiful HTML/CSS interactive artifact in ```html ``` code fences." if is_artifact_request else ""
            prompt = f"""USER QUERY:
{user_message}

GROUNDED TRANSCRIPTS KNOWLEDGE BASE:
{context_str}
{artifact_instruction}

Please provide a structured, grounded response citing relevant guests and timestamps."""

        provider = LLMFactory.get_provider(model_override)
        llm_response = await provider.generate(prompt, system_prompt)
        raw_text = llm_response["content"]
        provider_name = llm_response.get("provider", "unknown")

        # Dynamic synthesis for offline fallback using real matched chunks
        if llm_response.get("is_fallback") and not is_ship30 and not is_artifact_request and search_results:
            dynamic_points = []
            for i, res in enumerate(search_results[:3], 1):
                ch = res["chunk"]
                dynamic_points.append(
                    f"### {i}. {ch.guest} on *{ch.episode_title}*\n"
                    f"> *\"{ch.text}\"*\n"
                    f"*— Timestamp: **{ch.timestamp}** | [Watch / Listen Link]({ch.source_url})*\n"
                )

            raw_text = f"""Based on transcripts from **Lenny's Podcast**, here is the grounded insight regarding **{user_message}**:

{"\n".join(dynamic_points)}

---

### Tactical Growth Takeaway
- **Validate through Data:** Apply leading indicator metrics to measure user engagement early.
- **Listen to Power Users:** Align your roadmap directly with retained customers rather than top-of-funnel noise.

**Sources Cited:**
""" + "\n".join([f"- [{i}] *{c['guest']}* — {c['episode_title']} ({c['timestamp']})" for i, c in enumerate(citations, 1)])

        # 6. Extract and sanitize any artifacts
        extracted_artifacts = artifact_engine.extract_artifacts(raw_text, user_message)
        latency_ms = int((time.time() - start_time) * 1000)

        # 7. Persist messages and artifacts
        user_msg_record = MessageModel(session_id=session_id, role="user", content=user_message)
        db.add(user_msg_record)

        assistant_msg_record = MessageModel(
            session_id=session_id,
            role="assistant",
            content=raw_text,
            citations=citations,
            artifacts=[{"id": a["id"], "title": a["title"], "type": a["artifact_type"]} for a in extracted_artifacts],
            model_used=provider_name,
            latency_ms=latency_ms
        )
        db.add(assistant_msg_record)
        await db.flush()

        saved_artifacts = []
        for art in extracted_artifacts:
            art_record = ArtifactModel(
                session_id=session_id,
                message_id=assistant_msg_record.id,
                title=art["title"],
                artifact_type=art["artifact_type"],
                content=art["content"],
                meta=art["meta"]
            )
            db.add(art_record)
            saved_artifacts.append(art)

        await db.commit()

        return {
            "message_id": assistant_msg_record.id,
            "session_id": session_id,
            "role": "assistant",
            "content": raw_text,
            "citations": citations,
            "artifacts": saved_artifacts,
            "model_used": provider_name,
            "latency_ms": latency_ms
        }

agent_orchestrator = AgentOrchestrator()
