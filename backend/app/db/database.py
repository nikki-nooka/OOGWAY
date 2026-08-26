import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

logger = logging.getLogger("lenny.db")

# Create async engine with fallback support
database_url = settings.DATABASE_URL
# If user provided a postgres:// URL (e.g. Supabase / Railway), convert to postgresql+asyncpg://
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(
    database_url,
    echo=False,
    future=True,
    pool_pre_ping=True if "postgresql" in database_url else False,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    try:
        async with engine.begin() as conn:
            # Import models to ensure they are registered with Base metadata
            from app.db import models  # noqa
            await conn.run_sync(Base.metadata.create_all)
        logger.info(f"Database initialized successfully ({settings.DATABASE_URL.split('://')[0]})")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        # Fallback to local SQLite if remote Postgres fails
        if "postgresql" in settings.DATABASE_URL:
            logger.warning("Attempting fallback to local SQLite...")
            fallback_engine = create_async_engine("sqlite+aiosqlite:///./lenny_growth.db")
            async with fallback_engine.begin() as conn:
                from app.db import models  # noqa
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Local SQLite fallback initialized.")
