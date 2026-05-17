<<<<<<< HEAD
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
#from routes.profile import router as profile_router
from app.routes.sos import router as sos_router
import uvicorn
=======
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.routes.weather import router as weather_route
from app.routes.auth import router as user_route
>>>>>>> main

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
<<<<<<< HEAD
    allow_origins=["http://10.0.199.39:8081"],
=======
    allow_origins=["http://10.0.237.53:8081"], # Cho phép Frontend
>>>>>>> main
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# --- ROUTES ---

#app.include_router(profile_router, tags=["Profile"])
app.include_router(sos_router)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
=======
app.include_router(weather_route)
app.include_router(user_route)

@app.get("/")
def read_root():
    return {"message": "Server is running"}
>>>>>>> main

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)