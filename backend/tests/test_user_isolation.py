import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.database import init_db

@pytest.mark.asyncio
async def test_session_list_workspace_isolation():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        uid = uuid.uuid4().hex[:8]
        # User 1
        res1 = await ac.post("/api/auth/signup", json={
            "name": "Workspace User 1",
            "email": f"work1_{uid}@test.com",
            "password": "Password123!"
        })
        token1 = res1.json()["access_token"]
        await ac.post(
            "/api/sessions",
            json={"title": "User 1 PLG Experiment"},
            headers={"Authorization": f"Bearer {token1}"}
        )

        # User 2
        res2 = await ac.post("/api/auth/signup", json={
            "name": "Workspace User 2",
            "email": f"work2_{uid}@test.com",
            "password": "Password456!"
        })
        token2 = res2.json()["access_token"]
        await ac.post(
            "/api/sessions",
            json={"title": "User 2 Enterprise Expansion"},
            headers={"Authorization": f"Bearer {token2}"}
        )

        # User 1 listing
        list1 = await ac.get("/api/sessions", headers={"Authorization": f"Bearer {token1}"})
        titles1 = [s["title"] for s in list1.json()]
        assert "User 1 PLG Experiment" in titles1
        assert "User 2 Enterprise Expansion" not in titles1

        # User 2 listing
        list2 = await ac.get("/api/sessions", headers={"Authorization": f"Bearer {token2}"})
        titles2 = [s["title"] for s in list2.json()]
        assert "User 2 Enterprise Expansion" in titles2
        assert "User 1 PLG Experiment" not in titles2

@pytest.mark.asyncio
async def test_personal_context_isolation():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        uid = uuid.uuid4().hex[:8]
        # User 1
        res1 = await ac.post("/api/auth/signup", json={
            "name": "Company A Founder",
            "email": f"founder_a_{uid}@test.com",
            "password": "Password123!"
        })
        token1 = res1.json()["access_token"]
        await ac.post(
            "/api/user/context",
            json={
                "company_type": "Fintech API",
                "users_scale": "5,000 MAU",
                "activation_rate": "14%",
                "problem": "Developer drop-off before first API key generation",
                "constraints": "Bootstrapped"
            },
            headers={"Authorization": f"Bearer {token1}"}
        )

        # User 2
        res2 = await ac.post("/api/auth/signup", json={
            "name": "Company B Founder",
            "email": f"founder_b_{uid}@test.com",
            "password": "Password456!"
        })
        token2 = res2.json()["access_token"]
        await ac.post(
            "/api/user/context",
            json={
                "company_type": "Consumer Marketplace",
                "users_scale": "250,000 MAU",
                "activation_rate": "42%",
                "problem": "Supply churn in secondary metros",
                "constraints": "Series A funded"
            },
            headers={"Authorization": f"Bearer {token2}"}
        )

        # Verify User 1 context remains isolated
        ctx1 = await ac.get("/api/user/context", headers={"Authorization": f"Bearer {token1}"})
        assert ctx1.status_code == 200
        assert ctx1.json()["company_type"] == "Fintech API"
        assert ctx1.json()["users_scale"] == "5,000 MAU"

        # Verify User 2 context remains isolated
        ctx2 = await ac.get("/api/user/context", headers={"Authorization": f"Bearer {token2}"})
        assert ctx2.status_code == 200
        assert ctx2.json()["company_type"] == "Consumer Marketplace"
        assert ctx2.json()["users_scale"] == "250,000 MAU"
