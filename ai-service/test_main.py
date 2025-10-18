"""Basic tests for the application."""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_upload_pdf_no_file():
    """Test PDF upload without file."""
    response = client.post("/api/v1/upload/pdf")
    assert response.status_code == 422  # Validation error


def test_chat_nonexistent_file():
    """Test chat with nonexistent file."""
    response = client.post(
        "/api/v1/chat/",
        json={"query": "test query", "filename": "nonexistent.pdf"}
    )
    assert response.status_code == 404


def test_analysis_nonexistent_file():
    """Test analysis with nonexistent file."""
    response = client.post(
        "/api/v1/analysis/",
        json={
            "title": "Test Title",
            "text": "Test text",
            "filename": "nonexistent.pdf"
        }
    )
    assert response.status_code == 404