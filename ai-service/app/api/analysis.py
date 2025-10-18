"""API endpoints for analysis operations."""

from pathlib import Path

from fastapi import APIRouter, HTTPException, status

from app.core.config import get_settings
from app.models import AnalysisRequest, AnalysisResponse
from app.services import analysis_service, llm_service

settings = get_settings()
router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post(
    "/",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze text accuracy",
    description="Analyze user text against reference material for accuracy and missing information"
)
async def analyze_text(request: AnalysisRequest):
    """Analyze user text for accuracy and missing information."""
    vector_db_path = settings.vector_db_dir / request.filename
    
    if not vector_db_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{request.filename}' not found. Please upload it first."
        )
    
    try:
        # Get LLM explanation for the title
        llm_note = await llm_service.get_topic_explanation(
            request.title,
            str(vector_db_path)
        )
        
        # Calculate accuracy
        accuracy = analysis_service.calculate_accuracy(
            request.text, 
            llm_note
        )
        
        # Find missing information
        missing_info = analysis_service.find_missing_information(
            request.text,
            llm_note
        )
        
        # Find missing keywords
        missing_keywords_set = analysis_service.find_missing_keywords(
            request.text,
            llm_note
        )
        missing_keywords = list(missing_keywords_set)
        
        # Generate study roadmap
        roadmap = await llm_service.get_study_roadmap(
            missing_keywords,
            llm_note
        )
        
        return AnalysisResponse(
            accuracy=accuracy,
            missing_info=missing_info,
            missing_keywords=missing_keywords,
            roadmap=roadmap,
            user_note=request.text,
            llm_note=llm_note
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )