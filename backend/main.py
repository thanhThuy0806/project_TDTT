from fastapi import FastAPI
from .routers import transcription

app = FastAPI()
# include transcription router
app.include_router(transcription.router)