import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from app.routes.sos import router as sos_router
from app.routes.weather import router as weather_route
from app.routes.auth import router as user_route
import dotenv
import os

dotenv.load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_route)
app.include_router(weather_route)
app.include_router(sos_router)

@app.get("/")
def read_root():
    return {"message": "Server is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)