# ML API - Document Analysis and Chat System

A FastAPI-based machine learning API that provides document analysis, chat functionality, and educational assessment features.

## Features

- **Document Processing**: Upload and process PDF files and videos
- **RAG Chat**: Chat with your documents using Retrieval-Augmented Generation
- **Text Analysis**: Analyze text accuracy, find missing information, and generate study roadmaps
- **Multi-format Support**: PDF documents and video files (with audio transcription)
- **Vector Search**: Efficient semantic search using ChromaDB and HuggingFace embeddings

## Project Structure

```
ML_API/
├── app/
│   ├── api/                 # API endpoints
│   │   ├── analysis.py      # Text analysis endpoints
│   │   ├── chat.py          # Chat endpoints
│   │   └── upload.py        # File upload endpoints
│   ├── core/                # Core configuration
│   │   ├── config.py        # Application settings
│   │   └── middleware.py    # Custom middleware
│   ├── models/              # Pydantic models
│   │   └── schemas.py       # Request/response schemas
│   ├── services/            # Business logic
│   │   ├── analysis.py      # Text analysis service
│   │   ├── llm.py          # LLM service
│   │   ├── transcription.py # Audio transcription
│   │   └── vectorstore.py   # Vector database service
│   ├── utils/               # Utility functions
│   │   └── file_utils.py    # File handling utilities
│   └── main.py              # FastAPI application
├── vosk-model-small-en-us-0.15/  # Vosk speech recognition model
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── run.py                  # Application entry point
```

## Installation

1. **Clone the repository**
   ```bash
   cd /path/to/ML_API
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate     # Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install system dependencies**
   - **FFmpeg** (required for video processing):
     ```bash
     # Ubuntu/Debian
     sudo apt update && sudo apt install ffmpeg
     
     # macOS
     brew install ffmpeg
     
     # Windows
     # Download from https://ffmpeg.org/download.html
     ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenRouter API key
   ```

6. **Download NLTK data** (if needed)
   ```python
   import nltk
   nltk.download('punkt')
   nltk.download('stopwords')
   ```

## Configuration

Edit the `.env` file with your settings:

```env
OPENROUTER_API_KEY="your_api_key_here"
DEBUG=true
MAX_UPLOAD_SIZE=52428800
# ... other settings
```

## Running the Application

### Development Mode
```bash
python run.py
```

### Production Mode
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- **Main API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### File Upload
- `POST /api/v1/upload/pdf` - Upload PDF file
- `POST /api/v1/upload/video` - Upload video file

### Chat
- `POST /api/v1/chat/` - Chat with uploaded document
- `POST /api/v1/chat/notes` - Chat with uploaded notes
- `POST /api/v1/chat/upload-notes` - Upload text notes

### Analysis
- `POST /api/v1/analysis/` - Analyze text accuracy and generate insights

### Health Check
- `GET /api/v1/health` - Health status

## Usage Examples

### 1. Upload a PDF
```bash
curl -X POST "http://localhost:8000/api/v1/upload/pdf" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@document.pdf"
```

### 2. Chat with Document
```bash
curl -X POST "http://localhost:8000/api/v1/chat/" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "What is the main topic of this document?",
       "filename": "document.pdf"
     }'
```

### 3. Analyze Text
```bash
curl -X POST "http://localhost:8000/api/v1/analysis/" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Machine Learning Basics",
       "text": "Machine learning is a subset of AI...",
       "filename": "ml_textbook.pdf"
     }'
```

## Key Features Explained

### Document Processing
- **PDF**: Extracts text and creates searchable embeddings
- **Video**: Extracts audio → transcribes with Vosk → creates embeddings

### Text Analysis
- **Accuracy Score**: Cosine similarity between user text and reference material
- **Missing Information**: Identifies content gaps using semantic similarity
- **Missing Keywords**: TF-IDF and NLTK-based keyword extraction
- **Study Roadmap**: AI-generated study suggestions based on gaps

### Performance Optimizations
- **Caching**: Vector stores and retrievers are cached for faster access
- **Async Processing**: Non-blocking operations for better performance
- **Chunked Processing**: Efficient handling of large documents

## Dependencies

### Core Framework
- **FastAPI**: Modern, fast web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation using Python type hints

### ML & AI
- **LangChain**: LLM application framework
- **OpenAI**: LLM integration via OpenRouter
- **HuggingFace**: Sentence transformers for embeddings
- **ChromaDB**: Vector database for semantic search

### Audio/Video Processing
- **Vosk**: Offline speech recognition
- **FFmpeg**: Audio/video processing (system dependency)

### Text Processing
- **NLTK**: Natural language processing
- **scikit-learn**: TF-IDF vectorization
- **PyPDF**: PDF text extraction

## Error Handling

The API includes comprehensive error handling:
- **400**: Bad Request (invalid file format, malformed request)
- **404**: Not Found (document not uploaded)
- **413**: Payload Too Large (file size limit exceeded)
- **500**: Internal Server Error (processing failures)

## Development

### Code Style
- **Black**: Code formatting
- **isort**: Import sorting
- **Flake8**: Linting

### Testing
```bash
pytest tests/
```

### Project Principles
- **Separation of Concerns**: Clear service layer separation
- **Type Safety**: Full type hints with Pydantic models
- **Async/Await**: Non-blocking operations
- **Configuration Management**: Environment-based settings
- **Error Handling**: Comprehensive exception management

## Troubleshooting

### Common Issues

1. **FFmpeg not found**
   ```
   Solution: Install FFmpeg system-wide
   ```

2. **Vosk model missing**
   ```
   Error: Model path 'vosk-model-small-en-us-0.15' does not exist
   Solution: Ensure the Vosk model directory is present
   ```

3. **Large file uploads**
   ```
   Error: File too large
   Solution: Adjust MAX_UPLOAD_SIZE in .env
   ```

4. **OpenRouter API errors**
   ```
   Solution: Check OPENROUTER_API_KEY in .env
   ```

## Contributing

1. Follow the existing code structure
2. Add type hints to all functions
3. Use async/await for I/O operations
4. Add proper error handling
5. Update tests for new features

## License

[Add your license here]