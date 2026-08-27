import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import text
from app.core.config import settings

logger = logging.getLogger("lenny.db")

# Create async engine with fallback support
database_url = settings.DATABASE_URL
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
            
            # Auto-migrate columns & constraints for SQLite
            try:
                    # Check and alter users table
                    res_user = await conn.execute(text("PRAGMA table_info(users)"))
                    user_cols = [row[1] for row in res_user.fetchall()]
                    columns_to_add = [
                        ("role", "VARCHAR(100)"),
                        ("company", "VARCHAR(100)"),
                        ("industry", "VARCHAR(100)"),
                        ("experience_level", "VARCHAR(50)"),
                        ("location", "VARCHAR(100)"),
                        ("tagline", "VARCHAR(255)"),
                        ("interests", "JSON"),
                        ("focus_goal", "VARCHAR(255)"),
                        ("focus_metric", "VARCHAR(100)"),
                        ("focus_challenge", "TEXT"),
                        ("focus_progress", "INTEGER"),
                        ("privacy_use_context", "BOOLEAN"),
                        ("privacy_personalize_explore", "BOOLEAN"),
                        ("privacy_use_history", "BOOLEAN"),
                    ]
                    for col_name, col_type in columns_to_add:
                        if col_name not in user_cols:
                            try:
                                await conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                            except Exception as col_err:
                                logger.warning(f"Error adding {col_name} to users: {col_err}")

                    # Check and alter sessions table
                    res = await conn.execute(text("PRAGMA table_info(sessions)"))
                    columns = [row[1] for row in res.fetchall()]
                    if "user_id" not in columns:
                        await conn.execute(text("ALTER TABLE sessions ADD COLUMN user_id VARCHAR(36)"))


                    
                    # Check artifacts table columns
                    res_art = await conn.execute(text("PRAGMA table_info(artifacts)"))
                    art_info = res_art.fetchall()
                    art_columns = [row[1] for row in art_info]
                    
                    # If user_id missing or session_id has NOT NULL constraint (notnull == 1)
                    session_id_notnull = any(row[1] == "session_id" and row[3] == 1 for row in art_info)
                    
                    if "user_id" not in art_columns or session_id_notnull:
                        # Recreate artifacts table cleanly with nullable session_id and user_id
                        await conn.execute(text("""
                            CREATE TABLE IF NOT EXISTS artifacts_new (
                                id VARCHAR(36) PRIMARY KEY,
                                user_id VARCHAR(36),
                                session_id VARCHAR(36),
                                message_id VARCHAR(36),
                                title VARCHAR(255) NOT NULL,
                                artifact_type VARCHAR(50) NOT NULL,
                                content TEXT NOT NULL,
                                meta JSON,
                                created_at DATETIME
                            )
                        """))
                        # Copy existing rows if any
                        try:
                            await conn.execute(text("""
                                INSERT OR IGNORE INTO artifacts_new (id, session_id, message_id, title, artifact_type, content, meta, created_at)
                                SELECT id, session_id, message_id, title, artifact_type, content, meta, created_at FROM artifacts
                            """))
                        except Exception:
                            pass
                        await conn.execute(text("DROP TABLE IF EXISTS artifacts"))
                        await conn.execute(text("ALTER TABLE artifacts_new RENAME TO artifacts"))
            except Exception as mig_err:
                logger.warning(f"Schema migration note: {mig_err}")

        logger.info(f"Database initialized successfully ({settings.DATABASE_URL.split('://')[0]})")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        if "postgresql" in settings.DATABASE_URL:
            logger.warning("Attempting fallback to local SQLite...")
            fallback_engine = create_async_engine("sqlite+aiosqlite:///./lenny_growth.db")
            async with fallback_engine.begin() as conn:
                from app.db import models  # noqa
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Local SQLite fallback initialized.")
