"""Custom middleware for the application."""

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import get_settings

settings = get_settings()


class FileSizeValidationMiddleware(BaseHTTPMiddleware):
    """Middleware to validate file upload size."""
    
    async def dispatch(self, request: Request, call_next):
        """Validate file size before processing."""
        if request.headers.get("content-length"):
            content_length = int(request.headers["content-length"])
            if content_length > settings.max_upload_size:
                return JSONResponse(
                    {"error": "File too large"},
                    status_code=413
                )
        
        return await call_next(request)