import httpx
import logging

logger = logging.getLogger(__name__)

async def generate_llm_response(transcript: str, session_id: str, api_key: str, history: dict) -> str:
    if session_id not in history:
        history[session_id] = []

    history[session_id].append({"role": "user", "parts": [{"text": transcript}]})

    gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    async with httpx.AsyncClient(timeout=20) as client:
        llm_resp = await client.post(
            gemini_url,
            json={"contents": history[session_id]},
            headers={"Content-Type": "application/json"},
            params={"key": api_key}
        )
    llm_resp.raise_for_status()
    candidate = llm_resp.json()["candidates"][0]
    llm_text = candidate["content"]["parts"][0]["text"]

    history[session_id].append({"role": "model", "parts": [{"text": llm_text}]})
    return llm_text
