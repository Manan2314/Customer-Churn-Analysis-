from fastapi import APIRouter, HTTPException

from app.services.model_loader import model_service

router = APIRouter(
    prefix="/segmentation",
    tags=["Segmentation"]
)


@router.get("/analysis")
def get_segmentation_analysis():
    try:
        df = model_service.load_dataset()

        stats = model_service.get_segmentation_analysis(df)

        return stats

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )