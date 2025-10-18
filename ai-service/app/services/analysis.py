"""Analysis service for text accuracy and keyword analysis."""

from typing import List, Set

import nltk
import numpy as np
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer

from app.core.config import get_settings

settings = get_settings()


class AnalysisService:
    """Service for text analysis operations."""
    
    def __init__(self):
        """Initialize analysis service."""
        self._embeddings = HuggingFaceEmbeddings(
            model_name=settings.embedding_model
        )
        self._ensure_nltk_data()
    
    def _ensure_nltk_data(self) -> None:
        """Ensure required NLTK data is available."""
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
        except LookupError:
            # Download if not available
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
    
    def calculate_accuracy(self, user_note: str, llm_note: str) -> float:
        """Calculate accuracy between user note and LLM note."""
        # Get embeddings
        embedding1 = self._embeddings.embed_query(user_note)
        embedding2 = self._embeddings.embed_query(llm_note)
        
        # Calculate cosine similarity
        similarity_score = np.dot(embedding1, embedding2) / (
            np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
        )
        
        # Apply length penalty
        len_user = len(user_note.split())
        len_llm = len(llm_note.split())
        
        if max(len_user, len_llm) > 0:
            length_penalty = 1 - abs(len_user - len_llm) / max(len_user, len_llm)
            normalized_score = similarity_score * max(0, length_penalty)
        else:
            normalized_score = similarity_score
        
        # Clamp to [0, 1]
        return max(0, min(normalized_score, 1))
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
    
    def find_missing_information(
        self, 
        user_note: str, 
        llm_note: str,
        threshold: float = None
    ) -> List[str]:
        """Find information present in LLM note but missing in user note."""
        if threshold is None:
            threshold = settings.similarity_threshold
        
        # Split into sentences
        user_sentences = [s.strip() for s in user_note.split(". ") if s.strip()]
        llm_sentences = [s.strip() for s in llm_note.split(". ") if s.strip()]
        
        if not user_sentences or not llm_sentences:
            return llm_sentences
        
        # Get embeddings for all sentences
        user_embeddings = [
            self._embeddings.embed_query(sentence) 
            for sentence in user_sentences
        ]
        llm_embeddings = [
            self._embeddings.embed_query(sentence) 
            for sentence in llm_sentences
        ]
        
        missing_info = []
        
        for i, llm_embed in enumerate(llm_embeddings):
            similarities = [
                self._cosine_similarity(llm_embed, user_embed) 
                for user_embed in user_embeddings
            ]
            max_similarity = max(similarities) if similarities else 0
            
            if max_similarity < threshold:
                missing_info.append(llm_sentences[i])
        
        return missing_info
    
    def _extract_keywords(self, text: str, top_n: int = None) -> List[str]:
        """Extract important keywords using NLTK and TF-IDF."""
        if top_n is None:
            top_n = settings.top_keywords
        
        # Tokenize and remove stopwords
        try:
            words = word_tokenize(text.lower())
            stop_words = set(stopwords.words("english"))
            words = [
                word for word in words 
                if word.isalnum() and word not in stop_words
            ]
        except Exception:
            # Fallback if NLTK fails
            words = [
                word.lower() for word in text.split() 
                if word.isalnum()
            ]
        
        # TF-IDF keyword extraction
        try:
            vectorizer = TfidfVectorizer(
                stop_words="english", 
                max_features=10
            )
            vectorizer.fit_transform([text])
            tfidf_keywords = set(vectorizer.get_feature_names_out())
        except Exception:
            tfidf_keywords = set()
        
        # Combine tokenized words + TF-IDF keywords
        keywords = set(words).union(tfidf_keywords)
        return list(keywords)[:top_n]
    
    def find_missing_keywords(self, user_note: str, llm_note: str) -> Set[str]:
        """Find keywords in LLM note that are missing in user note."""
        llm_keywords = set(self._extract_keywords(llm_note))
        user_keywords = set(self._extract_keywords(user_note))
        
        return llm_keywords - user_keywords


# Global instance
analysis_service = AnalysisService()