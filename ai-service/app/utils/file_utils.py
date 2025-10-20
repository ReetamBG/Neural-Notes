"""File handling utilities."""

import os
import re
import shutil
from pathlib import Path
from typing import List

from fastapi import UploadFile

from app.core.config import get_settings

settings = get_settings()


def remove_markdown_formatting(text: str) -> str:
    """Remove markdown formatting from text."""
    if not text:
        return text
    
    # Remove markdown headers
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    
    # Remove bold and italic formatting
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)  # Bold
    text = re.sub(r'\*([^*]+)\*', r'\1', text)      # Italic
    text = re.sub(r'__([^_]+)__', r'\1', text)      # Bold
    text = re.sub(r'_([^_]+)_', r'\1', text)        # Italic
    
    # Remove code blocks and inline code
    text = re.sub(r'```[^`]*```', '', text, flags=re.DOTALL)
    text = re.sub(r'`([^`]+)`', r'\1', text)
    
    # Remove markdown links [text](url) -> text
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    
    # Remove markdown lists formatting
    text = re.sub(r'^\s*[-*+]\s+', '- ', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\.\s+', lambda m: f"{m.group().strip()[:-1]}. ", text, flags=re.MULTILINE)
    
    # Remove blockquotes
    text = re.sub(r'^>\s*', '', text, flags=re.MULTILINE)
    
    # Remove horizontal rules
    text = re.sub(r'^[-*_]{3,}$', '', text, flags=re.MULTILINE)
    
    # Clean up extra whitespace
    text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)
    text = text.strip()
    
    return text


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