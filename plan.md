## Plan: Local YouTube AI Summarizer

An iterative, step-by-step implementation of a local YouTube audio downloader, transcriber, and summarizer. Designed to build front-end and back-end in tandem so you see tangible UI progress at every stage.

**Steps**

**Phase 1: The Foundation (Project Skeleton)**
1. **Backend:** Initialize a FastAPI project. Create a mock endpoint `/process` that accepts a YouTube URL and returns a fake success message after a 2-second sleep.
2. **Frontend:** Initialize React with Vite. Build a simple UI with a text input for the URL, a submit button, and a status text area. Connect it to the backend endpoint and handle CORS.

**Phase 2: The Downloader (`yt-dlp`)**
1. **Backend:** Integrate the `yt-dlp` Python library. Update the `/process` endpoint to actually download the audio (MP3) of the provided URL to a local `downloads/` folder.
2. **Frontend:** Update the UI to show a "Downloading..." loading spinner. Once complete, display the file name and size of the downloaded audio.

**Phase 3: Asynchronous Jobs (Unfreezing the UI)**
1. **Backend:** Downloading takes time and blocks the API. Refactor using FastAPI's `BackgroundTasks`. Create two new endpoints: `POST /jobs` (starts the download and returns a `job_id`) and `GET /jobs/{job_id}` (returns the current status: 'pending', 'downloading', 'completed').
2. **Frontend:** Change the submit action to get a `job_id`, then implement polling (e.g., `setInterval`) to ping the status endpoint every 2 seconds. Update the UI prominently with live status changes. 

**Phase 4: Local Transcription (Whisper)**
1. **Backend:** Install the `openai-whisper` library. Add a transcription step to your background worker that runs immediately after the MP3 is downloaded. Save the transcript (with timestamps) to a `.txt` or `.json` file. Update the job status to 'transcribing' and then 'completed' with the transcript text.
2. **Frontend:** Add a new section below the download status called "Transcript". When the job finishes, render the full transcript text, formatting the timestamps beautifully.

**Phase 5: Local AI Summarization (Ollama)**
1. **Backend:** Install Ollama locally and download the `llama3` model. Add the final step to your background worker: send the generated transcript to the local Ollama API (via `requests` or an Ollama python library) with a prompt like "Summarize this transcript into key bullet points".
2. **Frontend:** Add a "Summary" panel to the UI. Once the job is fully complete, display the AI-generated bullet points.
3. **Frontend Bonus:** Add a feature to let the user type custom questions ("Ask the AI about this video") which triggers a new endpoint to query Ollama with the transcript as context.

**Responsibilities Summary**
- **Frontend (React/Vite):** State management (URL input, polling interval, loading spinners), UI component rendering (Status, Transcript, Summary), and error handling (if backend fails).
- **Backend (FastAPI):** Request validation, file system management (saving/cleaning up MP3s and transcripts), background task orchestration, and wrapping external/heavy libraries (`yt-dlp`, Whisper, Ollama) into a digestible REST API.

**Verification**
1. Test Phase 1 with a fake URL to ensure React and FastAPI talk to each other.
2. Test Phase 2 with a short (<2 min) video to verify the MP3 drops into the correct folder.
3. Test Phase 3 with a longer video (10+ min) to verify the frontend doesn't freeze and polls correctly.
4. Test Phases 4 & 5 to verify text and summary appear without crashing the machine (monitor RAM/CPU usage).

**Decisions**
- Deliberately use naive `BackgroundTasks` and polling first instead of WebSockets or heavy task queues (like Celery) to keep the learning curve manageable without complicating your initial infra setup.