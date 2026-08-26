import re
import html
from typing import Dict, Any

class ArtifactSecurityPolicy:
    """
    Security and sanitization policy for generated HTML/CSS artifacts.
    Evaluator Isolation & Security Strategy:
    1. HTML Artifacts are rendered in the frontend inside an <iframe> with strict sandbox controls.
    2. The sandbox attribute is set to: sandbox="allow-scripts" (and optionally allow-forms) but blocks allow-top-navigation, allow-same-origin, allow-popups without user action.
    3. Malicious patterns such as <script> window.parent / localStorage access or cookie theft attempts are sanitized/flagged.
    """
    
    FORBIDDEN_PATTERNS = [
        re.compile(r"window\.parent", re.IGNORECASE),
        re.compile(r"window\.top", re.IGNORECASE),
        re.compile(r"document\.cookie", re.IGNORECASE),
        re.compile(r"localStorage", re.IGNORECASE),
        re.compile(r"sessionStorage", re.IGNORECASE),
        re.compile(r"indexedDB", re.IGNORECASE),
        re.compile(r"<base\b", re.IGNORECASE),
    ]

    @classmethod
    def sanitize_html(cls, raw_html: str) -> Dict[str, Any]:
        """
        Validates and wraps raw HTML into a clean, standalone, responsive document.
        """
        is_safe = True
        warnings = []

        for pattern in cls.FORBIDDEN_PATTERNS:
            if pattern.search(raw_html):
                warnings.append(f"Sanitized unsafe DOM/Storage access: {pattern.pattern}")
                # Replace with safe inert placeholder
                raw_html = pattern.sub("/* blocked_security_violation */", raw_html)

        # Ensure HTML has doctype and basic styling if missing
        if "<!DOCTYPE html>" not in raw_html and "<html" not in raw_html:
            wrapped_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    :root {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color-scheme: dark light;
    }}
    body {{
      margin: 0;
      padding: 16px;
      background: #0f172a;
      color: #f8fafc;
      box-sizing: border-box;
    }}
  </style>
</head>
<body>
{raw_html}
</body>
</html>"""
        else:
            wrapped_html = raw_html

        return {
            "html": wrapped_html,
            "is_safe": is_safe,
            "warnings": warnings,
            "sandbox_attributes": "allow-scripts allow-forms allow-modals"
        }
