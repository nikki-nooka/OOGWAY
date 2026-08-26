import re
import uuid
from typing import List, Dict, Any, Optional
from app.core.security import ArtifactSecurityPolicy

class ArtifactItem:
    def __init__(self, title: str, artifact_type: str, content: str, meta: Optional[Dict[str, Any]] = None):
        self.id = str(uuid.uuid4())
        self.title = title
        self.artifact_type = artifact_type.lower()
        self.content = content
        self.meta = meta or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "artifact_type": self.artifact_type,
            "content": self.content,
            "meta": self.meta
        }

class ArtifactEngine:
    """
    Extracts, structures, and sanitizes artifacts from LLM outputs.
    Supports HTML/CSS applications, Markdown documents, and UI dashboards.
    """

    HTML_BLOCK_REGEX = re.compile(r"```(?:html|htm)\s*\n(.*?)```", re.DOTALL | re.IGNORECASE)
    MARKDOWN_BLOCK_REGEX = re.compile(r"```(?:markdown|md)\s*\n(.*?)```", re.DOTALL | re.IGNORECASE)

    @classmethod
    def extract_artifacts(cls, text: str, user_query: str = "") -> List[Dict[str, Any]]:
        artifacts = []

        # 1. Search for HTML blocks
        html_matches = cls.HTML_BLOCK_REGEX.findall(text)
        for i, raw_html in enumerate(html_matches, 1):
            sanitized = ArtifactSecurityPolicy.sanitize_html(raw_html)
            # Infer title from query or html title tag
            title_match = re.search(r"<title>(.*?)</title>", raw_html, re.IGNORECASE)
            title = title_match.group(1) if title_match else f"Interactive Growth Artifact {i}"
            if "calculator" in user_query.lower():
                title = "Interactive PMF & Growth Calculator"
            elif "dashboard" in user_query.lower():
                title = "PM Strategy & Metrics Dashboard"
            elif "matrix" in user_query.lower() or "lno" in user_query.lower():
                title = "LNO Task Prioritization Canvas"

            art = ArtifactItem(
                title=title,
                artifact_type="html",
                content=sanitized["html"],
                meta={
                    "is_safe": sanitized["is_safe"],
                    "warnings": sanitized["warnings"],
                    "sandbox": sanitized["sandbox_attributes"]
                }
            )
            artifacts.append(art.to_dict())

        # 2. Search for explicit Markdown blocks if requested as an artifact
        if "artifact" in user_query.lower() or "document" in user_query.lower() or "template" in user_query.lower():
            md_matches = cls.MARKDOWN_BLOCK_REGEX.findall(text)
            for j, raw_md in enumerate(md_matches, 1):
                first_line = raw_md.strip().split("\n")[0].replace("#", "").strip()
                title = first_line if first_line else f"Strategic Growth Document {j}"
                art = ArtifactItem(
                    title=title,
                    artifact_type="markdown",
                    content=raw_md,
                    meta={"word_count": len(raw_md.split())}
                )
                artifacts.append(art.to_dict())

        return artifacts

artifact_engine = ArtifactEngine()
