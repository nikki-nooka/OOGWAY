import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.database import init_db

@pytest.mark.asyncio
async def test_health_endpoint():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["transcripts_count"] > 0
        assert data["episodes_count"] >= 8

@pytest.mark.asyncio
async def test_models_endpoint():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/models")
        assert response.status_code == 200
        data = response.json()
        assert "available" in data
        assert len(data["available"]) >= 3

@pytest.mark.asyncio
async def test_transcripts_endpoint():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/transcripts")
        assert response.status_code == 200
        data = response.json()
        assert data["total_chunks"] > 0

@pytest.mark.asyncio
async def test_session_lifecycle_and_chat():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Create session
        create_res = await ac.post("/api/sessions", json={"title": "PMF Strategy Session", "model_provider": "mock"})
        assert create_res.status_code == 200
        session_id = create_res.json()["id"]

        # 2. Send chat message
        chat_res = await ac.post("/api/chat", json={
            "session_id": session_id,
            "message": "Explain Rahul Vohra's 40% disappointed PMF framework and make an interactive calculator",
            "model": "mock"
        })
        assert chat_res.status_code == 200
        chat_data = chat_res.json()
        assert chat_data["session_id"] == session_id
        assert len(chat_data["citations"]) > 0
        assert len(chat_data["artifacts"]) >= 1

        # 3. Get session details and verify persistence
        detail_res = await ac.get(f"/api/sessions/{session_id}")
        assert detail_res.status_code == 200
        detail_data = detail_res.json()
        assert len(detail_data["messages"]) >= 2 # user + assistant
        assert len(detail_data["artifacts"]) >= 1

        # 4. Delete session
        del_res = await ac.delete(f"/api/sessions/{session_id}")
        assert del_res.status_code == 200
