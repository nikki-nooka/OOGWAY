"""
Transcript Ingestion and Indexing Pipeline for The Lenny Growth Assistant.
"""
import sys
from pathlib import Path

backend_path = Path(__file__).parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from app.engine.rag import rag_engine, RAGEngine

__all__ = ["rag_engine", "RAGEngine"]
