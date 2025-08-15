const recordBtn = document.getElementById("record-btn");
const status = document.getElementById("status");
const loader = document.getElementById("loader");
const chatHistory = document.getElementById("chat-history");

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

recordBtn.addEventListener("click", async () => {
  if (isRecording) {
    mediaRecorder.stop();
    recordBtn.disabled = true;
    recordBtn.textContent = "⏳ Processing...";
    status.textContent = "⏳ Processing...";
    loader.style.display = "inline";
    recordBtn.classList.remove("pulse");
    isRecording = false;
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      try {
        const response = await fetch("/llm/query", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Server error");

        const data = await response.json();

        const entry = document.createElement("div");
        entry.className = "chat-entry";

        const inputBox = document.createElement("div");
        inputBox.className = "input-box";
        inputBox.innerHTML = `<strong>You said:</strong><br>${data.transcript}`;

        const outputBox = document.createElement("div");
        outputBox.className = "output-box";
        outputBox.innerHTML = `<strong>Gemini replied:</strong><br>${data.llm_text}`;

        const timestamp = new Date().toLocaleTimeString();
        const timeBox = document.createElement("div");
        timeBox.className = "timestamp";
        timeBox.textContent = timestamp;

        entry.appendChild(inputBox);
        entry.appendChild(outputBox);
        entry.appendChild(timeBox);
        chatHistory.prepend(entry);
        entry.scrollIntoView({ behavior: "smooth" });

        try {
          const audio = new Audio(data.audio_url);
          await audio.play();
        } catch (e) {
          console.warn("Audio playback failed:", e);
          status.textContent += " ⚠️ Audio playback issue.";
        }

        status.textContent = data.error ? `⚠️ ${data.error}` : "✅ Response ready!";
      } catch (err) {
        console.error(err);
        status.textContent = `❌ ${err.message || "Unknown error"}`;
      } finally {
        recordBtn.disabled = false;
        recordBtn.textContent = "🎤 Start Recording";
        recordBtn.classList.add("pulse");
        loader.style.display = "none";
      }
    };

    mediaRecorder.start();
    recordBtn.textContent = "⏹️ Stop Recording";
    status.textContent = "🎙️ Recording...";
    loader.style.display = "none";
    recordBtn.classList.remove("pulse");
    isRecording = true;
  } catch (err) {
    console.error("Mic access failed:", err);
    status.textContent = "❌ Microphone access denied.";
  }
});
