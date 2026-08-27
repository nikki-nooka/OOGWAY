import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.database import init_db

@pytest.mark.asyncio
async def test_cross_user_session_access_blocked():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        uid = uuid.uuid4().hex[:8]
        # 1. User A signs up and creates private session
        res_a = await ac.post("/api/auth/signup", json={
            "name": "User Alpha",
            "email": f"user_alpha_{uid}@test.com",
            "password": "Password123!"
        })
        assert res_a.status_code == 201
        token_a = res_a.json()["access_token"]
        
        session_res = await ac.post(
            "/api/sessions",
            json={"title": "Alpha Confidential Strategy", "model_provider": "mock"},
            headers={"Authorization": f"Bearer {token_a}"}
        )
        assert session_res.status_code == 200
        session_a_id = session_res.json()["id"]

        # 2. User B signs up
        res_b = await ac.post("/api/auth/signup", json={
            "name": "User Beta",
            "email": f"user_beta_{uid}@test.com",
            "password": "Password456!"
        })
        assert res_b.status_code == 201
        token_b = res_b.json()["access_token"]

        # 3. User B attempts to read User A's private session
        attempt_get = await ac.get(
            f"/api/sessions/{session_a_id}",
            headers={"Authorization": f"Bearer {token_b}"}
        )
        assert attempt_get.status_code == 403
        assert "access denied" in attempt_get.json()["detail"].lower()

        # 4. User B attempts to delete User A's private session
        attempt_del = await ac.delete(
            f"/api/sessions/{session_a_id}",
            headers={"Authorization": f"Bearer {token_b}"}
        )
        assert attempt_del.status_code == 403

@pytest.mark.asyncio
async def test_cross_user_artifact_access_blocked():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        uid = uuid.uuid4().hex[:8]
        # 1. User A creates private artifact
        res_a = await ac.post("/api/auth/signup", json={
            "name": "User Alpha Artifacts",
            "email": f"alpha_art_{uid}@test.com",
            "password": "Password123!"
        })
        assert res_a.status_code == 201
        token_a = res_a.json()["access_token"]
        
        art_res = await ac.post(
            "/api/artifacts",
            json={
                "title": "Alpha Proprietary Retention Analysis",
                "artifact_type": "markdown",
                "content": "# Secret Retention Cohort Metrics"
            },
            headers={"Authorization": f"Bearer {token_a}"}
        )
        assert art_res.status_code == 200
        art_a_id = art_res.json()["id"]

        # 2. User B signs up
        res_b = await ac.post("/api/auth/signup", json={
            "name": "User Beta Artifacts",
            "email": f"beta_art_{uid}@test.com",
            "password": "Password456!"
        })
        assert res_b.status_code == 201
        token_b = res_b.json()["access_token"]

        # 3. User B attempts to fetch User A's artifact
        attempt_get = await ac.get(
            f"/api/artifacts/{art_a_id}",
            headers={"Authorization": f"Bearer {token_b}"}
        )
        assert attempt_get.status_code == 403

        # 4. User B attempts to delete User A's artifact
        attempt_del = await ac.delete(
            f"/api/artifacts/{art_a_id}",
            headers={"Authorization": f"Bearer {token_b}"}
        )
        assert attempt_del.status_code == 403
