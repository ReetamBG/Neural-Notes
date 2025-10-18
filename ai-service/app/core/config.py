"""Application configuration settings."""

import os
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # API Configuration
    app_name: str = "ML API"
    version: str = "1.0.0"
    debug: bool = False
    
    # OpenRouter API Configuration
    openrouter_api_key: str = "add your key"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    default_model: str = "deepseek/deepseek-chat-v3-0324:free"
    
    # File Upload Configuration
    max_upload_size: int = 50 * 1024 * 1024  # 50MB
    allowed_extensions: List[str] = [".pdf", ".mp4", ".avi", ".mov", ".mkv"]
    
    # Directory Configuration
    upload_dir: Path = Path("uploads")
    vector_db_dir: Path = Path("chroma_db")
    audio_dir: Path = Path("vid_to_audio_data")
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
for directory in [settings.upload_dir, settings.vector_db_dir, settings.audio_dir]:
    directory.mkdir(exist_ok=True)