"""LLM service for chat and analysis operations."""

from typing import List

from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from langchain_openai import ChatOpenAI

from app.core.config import get_settings
from app.services.vectorstore import vectorstore_service

settings = get_settings()


class LLMService:
    """Service for LLM operations."""
    
    def __init__(self):
        """Initialize LLM service."""
        self.llm = self._initialize_llm()
    
    def _initialize_llm(self) -> ChatOpenAI:
        """Initialize the LLM client."""
        return ChatOpenAI(
            model=settings.default_model,
            openai_api_key=settings.openrouter_api_key,
            openai_api_base=settings.openrouter_base_url
        )
    
    async def chat(self, query: str, vector_db_path: str) -> str:
        """Chat with the LLM using vector database context."""
        from pathlib import Path
        
        chain = vectorstore_service.create_qa_chain(
            self.llm, 
            Path(vector_db_path)
        )
        
        response = chain.invoke({"query": query})
        return response["result"]
    
    async def get_topic_explanation(self, title: str, vector_db_path: str) -> str:
        """Get explanation for a specific topic."""
        from pathlib import Path
        
        chain = vectorstore_service.create_qa_chain(
            self.llm, 
            Path(vector_db_path)
        )
        
        response = chain.invoke({"query": f"explain {title}"})
        return response["result"]
    
    async def find_mistakes(self, user_note: str, llm_note: str) -> str:
        """Find mistakes in user notes compared to LLM notes."""
        prompt = (
            f"You are a tutor. The following paragraph contains the facts: {llm_note}\n"
            f"Your student wrote: {user_note}\n"
            f"Rectify their mistakes and provide corrections."
        )
        
        response = self.llm.invoke(prompt)
        return response.content
    
    async def get_study_roadmap(
        self, 
        keywords: List[str], 
        reference_text: str
    ) -> List[str]:
        """Generate study roadmap based on missing keywords."""
        schema = [
            ResponseSchema(name="topics", description="List of study topics")
        ]
        parser = StructuredOutputParser.from_response_schemas(schema)
        
        keywords_str = ", ".join(keywords)
        prompt = (
            f"You are a tutor. The keywords '{keywords_str}' were found missing "
            f"in the student's notes about: '{reference_text}'.\n"
            f"Suggest study topics that cover these missing areas.\n"
            f"Provide only a JSON list format like this: "
            f'{{"topics": ["Topic1", "Topic2", "Topic3"]}}'
        )
        
        response = self.llm.predict(prompt)
        try:
            parsed = parser.parse(response)
            return parsed["topics"]
        except Exception:
            # Fallback if parsing fails
            return ["Review missing concepts", "Study fundamental principles"]


# Global instance
llm_service = LLMService()