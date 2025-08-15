from pydantic import BaseModel

class AudioResponse(BaseModel):
    transcript: str
    llm_text: str
    audio_url: str
