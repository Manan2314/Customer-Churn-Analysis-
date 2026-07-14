# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
from app.schemas.customer import CustomerChurnRequest, CustomerSegmentationRequest
from app.schemas.response import PredictionResponse, SegmentationResponse
from app.services.model_loader import model_service
from app.services.auth_service import get_current_user
from app.schemas.auth import User
from app.services.recommendation import generate_recommendation

router = APIRouter(
    prefix="/predict",
    tags=["prediction"]
)

@router.post("/churn", response_model= PredictionResponse)
def predict_churn(customer_data: CustomerChurnRequest):
    
    input_dict = customer_data.model_dump()
    predictions = model_service.predict_churn(input_dict)
    return predictions

@router.post("/segment", response_model=SegmentationResponse)
def predict_segment(customer_data: CustomerSegmentationRequest):

    input_dict = customer_data.model_dump()

    cluster = model_service.predict_segmentation(input_dict)

    recommendation = generate_recommendation(
        customer=input_dict,
        churn_probability=0,
        customer_segment=cluster,
    )

    return {
        "customer_segment": cluster,
        "recommendation": recommendation["recommendation"],
    }
 