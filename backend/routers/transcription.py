from fastapi import APIRouter, File, UploadFile
from services.transcription_service import transcribe_audio

router = APIRouter()

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    text = await transcribe_audio(file)
    return {"text": text}