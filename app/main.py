# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create the FastAPI app ONLY ONCE
app = FastAPI(
    title="AI Customer Intelligence Platform",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to the AI Customer Intelligence Platform API",
        "health": "/health",
        "docs": "/docs"
    }

# Import routers
from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.upload import router as upload_router
from app.routes.dashboard import router as dashboard_router
from app.routes.predict import router as predict_router
from app.routes.segmentation import router as segmentation_router

# Register routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(predict_router)
app.include_router(dashboard_router)
app.include_router(segmentation_router)

