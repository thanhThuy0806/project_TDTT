import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.voice import router as voice_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(voice_router)

@app.get("/")
def root():
    return {"message": "Server is running"}

if __name__ == "__main__":
    uvicorn.run(app="Project TDTT", host="0.0.0.0", port=8000)