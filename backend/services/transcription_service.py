import tempfile

from faster_whisper import WhisperModel

# load whisper model at startup
model = WhisperModel("tiny", device="cpu", compute_type="int8")

# actual function to transcrible audio
# this will be called by API endpoint
async def transcribe_audio(file) -> str:
    audio_bytes = await file.read()
    
    # save the uploaded audio to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name
    
    segments, info = model.transcribe(tmp_path, language="vi", beam_size=5, vad_filter=True, vad_parameters=dict(min_silence_duration_ms=1000))
    return " ".join([segment.text for segment in segments])