"""Pydantic models for API request/response validation."""

from typing import List, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Chat request model."""
    query: str = Field(..., min_length=1, description="User query")
    user_id: str = Field(..., min_length=1, description="User identifier")
    folder_id: str = Field(..., min_length=1, description="Folder identifier")

class VectorDBExistsRequest(BaseModel):
    """Request model to check if vector DB exists."""
    user_id: str = Field(..., min_length=1, description="User identifier")
    folder_id: str = Field(..., min_length=1, description="Folder identifier")


class ChatWithNotesRequest(BaseModel):
    """Chat with notes request model."""
    query: str = Field(..., min_length=1, description="User query")
    user_id: str = Field(..., min_length=1, description="User identifier")
    folder_id: str = Field(..., min_length=1, description="Folder identifier")


class NotesRequest(BaseModel):
    """
    Notes upload request model. 
    Uses all notes in a folder as a single string for embedding.
    """
    notes: str = Field(..., min_length=1, description="Notes content")
    user_id: str = Field(..., min_length=1, description="User identifier")
    folder_id: str = Field(..., min_length=1, description="Folder identifier")


class AnalysisRequest(BaseModel):
    """Analysis request model."""
    title: str = Field(..., min_length=1, description="Content title")
    text: str = Field(..., min_length=1, description="User text to analyze")
    user_id: str = Field(..., min_length=1, description="User identifier")
    folder_id: str = Field(..., min_length=1, description="Folder identifier")


class ChatResponse(BaseModel):
    """Chat response model."""
    message: str = Field(..., description="LLM response")


class SuccessResponse(BaseModel):
    """Generic success response model."""
    message: str = Field(default="Success", description="Success message")

class StatusResponse(BaseModel):
    """Status response model."""
    status: bool = Field(..., description="Existence status")


class AnalysisResponse(BaseModel):
    """Analysis response model."""
    accuracy: float = Field(..., ge=0, le=1, description="Accuracy score")
    missing_info: List[str] = Field(..., description="Missing information")
    missing_keywords: List[str] = Field(..., description="Missing keywords")
    roadmap: List[str] = Field(..., description="Study roadmap")
    user_note: str = Field(..., description="Original user note")
    llm_note: str = Field(..., description="LLM generated note")


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Error details")