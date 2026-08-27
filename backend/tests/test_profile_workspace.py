import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_get_profile_authenticated():
    uid = uuid.uuid4().hex[:8]
    email = f"sarah_{uid}@example.com"
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        signup_res = await ac.post("/api/auth/signup", json={
            "name": "Sarah Profile",
            "email": email,
            "password": "Password123!"
        })
        assert signup_res.status_code == 201
        token = signup_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Test /api/me
        me_res = await ac.get("/api/me", headers=headers)
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data["name"] == "Sarah Profile"
        assert me_data["email"] == email
        assert me_data["role"] == "Product Builder"
        assert "Product Strategy" in me_data["interests"]
        assert me_data["focus_progress"] == 65

        # Test /api/user/profile alias
        profile_res = await ac.get("/api/user/profile", headers=headers)
        assert profile_res.status_code == 200
        assert profile_res.json()["email"] == email

@pytest.mark.asyncio
async def test_patch_profile_identity_and_focus():
    uid = uuid.uuid4().hex[:8]
    email = f"alex_{uid}@example.com"
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        signup_res = await ac.post("/api/auth/signup", json={
            "name": "Alex Founder",
            "email": email,
            "password": "Password123!"
        })
        assert signup_res.status_code == 201
        token = signup_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Update profile identity, focus, and interests
        update_payload = {
            "role": "Founder & CPO",
            "company": "GrowthFlow",
            "industry": "B2B SaaS AI",
            "tagline": "Building autonomous product growth workflows.",
            "interests": ["Growth Loops", "Retention", "PMF", "Pricing"],
            "focus_goal": "Accelerate self-serve onboarding conversion",
            "focus_metric": "D7 Retention Rate",
            "focus_challenge": "Drop-off during team invitation step.",
            "focus_progress": 82,
            "privacy_use_context": True,
            "privacy_personalize_explore": False
        }

        patch_res = await ac.patch("/api/me", json=update_payload, headers=headers)
        assert patch_res.status_code == 200
        updated = patch_res.json()
        assert updated["role"] == "Founder & CPO"
        assert updated["company"] == "GrowthFlow"
        assert updated["industry"] == "B2B SaaS AI"
        assert updated["tagline"] == "Building autonomous product growth workflows."
        assert updated["interests"] == ["Growth Loops", "Retention", "PMF", "Pricing"]
        assert updated["focus_goal"] == "Accelerate self-serve onboarding conversion"
        assert updated["focus_metric"] == "D7 Retention Rate"
        assert updated["focus_progress"] == 82
        assert updated["privacy_personalize_explore"] is False

@pytest.mark.asyncio
async def test_workspace_summary_endpoint():
    uid = uuid.uuid4().hex[:8]
    email = f"elena_{uid}@example.com"
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        signup_res = await ac.post("/api/auth/signup", json={
            "name": "Elena Growth",
            "email": email,
            "password": "Password123!"
        })
        assert signup_res.status_code == 201
        token = signup_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create session and chat
        s_res = await ac.post("/api/sessions", json={"title": "Elena Activation Audit"}, headers=headers)
        session_id = s_res.json()["id"]

        await ac.post("/api/chat", json={
            "session_id": session_id,
            "message": "What does Rahul Vohra say about product market fit survey and activation?"
        }, headers=headers)

        # Generate an artifact
        await ac.post("/api/decision/memo", json={
            "decision_question": "Freemium vs Reverse Trial for activation?",
            "options": ["Freemium", "Reverse Trial"]
        }, headers=headers)

        # Fetch workspace summary
        ws_res = await ac.get("/api/me/workspace", headers=headers)
        assert ws_res.status_code == 200
        ws_data = ws_res.json()

        assert "stats" in ws_data
        assert ws_data["stats"]["total_sessions"] >= 1
        assert ws_data["stats"]["total_messages"] >= 2
        assert ws_data["stats"]["total_artifacts"] >= 1
        assert ws_data["stats"]["total_decisions"] >= 1

        assert "knowledge_dna" in ws_data
        assert len(ws_data["knowledge_dna"]) > 0

        assert "recent_thinking" in ws_data
        assert len(ws_data["recent_thinking"]) >= 1

        assert "active_learning" in ws_data
        assert "recommendations" in ws_data
        assert ws_data["profile_completeness"] >= 70

@pytest.mark.asyncio
async def test_two_user_profile_and_workspace_isolation():
    """
    Validates complete two-user isolation:
    User A and User B have separate private profiles, contexts, decisions, and workspace summaries.
    """
    uid_a = uuid.uuid4().hex[:8]
    uid_b = uuid.uuid4().hex[:8]
    email_a = f"alice_{uid_a}@example.com"
    email_b = f"bob_{uid_b}@example.com"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. User A (Fintech PM)
        res_a = await ac.post("/api/auth/signup", json={
            "name": "Alice Fintech",
            "email": email_a,
            "password": "Password123!"
        })
        assert res_a.status_code == 201
        token_a = res_a.json()["access_token"]
        headers_a = {"Authorization": f"Bearer {token_a}"}

        await ac.patch("/api/me", json={
            "company": "FintechApp",
            "focus_goal": "Optimize KYC completion rate"
        }, headers=headers_a)

        s_a = await ac.post("/api/sessions", json={"title": "Alice KYC Strategy"}, headers=headers_a)
        await ac.post("/api/chat", json={
            "session_id": s_a.json()["id"],
            "message": "How do we reduce drop-off during onboarding identity verification?"
        }, headers=headers_a)

        # 2. User B (Edtech PM)
        res_b = await ac.post("/api/auth/signup", json={
            "name": "Bob Edtech",
            "email": email_b,
            "password": "Password123!"
        })
        assert res_b.status_code == 201
        token_b = res_b.json()["access_token"]
        headers_b = {"Authorization": f"Bearer {token_b}"}

        await ac.patch("/api/me", json={
            "company": "EdtechLearn",
            "focus_goal": "Boost student lesson completion"
        }, headers=headers_b)

        s_b = await ac.post("/api/sessions", json={"title": "Bob Lesson Engagement"}, headers=headers_b)

        # 3. Verify User A Workspace
        ws_a = await ac.get("/api/me/workspace", headers=headers_a)
        assert ws_a.status_code == 200
        assert ws_a.json()["user"]["company"] == "FintechApp"
        assert ws_a.json()["user"]["focus_goal"] == "Optimize KYC completion rate"
        assert ws_a.json()["stats"]["total_sessions"] == 1
        assert ws_a.json()["recent_thinking"][0]["title"] == "Alice KYC Strategy"

        # 4. Verify User B Workspace (Zero Leakage)
        ws_b = await ac.get("/api/me/workspace", headers=headers_b)
        assert ws_b.status_code == 200
        assert ws_b.json()["user"]["company"] == "EdtechLearn"
        assert ws_b.json()["user"]["focus_goal"] == "Boost student lesson completion"
        assert ws_b.json()["stats"]["total_sessions"] == 1
        assert ws_b.json()["recent_thinking"][0]["title"] == "Bob Lesson Engagement"

        # 5. Verify User A cannot access User B's session
        cross_res = await ac.get(f"/api/sessions/{s_b.json()['id']}", headers=headers_a)
        assert cross_res.status_code == 403
