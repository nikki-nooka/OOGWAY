import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import init_db
from app.api.routes import router as api_router
from app.engine.rag import rag_engine

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("lenny.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing The Lenny Growth Assistant Backend...")
    # Initialize DB schema
    await init_db()
    # Verify Knowledge Base
    logger.info(f"Loaded {len(rag_engine.chunks)} transcript chunks across {len(rag_engine.get_all_episodes())} episodes.")
    yield
    logger.info("Shutting down Lenny Growth Assistant Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Production-grade Forward Deployed Growth Intelligence & RAG System built on Lenny's Podcast Transcripts.",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "status": "operational"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
