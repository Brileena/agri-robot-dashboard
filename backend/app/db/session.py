from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# Create an async engine connected to Supabase (using psycopg3)
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

# Create an async session maker
AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False, autoflush=False)

# Dependency to inject DB session into routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
