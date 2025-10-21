# Neural Notes - AI Service

FastAPI backend service providing AI-powered document processing, semantic search, and educational analysis for the Neural Notes platform.

## 🛠️ Tech Stack

- **Framework**: FastAPI with async support
- **AI/ML**: LangChain, OpenAI (via OpenRouter), HuggingFace Transformers
- **Vector Database**: ChromaDB for semantic search
- **Speech Recognition**: Vosk (offline)
- **Text Processing**: NLTK, scikit-learn
- **File Processing**: PyPDF, FFmpeg

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ (recommended: Python 3.10+)
- FFmpeg (system dependency for video processing)
- OpenRouter API key (for LLM access)

### Detailed Setup

1. **Navigate to ai-service directory**:
   ```bash
   cd ai-service
   ```

2. **Install system dependencies**:
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install ffmpeg
   
   # macOS with Homebrew
   brew install ffmpeg
   
   # Windows (download from https://ffmpeg.org/download.html)
   # Add to PATH after installation
   ```

3. **Set up Python virtual environment**:
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   source venv/bin/activate  # Linux/macOS
   # OR
   venv\Scripts\activate     # Windows
   ```

4. **Install Python dependencies**:
   ```bash
   # Install requirements
   pip install -r requirements.txt
   ```

5. **Download required models**:
   ```bash
   # NLTK data (automatic on first run, or manual):
   python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
   
   # Vosk model should be in: vosk-model-small-en-us-0.15/
   # Download if missing from: https://alphacephei.com/vosk/models
   ```

6. **Environment configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Configure the following in `.env`:
   ```env
   # OpenRouter API (Required)
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

7. **Create required directories**:
   ```bash
   mkdir -p data/uploads data/vector_dbs data/extracted_audios
   ```

8. **Run the service**:
   ```bash
   # Development mode 
   python run.py
   
   # OR production mode
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

9. **Verify installation**:
   - Service: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/api/v1/health

## 📡 API Endpoints

### File Upload
- `POST /api/v1/upload/pdf` - Process PDF documents
- `POST /api/v1/upload/video` - Process video files with transcription

### Chat & Tutoring  
- `POST /api/v1/chat/` - Chat with uploaded documents
- `POST /api/v1/chat/notes` - Chat with user notes
- `POST /api/v1/chat/upload-notes` - Upload notes for tutoring

### Analysis
- `POST /api/v1/analysis/` - Analyze note accuracy and generate insights and roadmap

### Health
- `GET /api/v1/health` - Service health check

## ⚙️ Configuration

All app configuration in `app/core/config.py`:

## 🔧 Technical Details

**Processing Pipeline**:
- PDF → Text extraction → Semantic chunking → Vector embeddings
- Video → Audio extraction → Vosk transcription → Vector embeddings
- Analysis → Similarity scoring → Gap detection → Roadmap generation


## � Development Workflow

### Running in Development
```bash
# Activate virtual environment
source venv/bin/activate

# Start with auto-reload
python run.py

# OR with uvicorn directly
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Testing the API
```bash
# Health check
curl http://localhost:8000/api/v1/health

# Upload a PDF
curl -X POST "http://localhost:8000/api/v1/upload/pdf" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@sample.pdf"

# Chat with document
curl -X POST "http://localhost:8000/api/v1/chat/" \
     -H "Content-Type: application/json" \
     -d '{"query": "What is this document about?", "filename": "sample.pdf"}'
```

### Code Quality
```bash
# Format code
black app/

# Sort imports
isort app/

# Lint code
flake8 app/

# Run tests
pytest tests/
```

## 🐛 Troubleshooting

### Installation Issues

**FFmpeg not found**:
```bash
# Verify installation
ffmpeg -version

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# macOS
brew install ffmpeg
```

**Python dependencies fail**:
```bash
# Update pip and setuptools
pip install --upgrade pip setuptools wheel

# Install with verbose output
pip install -r requirements.txt -v
```

### Runtime Issues

**Vosk model missing**:
```bash
# Error: Model path 'vosk-model-small-en-us-0.15' does not exist
# Download from: https://alphacephei.com/vosk/models
# Extract to ai-service directory
```

**OpenRouter API errors**:
```bash
# Verify API key in .env
echo $OPENROUTER_API_KEY

# Test API key
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
     https://openrouter.ai/api/v1/models
```

**Large file upload issues**:
```bash
# Increase MAX_UPLOAD_SIZE in `app/core/config.py`
max_upload_size: 100 * 1024 * 1024  # 100MB

# Check disk space
df -h ./data/
```

**Vector database issues**:
```bash
# Clear vector database cache
rm -rf data/vector_dbs/*

# Restart service after clearing cache
```