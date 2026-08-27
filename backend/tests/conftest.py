import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import pytest
from app.db.database import init_db

@pytest.fixture(autouse=True)
async def initialize_test_database():
    await init_db()
