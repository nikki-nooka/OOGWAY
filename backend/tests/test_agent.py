import pytest
from app.engine.ship30_skill import ship30_skill
from app.engine.artifact_engine import artifact_engine
from app.engine.llm_provider import LLMFactory, mock_provider

@pytest.mark.asyncio
async def test_ship30_prompt_builder():
    prompt = ship30_skill.build_prompt("Finding PMF", "Sample context from Lenny podcast")
    assert "Finding PMF" in prompt
    assert "Ship 30 for 30" in prompt

@pytest.mark.asyncio
async def test_artifact_extraction_html():
    raw_response = """Here is the calculator:
```html
<!DOCTYPE html>
<html>
<head><title>PMF Tool</title></head>
<body><h1>Hello World</h1></body>
</html>
```
Hope you like it!"""
    artifacts = artifact_engine.extract_artifacts(raw_response, "Make a calculator")
    assert len(artifacts) == 1
    assert artifacts[0]["artifact_type"] == "html"
    assert "PMF Tool" in artifacts[0]["title"] or "Calculator" in artifacts[0]["title"]
    assert "<h1>Hello World</h1>" in artifacts[0]["content"]

@pytest.mark.asyncio
async def test_model_switching():
    assert LLMFactory.get_active_provider_name() in ["ollama", "claude", "openai", "mock"]
    LLMFactory.set_active_provider("claude")
    assert LLMFactory.get_active_provider_name() == "claude"
    LLMFactory.set_active_provider("ollama")
    assert LLMFactory.get_active_provider_name() == "ollama"

@pytest.mark.asyncio
async def test_mock_provider_fallback():
    res = await mock_provider.generate("What is the LNO framework?", "system")
    assert "content" in res
    assert len(res["content"]) > 100
    assert res["is_fallback"] is True
