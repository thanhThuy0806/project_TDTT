from fastapi import FastAPI
from routers import transcription

app = FastAPI()
# include transcription router
app.include_router(transcription.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Smart Tourism API. Go to /docs for API documentation."}

@app.get("/health")
async def health_check():
    return {"status": "ok"}