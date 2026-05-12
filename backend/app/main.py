import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.weather import router as weather_route
from app.routes.auth import router as user_route
from app.routes.warning import router as warning_router





app = FastAPI(
    title="Accessibility & Safety API",
    description="API cảnh báo nguy hiểm và dịch vụ dự báo thời tiết theo khu vực",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------------------------------------------------------
# REST API ENDPOINTS
# ---------------------------------------------------------

app.include_router(weather_route)
app.include_router(user_route)
app.include_router(warning_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "danger-warning, weather"}
        
@app.get("/")
def read_root():
    return {"message": "Server is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)