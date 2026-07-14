from fastapi import APIRouter

router = APIRouter(
    tags=["health"]
)

@router.get("/health")
def health_check():
    
    return {
        "status": "healthy",
        "message": "AI Customer Intelligence Platform is running"
    }