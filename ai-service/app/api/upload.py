"""API endpoints for file upload operations."""

from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core.config import get_settings
from app.models import SuccessResponse
from app.services import vectorstore_service
from app.utils import save_upload_file, validate_file_extension

settings = get_settings()
router = APIRouter(prefix="/upload", tags=["upload"])


@router.post(
    "/pdf",
    response_model=SuccessResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload PDF file",
    description="Upload a PDF file and create vector embeddings"
)
async def upload_pdf(file: Annotated[UploadFile, File()]):
    """Upload and process PDF file."""
    if not validate_file_extension(file.filename, [".pdf"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )
    
    try:
        # Save uploaded file
        file_path = settings.upload_dir / file.filename
        await save_upload_file(file, file_path)
        
        # Create vector store
        vector_db_path = settings.vector_db_dir / file.filename
        await vectorstore_service.create_vectorstore_from_pdf(
            file_path, 
            vector_db_path
        )
        
        return SuccessResponse(message="PDF processed successfully")
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process PDF: {str(e)}"
        )


@router.post(
    "/video",
    response_model=SuccessResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload video file",
    description="Upload a video file, extract audio, transcribe, and create vector embeddings"
)
async def upload_video(file: Annotated[UploadFile, File()]):
    """Upload and process video file."""
    video_extensions = [".mp4", ".avi", ".mov", ".mkv"]
    
    if not validate_file_extension(file.filename, video_extensions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only video files are allowed: {', '.join(video_extensions)}"
        )
    
    try:
        # Save uploaded file
        file_path = settings.upload_dir / file.filename
        await save_upload_file(file, file_path)
        
        # Create paths for processing
        audio_path = settings.audio_dir / f"{file.filename}.wav"
        vector_db_path = settings.vector_db_dir / file.filename
        
        # Process video
        await vectorstore_service.create_vectorstore_from_video(
            file_path,
            vector_db_path, 
            audio_path
        )
        
        return SuccessResponse(message="Video processed successfully")
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process video: {str(e)}"
        )