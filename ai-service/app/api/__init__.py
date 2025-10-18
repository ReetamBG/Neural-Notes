"""API package initialization."""

from fastapi import APIRouter

from . import analysis, chat, upload

# Create main API router
api_router = APIRouter(prefix="/api/v1")

# Include all sub-routers
api_router.include_router(upload.router)
api_router.include_router(chat.router)
api_router.include_router(analysis.router)

# Health check endpoint
@api_router.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

__all__ = ["api_router"]