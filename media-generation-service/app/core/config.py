from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database Configuration - Individual fields (optional)
    db_host: Optional[str] = None
    db_port: Optional[int] = None
    db_name: Optional[str] = None
    db_user: Optional[str] = None
    db_password: Optional[str] = None
    
    # Database URL (takes precedence if provided)
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/media_generation"
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379/0"
    
    # Replicate API Configuration
    replicate_api_token: str = "your_replicate_token_here"
    
    # Application Settings
    debug: bool = True
    project_name: str = "Media Generation Service"
    api_v1_prefix: str = "/api/v1"
    
    # File Storage
    storage_path: str = "./storage"
    
    # Celery Task Settings
    max_retries: int = 3
    retry_backoff_base: float = 2.0
    
    # CORS Settings
    allowed_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        # Allow extra fields to be ignored instead of raising an error
        extra = "ignore"
    
    def get_database_url(self) -> str:
        """Get the database URL, constructing it from individual fields if DATABASE_URL is not set."""
        # If DATABASE_URL is explicitly set and not the default, use it
        if hasattr(self, 'database_url') and self.database_url != "postgresql+asyncpg://user:password@localhost:5432/media_generation":
            return self.database_url
        
        # Otherwise, construct from individual fields if they exist
        if all([self.db_host, self.db_port, self.db_name, self.db_user, self.db_password]):
            return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
        
        # Fall back to the default
        return self.database_url


# Create global settings instance
settings = Settings() 