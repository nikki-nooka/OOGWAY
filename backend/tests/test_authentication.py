import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.database import init_db
from app.core.security import verify_password, hash_password

@pytest.mark.asyncio
async def test_password_hashing_pbkdf2():
    password = "secret_password_123"
    hashed = hash_password(password)
    assert hashed.startswith("pbkdf2_sha256$100000$")
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False

@pytest.mark.asyncio
async def test_user_signup_success():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        uid = uuid.uuid4().hex[:8]
        email = f"evaluator_{uid}@test.com"
        res = await ac.post("/api/auth/signup", json={
            "name": "Alex Evaluator",
            "email": email,
            "password": "Password123!"
        })
        assert res.status_code == 201
        data = res.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["name"] == "Alex Evaluator"
        assert data["user"]["email"] == email.lower()

@pytest.mark.asyncio
async def test_user_signup_duplicate_email():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        uid = uuid.uuid4().hex[:8]
        email = f"dup_{uid}@test.com"
        # First signup
        await ac.post("/api/auth/signup", json={
            "name": "Original User",
            "email": email,
            "password": "Password123!"
        })
        # Second signup with same email
        res = await ac.post("/api/auth/signup", json={
            "name": "Imposter User",
            "email": email,
            "password": "Password456!"
        })
        assert res.status_code == 400
        assert "already exists" in res.json()["detail"].lower()

@pytest.mark.asyncio
async def test_user_login_success():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        uid = uuid.uuid4().hex[:8]
        email = f"login_ok_{uid}@test.com"
        await ac.post("/api/auth/signup", json={
            "name": "Valid User",
            "email": email,
            "password": "CorrectPassword123!"
        })
        
        login_res = await ac.post("/api/auth/login", json={
            "email": email,
            "password": "CorrectPassword123!"
        })
        assert login_res.status_code == 200
        data = login_res.json()
        assert "access_token" in data
        assert data["user"]["email"] == email

@pytest.mark.asyncio
async def test_user_login_invalid_password():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        uid = uuid.uuid4().hex[:8]
        email = f"login_bad_{uid}@test.com"
        await ac.post("/api/auth/signup", json={
            "name": "Valid User",
            "email": email,
            "password": "CorrectPassword123!"
        })
        
        login_res = await ac.post("/api/auth/login", json={
            "email": email,
            "password": "WrongPassword999!"
        })
        assert login_res.status_code == 401
        assert "invalid email or password" in login_res.json()["detail"].lower()

@pytest.mark.asyncio
async def test_get_current_user_profile():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        uid = uuid.uuid4().hex[:8]
        email = f"profile_{uid}@test.com"
        signup_res = await ac.post("/api/auth/signup", json={
            "name": "Profile User",
            "email": email,
            "password": "Password123!"
        })
        token = signup_res.json()["access_token"]
        
        # Request profile with valid Bearer token
        me_res = await ac.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me_res.status_code == 200
        assert me_res.json()["name"] == "Profile User"
        assert me_res.json()["email"] == email

@pytest.mark.asyncio
async def test_get_current_user_unauthorized():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Request profile without token
        me_res = await ac.get("/api/auth/me")
        assert me_res.status_code == 401
        
        # Request profile with invalid token
        invalid_res = await ac.get("/api/auth/me", headers={"Authorization": "Bearer invalid.token.payload"})
        assert invalid_res.status_code == 401
