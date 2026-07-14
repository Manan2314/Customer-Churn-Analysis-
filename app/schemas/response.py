from datetime import datetime
from typing import Dict

from pydantic import BaseModel


class PredictionResponse(BaseModel):
    churn_prediction: str
    churn_probability: float
    customer_segment: int
    recommendation: str
    intelligence_insights: str

class SegmentationResponse(BaseModel):
    customer_segment: int
    recommendation: str


class CustomerOverview(BaseModel):
    total_customers: int
    high_risk_customers: int
    low_risk_customers: int
    average_churn_probability: float
    average_customer_spend: float
    average_customer_age: float
    

class SegmentationOverview(BaseModel):
    total_segments: int
    segment_distribution: Dict[str, int]
    largest_segment: str


class ModelStatus(BaseModel):
    logistic_regression: bool
    decision_tree: bool
    kmeans: bool
    churn_scaler: bool
    segmentation_scaler: bool
    encoder: bool
    model_version: str
    last_loaded: datetime


class PredictionSummary(BaseModel):
    total_predictions: int
    churn_predictions: int
    segmentation_predictions: int


class SystemHealth(BaseModel):
    api_status: str
    authentication_status: str
    model_service_status: str
    database_status: str


class DashboardStatsResponse(BaseModel):
    customer_overview: CustomerOverview
    segmentation: SegmentationOverview
    model_status: ModelStatus
    prediction_summary: PredictionSummary
    system_health: SystemHealth