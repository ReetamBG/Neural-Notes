from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile, status, Form

from app.core.config import get_settings
from app.models import SuccessResponse
from app.services import vectorstore_service
from app.utils import save_upload_file, validate_file_extension

from app.models import NotesRequest

settings = get_settings()
router = APIRouter(prefix="/upload", tags=["upload"])


@router.post(
    "/pdf",
    response_model=SuccessResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload PDF file",
    description="Upload a PDF file and create vector embeddings"
)
async def upload_pdf(file: Annotated[UploadFile, File()], user_id: Annotated[str, Form(...)], folder_id: Annotated[str, Form(...)]):
    """Upload and process PDF file."""
    if not validate_file_extension(file.filename, [".pdf"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )
    
    if not user_id or not folder_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID and Folder ID are required"
        ) 
    
    try:
        # Save uploaded file (for each user and folder only one file is stored)
        file_path = settings.upload_dir / user_id / "uploaded_doc" / folder_id
        await save_upload_file(file, file_path)
        
        # Create vector store
        vector_db_path = settings.vector_db_dir / user_id / "uploaded_doc" / folder_id
        await vectorstore_service.create_vectorstore_from_pdf(
            file_path, 
            vector_db_path
        )
        
        return SuccessResponse(message="PDF processed successfully")
        
    except Exception as e:
        print("Error in upload_pdf: " + e)
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
async def upload_video(file: Annotated[UploadFile, File()], user_id: Annotated[str, Form(...)], folder_id: Annotated[str, Form(...)]):
    """Upload and process video file."""
    video_extensions = [".mp4", ".avi", ".mov", ".mkv"]
    
    if not validate_file_extension(file.filename, video_extensions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only video files are allowed: {', '.join(video_extensions)}"
        )

    if not user_id or not folder_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID and Folder ID are required"
        ) 
    
    
    try:
        # Save uploaded file (for each user and folder only one file is stored)
        file_path = settings.upload_dir / user_id / "uploaded_doc" / folder_id
        await save_upload_file(file, file_path)
        
        # Create paths for processing
        audio_path = settings.audio_dir / user_id / f"{folder_id}.wav"
        vector_db_path = settings.vector_db_dir / user_id / "uploaded_doc" / folder_id
        
        # Process video
        await vectorstore_service.create_vectorstore_from_video(
            file_path,
            vector_db_path, 
            audio_path
        )
        
        return SuccessResponse(message="Video processed successfully")
        
    except Exception as e:
        print("Error in upload_video: " + e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process video: {str(e)}"
        )
    

@router.post(
    "/notes",
    response_model=SuccessResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload notes",
    description="Upload text notes and create vector embeddings (currently uploading all notes in folder as single string)"
)
async def upload_notes(request: NotesRequest):
    """Upload and process text notes."""
    print("Received user_id:", request.user_id)
    print("Received folder_id:", request.folder_id)
    print("Received notes:", request.notes)
    try:
        vector_db_path = settings.vector_db_dir / request.user_id / "notes" / request.folder_id
        
        await vectorstore_service.create_vectorstore_from_text(
            request.notes,
            vector_db_path
        )
        
        return SuccessResponse(message="Notes processed successfully")
        
    except Exception as e:
        print("Error in upload_notes: ", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process notes: {str(e)}"
        )