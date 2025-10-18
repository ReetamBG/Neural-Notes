"""Audio transcription service using Vosk."""

import json
import os
import subprocess
import wave
from pathlib import Path
from typing import Optional

from vosk import KaldiRecognizer, Model

from app.core.config import get_settings

settings = get_settings()


class TranscriptionService:
    """Service for audio transcription using Vosk model."""
    
    def __init__(self, model_path: Optional[Path] = None):
        """Initialize transcription service."""
        self.model_path = model_path or settings.model_dir
        self._model: Optional[Model] = None
    
    def _load_model(self) -> Model:
        """Load Vosk model lazily."""
        if self._model is None:
            if not self.model_path.exists():
                raise FileNotFoundError(
                    f"Vosk model not found at {self.model_path}. "
                    "Please download a Vosk model."
                )
            self._model = Model(str(self.model_path))
        return self._model
    
    async def extract_audio_from_video(
        self, 
        video_path: Path, 
        audio_path: Path
    ) -> None:
        """Extract audio from video using FFmpeg."""
        command = [
            "ffmpeg", "-y", "-i", str(video_path),
            "-ar", str(settings.audio_sample_rate),
            "-ac", str(settings.audio_channels),
            "-c:a", "pcm_s16le",
            str(audio_path)
        ]
        
        result = subprocess.run(
            command, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            text=True
        )
        
        if result.returncode != 0:
            raise RuntimeError(f"FFmpeg failed: {result.stderr}")
    
    async def transcribe_audio(self, audio_path: Path) -> str:
        """Transcribe audio file to text."""
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")
        
        model = self._load_model()
        recognizer = KaldiRecognizer(model, settings.audio_sample_rate)
        
        transcription_text = ""
        
        try:
            with wave.open(str(audio_path), "rb") as wf:
                # Validate audio format
                if (wf.getnchannels() != settings.audio_channels or 
                    wf.getsampwidth() != 2 or 
                    wf.getframerate() != settings.audio_sample_rate):
                    raise ValueError(
                        f"Audio must be WAV format, mono, 16-bit, "
                        f"and {settings.audio_sample_rate}Hz"
                    )
                
                # Process audio in chunks
                while True:
                    data = wf.readframes(4000)
                    if len(data) == 0:
                        break
                    
                    if recognizer.AcceptWaveform(data):
                        result = json.loads(recognizer.Result())
                        transcription_text += " " + result.get("text", "")
                
                # Get final result
                final_result = json.loads(recognizer.FinalResult())
                transcription_text += " " + final_result.get("text", "")
        
        except Exception as e:
            raise RuntimeError(f"Transcription failed: {str(e)}")
        
        return transcription_text.strip()


# Global instance
transcription_service = TranscriptionService()