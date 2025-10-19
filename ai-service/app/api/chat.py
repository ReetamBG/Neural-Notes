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
    VectorDBExistsRequest,
    StatusResponse
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
    vector_db_path = settings.vector_db_dir / request.user_id / "uploaded_doc"/ request.folder_id
    
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
    vector_db_path = settings.vector_db_dir / request.user_id / "notes" / request.folder_id
    
    if not vector_db_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notes not found for user '{request.user_id}' in folder '{request.folder_id}'. Please upload them first."
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
        "/doc-vector-db-exist",
        response_model=StatusResponse,
        status_code=status.HTTP_200_OK,
        summary="Check if document vector db exists",
)
async def check_document_exist(request: VectorDBExistsRequest):
    """Check if document vector db exist for the user and folder."""
    vector_db_path = settings.vector_db_dir / request.user_id / "uploaded_doc" / request.folder_id

    if not vector_db_path.exists():
        return StatusResponse(status=False)

    return StatusResponse(status=True)

@router.post(
        "/notes-vector-db-exist",
        response_model=StatusResponse,
        status_code=status.HTTP_200_OK,
        summary="Check if notes vector db exist",
)
async def check_notes_exist(request: VectorDBExistsRequest):
    """Check if notes vector db exist for the user and folder."""
    vector_db_path = settings.vector_db_dir / request.user_id / "notes" / request.folder_id

    if not vector_db_path.exists():
        return StatusResponse(status=False)
    
    return StatusResponse(status=True)