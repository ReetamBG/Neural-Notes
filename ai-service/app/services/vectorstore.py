"""Vector store service for document embeddings."""

from pathlib import Path
from typing import Dict, Optional

from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI

from app.core.config import get_settings
from app.services.transcription import transcription_service

settings = get_settings()


class VectorStoreService:
    """Service for managing vector stores and retrievers."""
    
    def __init__(self):
        """Initialize vector store service."""
        self._retriever_cache: Dict[str, any] = {}
        self._embeddings = HuggingFaceEmbeddings(
            model_name=settings.embedding_model
        )
        self._text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap
        )
    
    async def create_vectorstore_from_pdf(
        self, 
        file_path: Path, 
        vector_db_path: Path
    ) -> None:
        """Create vector store from PDF file."""
        vector_db_key = str(vector_db_path)
        
        if vector_db_key in self._retriever_cache:
            return
        
        # Load and process PDF
        loader = PyPDFLoader(str(file_path))
        documents = loader.load()
        
        # Split into chunks
        chunks = self._text_splitter.split_documents(documents)
        
        # Create vector store
        vectorstore = Chroma.from_documents(
            chunks, 
            self._embeddings, 
            persist_directory=str(vector_db_path)
        )
        vectorstore.persist()
        
        # Cache retriever
        retriever = vectorstore.as_retriever()
        self._retriever_cache[vector_db_key] = retriever
    
    async def create_vectorstore_from_video(
        self, 
        video_path: Path, 
        vector_db_path: Path,
        audio_path: Path
    ) -> None:
        """Create vector store from video file."""
        vector_db_key = str(vector_db_path)
        
        if vector_db_key in self._retriever_cache:
            return
        
        # Extract audio and transcribe
        await transcription_service.extract_audio_from_video(video_path, audio_path)
        transcription_text = await transcription_service.transcribe_audio(audio_path)
        
        # Create documents from transcription
        chunks = self._text_splitter.create_documents([transcription_text])
        
        # Create vector store
        vectorstore = Chroma.from_documents(
            chunks, 
            self._embeddings, 
            persist_directory=str(vector_db_path)
        )
        vectorstore.persist()
        
        # Cache retriever
        retriever = vectorstore.as_retriever()
        self._retriever_cache[vector_db_key] = retriever
    
    async def create_vectorstore_from_text(
        self, 
        text: str, 
        vector_db_path: Path
    ) -> None:
        """Create vector store from text."""
        vector_db_key = str(vector_db_path)
        
        if vector_db_key in self._retriever_cache:
            return
        
        # Create documents from text
        chunks = self._text_splitter.create_documents([text])
        
        # Create vector store
        vectorstore = Chroma.from_documents(
            chunks, 
            self._embeddings, 
            persist_directory=str(vector_db_path)
        )
        vectorstore.persist()
        
        # Cache retriever
        retriever = vectorstore.as_retriever()
        self._retriever_cache[vector_db_key] = retriever
    
    def get_retriever(self, vector_db_path: Path):
        """Get cached retriever or load from disk."""
        vector_db_key = str(vector_db_path)
        
        if vector_db_key in self._retriever_cache:
            return self._retriever_cache[vector_db_key]
        
        # Load from disk
        if not vector_db_path.exists():
            raise FileNotFoundError(f"Vector database not found: {vector_db_path}")
        
        vectorstore = Chroma(
            persist_directory=str(vector_db_path),
            embedding_function=self._embeddings
        )
        retriever = vectorstore.as_retriever()
        
        # Cache for future use
        self._retriever_cache[vector_db_key] = retriever
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