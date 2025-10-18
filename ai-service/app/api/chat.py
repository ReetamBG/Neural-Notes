"""API endpoints for chat operations."""

from pathlib import Path

from fastapi import APIRouter, HTTPException, status

from app.core.config import get_settings
from app.models import (
    ChatRequest,
    ChatResponse,
    ChatWithNotesRequest,
    NotesRequest,
    SuccessResponse,
)
from app.services import llm_service, vectorstore_service

settings = get_settings()
router = APIRouter(prefix="/chat", tags=["chat"])


@router.post(
    "/",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Chat with document",
    description="Chat with uploaded document using RAG"
)
async def chat_with_document(request: ChatRequest):
    """Chat with uploaded document."""
    vector_db_path = settings.vector_db_dir / request.filename
    
    if not vector_db_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{request.filename}' not found. Please upload it first."
        )
    
    try:
        response = await llm_service.chat(
            request.query, 
            str(vector_db_path)
        )
        
        return ChatResponse(message=response)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}"
        )


@router.post(
    "/notes",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Chat with notes",
    description="Chat with uploaded notes using RAG"
)
async def chat_with_notes(request: ChatWithNotesRequest):
    """Chat with uploaded notes."""
    vector_db_path = settings.vector_db_dir / request.note_id
    
    if not vector_db_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notes '{request.note_id}' not found. Please upload them first."
        )
    
    try:
        response = await llm_service.chat(
            request.query, 
            str(vector_db_path)
        )
        
        return ChatResponse(message=response)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}"
        )


@router.post(
    "/upload-notes",
    response_model=SuccessResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload notes",
    description="Upload text notes and create vector embeddings"
)
async def upload_notes(request: NotesRequest):
    """Upload and process text notes."""
    try:
        vector_db_path = settings.vector_db_dir / request.note_id
        
        await vectorstore_service.create_vectorstore_from_text(
            request.notes,
            vector_db_path
        )
        
        return SuccessResponse(message="Notes processed successfully")
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process notes: {str(e)}"
        )