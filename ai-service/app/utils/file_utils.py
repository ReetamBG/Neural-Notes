"""File handling utilities."""

import os
import shutil
from pathlib import Path
from typing import List

from fastapi import UploadFile

from app.core.config import get_settings

settings = get_settings()


async def save_upload_file(file: UploadFile, destination: Path) -> Path:
    """Save uploaded file to destination."""
    destination.parent.mkdir(parents=True, exist_ok=True)
    
    with open(destination, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return destination


def validate_file_extension(filename: str, allowed_extensions: List[str]) -> bool:
    """Validate if file has allowed extension."""
    file_ext = Path(filename).suffix.lower()
    return file_ext in allowed_extensions


def cleanup_file(file_path: Path) -> None:
    """Safely remove file if it exists."""
    if file_path.exists():
        try:
            file_path.unlink()
        except OSError:
            pass  # File might be in use or already deleted


def get_file_size(file_path: Path) -> int:
    """Get file size in bytes."""
    return file_path.stat().st_size if file_path.exists() else 0