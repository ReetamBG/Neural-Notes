"""LLM service for chat and analysis operations."""

from typing import List

from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from langchain_openai import ChatOpenAI

from app.core.config import get_settings
from app.services.vectorstore import vectorstore_service
from app.utils.file_utils import remove_markdown_formatting

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
        
        # Enhanced system prompt for chat functionality
        enhanced_query = f"""You are an AI tutor specialized in helping students learn and understand academic material. Your role is to:

1. Explain concepts clearly and at an appropriate level for the student
2. Provide helpful, encouraging, and educational responses
3. Break down complex topics into digestible parts
4. Use examples and analogies when helpful
5. Guide students to understand rather than just providing answers
6. Be patient and supportive in your explanations
7. Keep the answers short and upto point unless long explanations are needed

IMPORTANT FORMATTING RULES:
- Do NOT use markdown formatting (no **, *, #, ##, ###, ```, -, etc.)
- Use plain text only
- For emphasis, use CAPITAL LETTERS or simple punctuation
- For lists, use simple numbering (1., 2., 3.) or bullet points with hyphens (-)
- Do not use any special formatting symbols or syntax

Always maintain a friendly, professional, and educational tone. Focus on helping the student learn and grow their understanding.

Student's question: {query}

Please provide a clear, educational response in plain text format based on the provided context material."""
        
        chain = vectorstore_service.create_qa_chain(
            self.llm, 
            Path(vector_db_path)
        )
        
        response = chain.invoke({"query": enhanced_query})
        # Remove any markdown formatting from the response if configured
        if settings.remove_markdown_formatting:
            clean_response = remove_markdown_formatting(response["result"])
            return clean_response
        return response["result"]
    
    async def get_topic_explanation(self, title: str, vector_db_path: str) -> str:
        """Get explanation for a specific topic."""
        from pathlib import Path
        
        # Enhanced prompt for topic explanation
        enhanced_query = f"""You are an AI tutor creating comprehensive study material. Please provide a detailed yet clear explanation of the topic: "{title}"

Your explanation should:
1. Define key concepts and terms
2. Explain the main principles and ideas
3. Include relevant examples where appropriate
4. Be structured and easy to understand
5. Cover the essential points a student needs to know

IMPORTANT FORMATTING RULES:
- Do NOT use markdown formatting (no **, *, #, ##, ###, ```, -, etc.)
- Use plain text only
- For emphasis, use CAPITAL LETTERS or simple punctuation
- For lists, use simple numbering (1., 2., 3.) or bullet points with hyphens (-)
- Do not use any special formatting symbols or syntax

Please explain "{title}" in plain text format in a way that would help a student learn and understand this topic thoroughly."""
        
        chain = vectorstore_service.create_qa_chain(
            self.llm, 
            Path(vector_db_path)
        )
        
        response = chain.invoke({"query": enhanced_query})
        # Remove any markdown formatting from the response if configured
        if settings.remove_markdown_formatting:
            clean_response = remove_markdown_formatting(response["result"])
            return clean_response
        return response["result"]
    
    async def find_mistakes(self, user_note: str, llm_note: str) -> str:
        """Find mistakes in user notes compared to LLM notes."""
        prompt = f"""You are an AI tutor providing constructive feedback on student notes. Your role is to help students improve their understanding and note-taking skills.

**Reference Material (What should be covered):**
{llm_note}

**Student's Notes:**
{user_note}

Please analyze the student's notes and provide feedback that:

1. **Highlights strengths**: What did the student capture well?
2. **Identifies gaps**: What important information is missing?
3. **Corrects errors**: Are there any factual mistakes or misconceptions?
4. **Suggests improvements**: How can the notes be enhanced for better learning?

IMPORTANT FORMATTING RULES:
- Do NOT use markdown formatting (no **, *, #, ##, ###, ```, -, etc.)
- Use plain text only
- For emphasis, use CAPITAL LETTERS or simple punctuation
- For lists, use simple numbering (1., 2., 3.) or bullet points with hyphens (-)
- Do not use any special formatting symbols or syntax

Provide your feedback in a supportive, educational manner that encourages learning. Focus on helping the student understand the material better rather than just pointing out what's wrong.

**Your feedback:**"""
        
        response = self.llm.invoke(prompt)
        # Remove any markdown formatting from the response if configured
        if settings.remove_markdown_formatting:
            clean_response = remove_markdown_formatting(response.content)
            return clean_response
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

        # truncating reference_text to first 500 characters for token limit (can increase if needed)
        prompt = f"""You are an AI study advisor creating a personalized learning roadmap. Your goal is to help a student fill knowledge gaps and improve their understanding.

**Context**: A student has been studying the following material:
{reference_text[:500]}{"..." if len(reference_text) > 500 else ""}  

**Missing concepts identified**: {keywords_str}

Based on this analysis, create a structured study plan that helps the student master these missing concepts. Your roadmap should:

1. **Start with fundamentals** - Begin with foundational concepts
2. **Build progressively** - Each topic should build on previous knowledge
3. **Be specific and actionable** - Use clear, concrete topic descriptions
4. **Focus on understanding** - Emphasize comprehension over memorization
5. **Be manageable** - Provide 4-8 focused study topics

Create topics that would help the student understand and master the missing concepts in a logical learning sequence.

IMPORTANT FORMATTING RULES:
- Do NOT use markdown formatting (no **, *, #, ##, ###, ```, -, etc.)
- Use plain text only in your response content
- The JSON structure is required for parsing, but avoid markdown in the topic descriptions

Please provide your response in exactly this JSON format:
{{"topics": ["Topic 1: Foundation concept", "Topic 2: Building on previous", "Topic 3: Advanced application", "..."]}}

Your study roadmap:"""
        
        response = self.llm.predict(prompt)
        try:
            parsed = parser.parse(response)
            return parsed["topics"]
        except Exception:
            # Enhanced fallback with more educational topics
            if keywords:
                fallback_topics = [
                    f"Review fundamentals of {', '.join(keywords[:3])}",
                    "Practice applying key concepts with examples",
                    "Connect new concepts to previously learned material",
                    "Test understanding through self-assessment"
                ]
                return fallback_topics[:4]
            return [
                "Review core concepts and definitions", 
                "Practice with guided examples",
                "Apply knowledge to new scenarios",
                "Self-assess understanding and identify remaining gaps"
            ]


# Global instance
llm_service = LLMService()