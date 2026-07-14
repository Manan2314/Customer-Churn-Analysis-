# pyrefly: ignore [missing-import]
from fastapi import APIRouter
from app.schemas.response import DashboardStatsResponse


from app.services.dashboard_service import dashboard_service

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
 )

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats():
    return dashboard_service.get_dashboard_stats()