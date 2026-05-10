from fastapi import APIRouter, File, UploadFile
from app.services.voice.stt_service import transcribe_audio
from app.services.voice.response_service import process_query

router = APIRouter()

@router.post("/voice")
async def voice(file: UploadFile = File(...)):
    text = await transcribe_audio(file)
    response = await process_query(text)
    response["user_text"] = text
    return response