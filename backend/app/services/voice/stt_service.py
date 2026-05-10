from fastapi import WhisperModel
import tempfile

model = WhisperModel("small", device="cpu")

async def transcribe_audio(file):
    audio_bytes = await file.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    segments, _ = model.transcribe(tmp_path, language="vi")

    return " ".join([segment.text for segment in segments])