"""Vector store service for document embeddings."""

from pathlib import Path
from typing import Optional

from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI

from app.core.config import get_settings
from app.services.transcription import transcription_service

settings = get_settings()


class VectorStoreService:
    """Service for managing vector stores and retrievers."""
    
    def __init__(self):
        """Initialize vector store service."""
        self._embeddings = HuggingFaceEmbeddings(
            model_name=settings.embedding_model
        )
        self._text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap
        )
    
    def _cleanup_vector_db(self, vector_db_path: Path) -> None:
        """Safely remove existing vector database directory."""
        if not vector_db_path.exists():
            return
            
        import shutil
        import os
        import time
        
        # Try multiple aggressive cleanup strategies
        for attempt in range(3):
            try:
                # Strategy 1: Force remove with elevated permissions
                if vector_db_path.exists():
                    for root, dirs, files in os.walk(vector_db_path, topdown=False):
                        for file in files:
                            file_path = os.path.join(root, file)
                            try:
                                os.chmod(file_path, 0o777)
                                os.remove(file_path)
                            except:
                                pass
                        for dir in dirs:
                            try:
                                os.chmod(os.path.join(root, dir), 0o777)
                                os.rmdir(os.path.join(root, dir))
                            except:
                                pass
                    
                    # Remove the main directory
                    try:
                        os.chmod(vector_db_path, 0o777)
                        os.rmdir(vector_db_path)
                    except:
                        # If rmdir fails, try shutil.rmtree
                        try:
                            shutil.rmtree(vector_db_path, ignore_errors=True)
                        except:
                            pass
                
                # Check if cleanup was successful
                if not vector_db_path.exists():
                    break
                    
                # Wait a bit before next attempt
                time.sleep(0.1)
                
            except Exception:
                pass
        
        # Final fallback: rename the directory to avoid conflicts
        if vector_db_path.exists():
            try:
                backup_path = vector_db_path.parent / f"{vector_db_path.name}_backup_{int(time.time())}"
                os.rename(vector_db_path, backup_path)
            except:
                pass
    
    def _create_db_pointer(self, base_path: Path, actual_path: Path) -> None:
        """Create a pointer file to the actual database location."""
        pointer_file = base_path / ".db_location"
        base_path.mkdir(parents=True, exist_ok=True)
        
        with open(pointer_file, 'w') as f:
            f.write(str(actual_path))
    
    def _get_actual_db_path(self, base_path: Path) -> Path:
        """Get the actual database path from pointer file."""
        pointer_file = base_path / ".db_location"
        
        if pointer_file.exists():
            with open(pointer_file, 'r') as f:
                actual_path = Path(f.read().strip())
                if actual_path.exists():
                    return actual_path
        
        # Fallback to base path if no pointer or path doesn't exist
        return base_path
    
    async def create_vectorstore_from_pdf(
        self, 
        file_path: Path, 
        vector_db_path: Path
    ) -> None:
        """Create vector store from PDF file."""
        import time
        
        # Clean up any existing database
        self._cleanup_vector_db(vector_db_path)
        
        # Create a unique subdirectory to avoid any conflicts
        unique_path = vector_db_path / f"db_{int(time.time() * 1000)}"
        
        # Ensure parent directory exists with proper permissions
        unique_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Load and process PDF
        loader = PyPDFLoader(str(file_path))
        documents = loader.load()
        
        # Split into chunks
        chunks = self._text_splitter.split_documents(documents)
        
        # Create vector store with unique path
        vectorstore = Chroma.from_documents(
            chunks, 
            self._embeddings, 
            persist_directory=str(unique_path)
        )
        
        # Create a symlink or marker to the actual database
        self._create_db_pointer(vector_db_path, unique_path)
    
    async def create_vectorstore_from_video(
        self, 
        video_path: Path, 
        vector_db_path: Path,
        audio_path: Path
    ) -> None:
        """Create vector store from video file."""
        import time
        
        # Clean up any existing database
        self._cleanup_vector_db(vector_db_path)
        
        # Create a unique subdirectory to avoid any conflicts
        unique_path = vector_db_path / f"db_{int(time.time() * 1000)}"
        
        # Ensure parent directory exists with proper permissions
        unique_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Extract audio and transcribe
        await transcription_service.extract_audio_from_video(video_path, audio_path)
        transcription_text = await transcription_service.transcribe_audio(audio_path)
        
        # Create documents from transcription
        chunks = self._text_splitter.create_documents([transcription_text])
        
        # Create vector store with unique path
        vectorstore = Chroma.from_documents(
            chunks, 
            self._embeddings, 
            persist_directory=str(unique_path)
        )
        
        # Create a pointer to the actual database
        self._create_db_pointer(vector_db_path, unique_path)
    
    async def create_vectorstore_from_text(
        self, 
        text: str, 
        vector_db_path: Path
    ) -> None:
        """Create vector store from text."""
        import time
        
        # Clean up any existing database
        self._cleanup_vector_db(vector_db_path)
        
        # Create a unique subdirectory to avoid any conflicts
        unique_path = vector_db_path / f"db_{int(time.time() * 1000)}"
        
        # Ensure parent directory exists with proper permissions
        unique_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Create documents from text
        chunks = self._text_splitter.create_documents([text])
        
        # Create vector store with unique path
        vectorstore = Chroma.from_documents(
            chunks, 
            self._embeddings, 
            persist_directory=str(unique_path)
        )
        
        # Create a pointer to the actual database
        self._create_db_pointer(vector_db_path, unique_path)
    
    def get_retriever(self, vector_db_path: Path):
        """Load retriever from disk - no caching."""
        # Get the actual database path
        actual_db_path = self._get_actual_db_path(vector_db_path)
        
        if not actual_db_path.exists():
            raise FileNotFoundError(f"Vector database not found: {vector_db_path}")
        
        vectorstore = Chroma(
            persist_directory=str(actual_db_path),
            embedding_function=self._embeddings
        )
        retriever = vectorstore.as_retriever()
        
        return retriever
    
    def create_qa_chain(self, llm: ChatOpenAI, vector_db_path: Path) -> RetrievalQA:
        """Create a RetrievalQA chain."""
        retriever = self.get_retriever(vector_db_path)
        
        return RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever
        )


# Global instance
vectorstore_service = VectorStoreService()