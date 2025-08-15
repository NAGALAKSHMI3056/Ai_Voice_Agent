import httpx
import logging

logger = logging.getLogger(__name__)

async def synthesize_speech(text: str, api_key: str) -> str:
    payload = {
        "text": text,
        "voice_id": "en-IN-alia",
        "audio_format": "mp3"
    }
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            "https://api.murf.ai/v1/speech/generate",
            json=payload,
            headers={"api-key": api_key, "Content-Type": "application/json"}
        )
    resp.raise_for_status()
    data = resp.json()
    return data.get("audioFile") or data.get("audio_url")
