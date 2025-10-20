"""Application configuration settings."""

import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    """Application settings."""
    
    # API Configuration
    app_name: str = "ML API"
    version: str = "1.0.0"
    debug: bool = True
    
    # OpenRouter API Configuration
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY")
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    # default_model: str = "anthropic/claude-3.5-sonnet"   # best reasoning with okay response time
    default_model: str = "openai/gpt-4o-mini"    # faster responses with okay reasoning
    
    # File Upload Configuration
    max_upload_size: int = 50 * 1024 * 1024  # 50MB
    allowed_extensions: List[str] = [".pdf", ".mp4", ".avi", ".mov", ".mkv"]
    
    # Directory Configuration
    root_data_dir: Path = Path("data")
    upload_dir: Path = root_data_dir / "uploads"
    vector_db_dir: Path = root_data_dir / "vector_dbs"
    audio_dir: Path = root_data_dir / "extracted_audios"
    model_dir: Path = Path("vosk-model-small-en-us-0.15")
    
    # Embedding Configuration
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    chunk_size: int = 500
    chunk_overlap: int = 50
    
    # Audio Processing Configuration
    audio_sample_rate: int = 16000
    audio_channels: int = 1
    
    # Analysis Configuration
    similarity_threshold: float = 0.7
    top_keywords: int = 5
    
    # LLM Response Configuration
    remove_markdown_formatting: bool = True
    
    # CORS Configuration
    allowed_origins: List[str] = ["*"]
    allowed_methods: List[str] = ["*"]
    allowed_headers: List[str] = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


def get_settings() -> Settings:
    """Get application settings instance."""
    return Settings()


# Create directories on import
settings = get_settings()
for directory in [settings.root_data_dir, settings.upload_dir, settings.vector_db_dir, settings.audio_dir]:
    directory.mkdir(exist_ok=True)