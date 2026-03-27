from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriBot Dashboard API"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days by default

    # Database (Supabase)
    DATABASE_URL: str

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
