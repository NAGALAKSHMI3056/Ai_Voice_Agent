# 🎙️ AI Voice Agent

## Project Overview
The AI Voice Agent is a web-based conversational assistant that lets you speak naturally, processes your voice in real time, and replies with synthesized speech—all in a single-page, responsive interface. Built as part of the **#30DaysOfAIVoiceAgents** challenge, the project demonstrates seamless integration of speech-to-text, large-language modeling, and text-to-speech services to create an end-to-end voice experience.  

Every interaction feels fluid: you press a single button to record, the backend pipelines your audio through transcription and LLM services, and you immediately hear a spoken reply without needing to refresh or navigate away.

---
## Technologies Used

| Layer       | Technology                   | Purpose                                     |
|-------------|------------------------------|---------------------------------------------|
| Frontend    | HTML · CSS · JavaScript      | Audio capture, UI rendering, and interactivity |
| Backend     | FastAPI · Python · httpx     | REST endpoints, async HTTP requests         |
| STT         | AssemblyAI                   | Speech-to-text transcription                |
| LLM         | Google Gemini 2.5 Flash      | Multi-turn conversational intelligence      |
| TTS         | Murf TTS                     | High-quality text-to-speech synthesis       |
| Dev Tools   | Uvicorn · python-dotenv      | Local server hosting and environment management |

---
## Architecture
```
Browser UI
  └─ Record button captures WebM audio stream
      ↓
FastAPI Server
  ├─ Uploads audio to AssemblyAI (polling for transcript)
  ├─ Sends transcript + chat history to Gemini LLM
  └─ Forwards Gemini’s text reply to Murf TTS
      ↓
Murf TTS returns MP3 audio
  └─ Browser auto-plays response and updates chat history
```
- Audio files are temporarily stored under `uploads/` for asynchronous processing.  
- All network calls are non-blocking, leveraging `async`/`await` to keep the UI snappy.  
- Chat state (user prompts + AI replies) is stored in memory per session for multi-turn context.
---
## Key Features
- **Single-Button Recording**  
  A unified “Start / Stop / Processing” control with animated feedback and status indicators.
- **Real-Time Transcription**  
  High-accuracy speech-to-text powered by AssemblyAI, streamed back to the UI as soon as it’s ready.
- **Multi-Turn Conversation**  
  Maintains context across exchanges with Google’s Gemini 2.5 Flash model to deliver coherent, follow-up responses.
- **Text-to-Speech Playback**  
  Converts AI replies into natural-sounding audio via Murf TTS and auto-plays them in the browser.
- **Graceful Fallbacks**  
  Detects API failures or missing keys, displays informative messages, and plays a built-in fallback audio clip.
- **Persistent Chat History**  
  Dynamically appends each question and reply to the page, allowing you to review the conversation until page refresh.
- **Animated, Gradient UI**  
  Clean, minimal layout with subtle animations, gradient backgrounds, and responsive design for all devices.
---
# ⚙️ Running the AI Voice Agent & API Server
Follow these steps to set up, configure, and run the complete voice-agent stack on your local machine.
---
## 1. Clone or Prepare Project Files
1. Place all project files in a single folder on your machine.  
2. Verify the structure looks like this:
   ```
    project-root/
    ├── .env
    ├── main.py
    ├── schemas.py
    ├── services/
    │   ├── stt.py
    │   ├── llm.py
    │   └── tts.py
    ├── static/
    │   ├── recorder.js
    │   ├── index.html
    │   └── favicon.ico
    ├── uploads/  ← auto-created at runtime 
   ```
---
## 2. Create & Activate a Python Virtual Environment
```bash
# macOS / Linux
python3 -m venv venv
source venv/bin/activate
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1
```
---
## 3. Install Dependencies
```bash
pip install -r requirements.txt
```
This will install:
- fastapi  
- uvicorn  
- httpx  
- python-dotenv  
- any other listed packages
---
## 4. Set Environment Variables
Create a file named `.env` in your project’s root directory with **all** the following keys:
```
ASSEMBLY_API_KEY=your_assemblyai_key
GEMINI_API_KEY=your_gemini_key
MURF_API_KEY=your_murf_key
```
• ASSEMBLY_API_KEY: AssemblyAI transcription API key  
• GEMINI_API_KEY: Google Gemini LLM API key  
• MURF_API_KEY: Murf TTS API key  
---
## 5. Verify Fallback Audio
Ensure the fallback file lives at `static/fallback.mp3`. This clip plays automatically if any external service fails.
---
## 6. Launch the Server
```bash
uvicorn main:app --reload
```
- The `--reload` flag watches for code changes and restarts automatically.  
- By default, the API will be available at `http://localhost:8000`.
---
## 7. Use the App
1. Open your browser to `http://localhost:8000`.  
2. Click the central record button to Start → Stop → Processing.  
3. Watch your speech transcribe, then hear the AI reply instantly.  
4. Scroll through the persistent chat history on the same page.  
---
# ▶️ Next Steps & Tips
- To test error handling, temporarily remove or invalidate one of the keys in `.env`.  
- For production, consider:
  - Adding HTTPS (e.g., via Traefik or NGINX)  
  - Deploying on a cloud VM or container platform  
  - Persisting chat history in a lightweight database (SQLite, Redis)  
  - Customizing UI themes or swapping in alternative voices  
Feel free to iterate, share your tweaks on LinkedIn, and keep building on this modular foundation!
