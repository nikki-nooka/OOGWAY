# Authorization & User Isolation Architecture

The Lenny Growth Assistant enforces strict **multi-tenant data isolation** across all stateful entities: conversation sessions, messages, generated artifacts, and personal company context.

---

## 1. Multi-Tenant Data Isolation Principles

1. **Explicit Resource Ownership**:
   Every stateful record (`sessions`, `artifacts`, `personal_context`) contains a `user_id` foreign key.
2. **Server-Side Enforcement**:
   Authorization checks are executed strictly on the backend via FastAPI dependency injection (`get_current_user`, `verify_session_ownership`, `verify_artifact_ownership`).
3. **Rejection Policy**:
   If User A attempts to access or mutate a session or artifact owned by User B, the backend immediately halts execution and returns `403 Forbidden` (or `404 Not Found`).

---

## 2. Dependency Guards (`backend/app/api/auth.py`)

### `get_current_user`
Validates the incoming `Authorization: Bearer <token>` header, decodes the signature, and retrieves the active user from the database. Raises `401 Unauthorized` if invalid or expired.

### `get_optional_user`
Permits guest exploration while automatically scoping resources to authenticated users when a valid token is supplied.

### `verify_session_ownership`
```python
async def verify_session_ownership(session: SessionModel, user: UserModel) -> None:
    if session.user_id and session.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not own this private workspace session."
        )
```

### `verify_artifact_ownership`
```python
async def verify_artifact_ownership(artifact: ArtifactModel, user: UserModel) -> None:
    if artifact.user_id and artifact.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not own this private workspace artifact."
        )
```

---

## 3. Scope of Isolated Resources

* **Sessions (`SessionModel`)**: Private chat histories are isolated to the creator.
* **Messages (`MessageModel`)**: All user questions, RAG context injections, citations, and assistant responses are strictly scoped to the session's owner.
* **Artifacts (`ArtifactModel`)**: Generated decision memos, experiment briefs, framework trees, and interactive HTML tools are stored exclusively in the creator's workspace.
* **Company Context (`PersonalContextModel`)**: User-specific product metrics (Company Type, User Scale, Activation Rate, Core Problems) remain private and are automatically injected only into the authenticated user's requests.
