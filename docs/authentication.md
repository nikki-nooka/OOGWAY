# Authentication Architecture & Cryptography

The Lenny Growth Assistant implements an enterprise-grade, cryptographically secure authentication framework designed for multi-tenant private workspace isolation.

---

## 1. Password Hashing & Security

* **Algorithm**: PBKDF2 with HMAC-SHA256
* **Iterations**: 100,000 rounds
* **Salt**: 16 cryptographically secure random bytes generated per user via `os.urandom(16)`
* **Format**: Stored as `<hex_salt>$<hex_hash>`
* **Constant-Time Verification**: Uses `hmac.compare_digest` to eliminate side-channel and timing attacks.

```python
# backend/app/core/security.py
def hash_password(password: str) -> str:
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return f"{salt.hex()}${key.hex()}"
```

---

## 2. Stateless Bearer Tokens (JWT/HMAC-SHA256)

* **Signing Algorithm**: Cryptographic HMAC-SHA256
* **Payload**:
  - `sub`: User UUID
  - `email`: User email address
  - `exp`: Expiration timestamp (default: 7 days)
* **Header Format**: `Authorization: Bearer <token>`
* **Validation**: Signed digest comparison prevents token tampering, payload injection, or unauthorized privilege escalation.

---

## 3. Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Registers a new user and provisions private workspace | No |
| `POST` | `/api/auth/login` | Authenticates email & password, returning Bearer token | No |
| `GET` | `/api/auth/me` | Fetches authenticated user identity & workspace status | Yes (Bearer) |
| `POST` | `/api/auth/logout` | Client token invalidation & session cleanup | Yes (Bearer) |

---

## 4. Client Storage & Lifecycle

Tokens and active user profiles are persisted locally in `localStorage` via `authStorage` in `frontend/src/services/api.js`. Every outgoing request to protected endpoints automatically attaches the `Authorization: Bearer <token>` header.
