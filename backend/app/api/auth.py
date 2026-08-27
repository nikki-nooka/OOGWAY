from typing import Optional
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.db.models import UserModel, SessionModel, ArtifactModel
from app.core.security import decode_access_token

async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> UserModel:
    """FastAPI dependency to extract and verify the authenticated user from the Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required. Please sign in to access your private workspace.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.split(" ")[1].strip()
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload["sub"]
    stmt = select(UserModel).where(UserModel.id == user_id, UserModel.is_active == True)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found or deactivated.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


async def get_optional_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> Optional[UserModel]:
    """FastAPI dependency that returns the authenticated user if present, or None for public/guest mode."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    
    token = authorization.split(" ")[1].strip()
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    
    user_id = payload["sub"]
    stmt = select(UserModel).where(UserModel.id == user_id, UserModel.is_active == True)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def verify_session_ownership(
    session_id: str,
    user: Optional[UserModel],
    db: AsyncSession
) -> SessionModel:
    """Verifies that a requested session exists and belongs to the authenticated user."""
    stmt = select(SessionModel).where(SessionModel.id == session_id)
    res = await db.execute(stmt)
    session_obj = res.scalar_one_or_none()
    
    if not session_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")
    
    # If the session belongs to a registered user, only that user can access it
    if session_obj.user_id:
        if not user or user.id != session_obj.user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You do not have permission to view or modify this private session."
            )
    return session_obj


async def verify_artifact_ownership(
    artifact_id: str,
    user: Optional[UserModel],
    db: AsyncSession
) -> ArtifactModel:
    """Verifies that a requested artifact exists and belongs to the authenticated user."""
    stmt = select(ArtifactModel).where(ArtifactModel.id == artifact_id)
    res = await db.execute(stmt)
    artifact_obj = res.scalar_one_or_none()
    
    if not artifact_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artifact not found.")
    
    if artifact_obj.user_id:
        if not user or user.id != artifact_obj.user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You do not have permission to view or modify this private artifact."
            )
    return artifact_obj
