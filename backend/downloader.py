import typing
import yt_dlp
from yt_dlp.utils import DownloadError, ExtractorError, GeoRestrictedError, MaxDownloadsReached, PostProcessingError, UnavailableVideoError

def download_video(url: str, output_path: str) -> typing.Dict[str, typing.Any]:
    ydl_opts: typing.Dict[str, typing.Any] = {
        "format":"bestaudio/best",
        "noplaylist": True,
        "restrictfilenames": True,
        "ffmpeg_location": r"C:\ProgramData\chocolatey\bin",
        "outtmpl": f"{output_path}/%(title)s.%(ext)s",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],       
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl: # type: ignore
            info = ydl.extract_info(url, download=True)
            
            
            downloads = info.get("requested_downloads")
            if downloads and downloads[0].get("filepath"):
                file_path = downloads[0]["filepath"]
            else:
                file_path = ydl.prepare_filename(info).rsplit('.', 1)[0] + ".mp3"
                
            return {
                "title": info.get("title", "Unknown"),
                "channel": info.get("uploader", "Unknown"),
                "file_path": file_path,
                "thumbnail": info.get("thumbnail", ""),
                "success": True
            }
    except DownloadError as e:
        raise ValueError(f"Download error: {e}")
    except ExtractorError as e:
        raise ValueError(f"Extractor error: {e}")
    except MaxDownloadsReached as e:
        raise ValueError(f"Max downloads reached: {e}")
    except PostProcessingError as e:
        raise ValueError(f"Post-processing error: {e}")
    except UnavailableVideoError as e:
        raise ValueError(f"Unavailable video error: {e}")
    except Exception as e:
        raise ValueError(f"An unexpected error occurred: {e}")
    
import whisper
import os

def transcribe_audio(file_path: str) -> typing.List[typing.Dict[str, typing.Any]]:
    ffmpeg_path = r"C:\ProgramData\chocolatey\bin"
    if ffmpeg_path not in os.environ["PATH"]:
        os.environ["PATH"] += os.pathsep + ffmpeg_path

    model = whisper.load_model("medium")
    result: typing.Dict[str, typing.Any] = model.transcribe(file_path) # type: ignore
    structured_output: typing.List[typing.Dict[str, typing.Any]] = []
    
    for segment in result["segments"]:
        seg: typing.Dict[str, typing.Any] = segment # type: ignore
        segment_data = {
            "start": seg["start"],
            "end": seg["end"],
            "text": seg["text"].strip()
        }
        structured_output.append(segment_data)
        
    return structured_output