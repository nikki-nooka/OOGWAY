import os
import re
import hmac
import json
import base64
import hashlib
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, List

from app.core.config import settings

# --- Password Hashing with PBKDF2-SHA256 (NIST Approved, Zero External C-Deps) ---

def hash_password(password: str) -> str:
    """Hashes a password using PBKDF2-HMAC-SHA256 with 100,000 iterations and a random salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"pbkdf2_sha256$100000${salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a stored PBKDF2 hash."""
    try:
        parts = hashed_password.split('$')
        if len(parts) != 4 or parts[0] != 'pbkdf2_sha256':
            return False
        iterations = int(parts[1])
        salt = parts[2]
        expected_hex = parts[3]
        
        computed_key = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            iterations
        )
        return hmac.compare_digest(computed_key.hex(), expected_hex)
    except Exception:
        return False


# --- Cryptographic Token Generation (HMAC-SHA256 Signed Tokens) ---

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Creates an HMAC-SHA256 signed access token with an expiration timestamp."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=7) # 7-day token expiration
    
    to_encode.update({"exp": int(expire.timestamp()), "iat": int(now.timestamp())})
    
    payload_json = json.dumps(to_encode, separators=(',', ':')).encode('utf-8')
    payload_b64 = base64.urlsafe_b64encode(payload_json).decode('utf-8').rstrip('=')
    
    secret = settings.JWT_SECRET_KEY.encode('utf-8')
    signature = hmac.new(secret, payload_b64.encode('utf-8'), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode('utf-8').rstrip('=')
    
    return f"{payload_b64}.{sig_b64}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates an HMAC-SHA256 signed access token."""
    try:
        parts = token.split('.')
        if len(parts) != 2:
            return None
        payload_b64, sig_b64 = parts
        
        # Verify signature
        secret = settings.JWT_SECRET_KEY.encode('utf-8')
        expected_sig = hmac.new(secret, payload_b64.encode('utf-8'), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode('utf-8').rstrip('=')
        
        if not hmac.compare_digest(sig_b64, expected_sig_b64):
            return None
        
        # Decode payload with proper base64 padding
        padding = len(payload_b64) % 4
        if padding:
            payload_b64 += '=' * (4 - padding)
        payload_json = base64.urlsafe_b64decode(payload_b64.encode('utf-8')).decode('utf-8')
        payload = json.loads(payload_json)
        
        # Verify expiration
        exp = payload.get("exp")
        if exp and exp < datetime.now(timezone.utc).timestamp():
            return None # Expired token
            
        return payload
    except Exception:
        return None


# --- Artifact & HTML Security Policy (XSS Prevention & CSP Sandboxing) ---

class ArtifactSecurityPolicy:
    """Enforces strict security policies, sanitization, and sandboxing rules on generated artifacts."""

    DISALLOWED_PATTERNS = [
        re.compile(r"javascript\s*:", re.IGNORECASE),
        re.compile(r"vbscript\s*:", re.IGNORECASE),
        re.compile(r"data\s*:\s*text\/html", re.IGNORECASE),
        re.compile(r"<iframe.*?src=[\"']javascript:.*?<\/iframe>", re.IGNORECASE | re.DOTALL),
        re.compile(r"window\.parent", re.IGNORECASE),
        re.compile(r"window\.top", re.IGNORECASE),
        re.compile(r"document\.cookie", re.IGNORECASE),
        re.compile(r"localStorage\.", re.IGNORECASE),
        re.compile(r"sessionStorage\.", re.IGNORECASE),
    ]

    @classmethod
    def sanitize_html(cls, html_content: str) -> Dict[str, Any]:
        """Sanitizes raw HTML to remove parent window escapes and dangerous protocol schemas."""
        warnings: List[str] = []
        is_safe = True
        sanitized = html_content
        for pattern in cls.DISALLOWED_PATTERNS:
            if pattern.search(sanitized):
                is_safe = False
                warnings.append(f"Sanitized disallowed pattern: {pattern.pattern}")
                sanitized = pattern.sub("/* blocked_by_security_policy */", sanitized)
        return {
            "html": sanitized,
            "is_safe": is_safe,
            "warnings": warnings,
            "sandbox_attributes": "allow-scripts allow-forms allow-modals"
        }

    @classmethod
    def is_safe_payload(cls, payload: str) -> bool:
        """Checks if a payload contains dangerous parent window access or exploit vectors."""
        for pattern in cls.DISALLOWED_PATTERNS:
            if pattern.search(payload):
                return False
        return True
