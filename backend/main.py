from fastapi import FastAPI, HTTPException, Response, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from downloader import download_video
from fastapi.responses import FileResponse
from pydantic import BaseModel
from downloader import transcribe_audio
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["x-file-path", "Content-Disposition", "x-thumbnail-url"]
)

class VideoRequest(BaseModel):
    url: str

@app.post("/get_video")
def api_download_video(req: VideoRequest):
    try:
        result = download_video(req.url, output_path="./downloads")
        response = FileResponse(result["file_path"], media_type="audio/mpeg", filename=f"{result['title']}.mp3")
        response.headers["x-file-path"] = result["file_path"]
        if result.get("thumbnail"):
            response.headers["x-thumbnail-url"] = result["thumbnail"]
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/transcryption")
def api_transcribe_audio(file_path: str):
    try:
        return transcribe_audio(file_path)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/transcryption")
def api_transcribe_audio(file_path: str):
    try:
        return transcribe_audio(file_path)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/upload_audio")
def api_upload_audio(file: UploadFile = File(...)):
    try:
        os.makedirs("./downloads", exist_ok=True)
        file_path = f"./downloads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"file_path": file_path, "message": "File uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
