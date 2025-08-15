import asyncio
import httpx
import logging

logger = logging.getLogger(__name__)

async def transcribe_audio(audio_path, api_key: str) -> str:
    headers = {"authorization": api_key}
    audio_bytes = audio_path.read_bytes()

    async with httpx.AsyncClient() as client:
        up_resp = await client.post("https://api.assemblyai.com/v2/upload", content=audio_bytes, headers=headers)
    up_resp.raise_for_status()
    audio_url = up_resp.json()["upload_url"]

    t_payload = {"audio_url": audio_url}
    async with httpx.AsyncClient() as client:
        tr_resp = await client.post("https://api.assemblyai.com/v2/transcript", json=t_payload, headers=headers)
    tr_resp.raise_for_status()
    transcript_id = tr_resp.json()["id"]

    status = ""
    while status not in ("completed", "error"):
        await asyncio.sleep(2)
        async with httpx.AsyncClient() as client:
            poll = await client.get(f"https://api.assemblyai.com/v2/transcript/{transcript_id}", headers=headers)
        poll.raise_for_status()
        status = poll.json()["status"]

    if status != "completed":
        raise Exception("Transcription failed.")
    return poll.json()["text"]
