
from app.schemas.response import (
    DashboardStatsResponse,
    CustomerOverview,
    SegmentationOverview,
    ModelStatus,
    PredictionSummary,
    SystemHealth,
)

from app.services.model_loader import model_service


class DashboardService:

    def get_dashboard_stats(self) -> DashboardStatsResponse:

        # Load dataset
        df = model_service.load_dataset()

        # Customer Overview
        customer_overview = CustomerOverview(
            total_customers=len(df),
            high_risk_customers=int((df["Churn"] == 1).sum()),
            low_risk_customers=int((df["Churn"] == 0).sum()),
            average_churn_probability=round(float(df["Churn"].mean()), 2),
            average_customer_spend=round(float(df["Total_Spend"].mean()), 2),
            average_customer_age=round(float(df["Age"].mean()), 2),
        )

        # Segmentation Overview
        segmentation_data = model_service.get_segmentation_statistics(df)

        segmentation = SegmentationOverview(
            total_segments=segmentation_data["total_segments"],
            segment_distribution=segmentation_data["segment_distribution"],
            largest_segment=segmentation_data["largest_segment"],
        )

        # Model Status
        model_data = model_service.get_model_status()

        model_status = ModelStatus(
            logistic_regression=model_data["logistic_regression"],
            decision_tree=model_data["decision_tree"],
            kmeans=model_data["kmeans"],
            churn_scaler=model_data["churn_scaler"],
            segmentation_scaler=model_data["segmentation_scaler"],
            encoder=model_data["encoder"],
            model_version=model_data["model_version"],
            last_loaded=model_data["last_loaded"],
        )

        # Prediction Summary (Placeholder)
        prediction_summary = PredictionSummary(
            total_predictions=0,
            churn_predictions=0,
            segmentation_predictions=0,
        )

        # System Health
        system_data = model_service.get_system_health()

        system_health = SystemHealth(
            api_status=system_data["api_status"],
            authentication_status=system_data["authentication_status"],
            model_service_status=system_data["model_service_status"],
            database_status=system_data["database_status"],
        )

        # Final Response
        return DashboardStatsResponse(
            customer_overview=customer_overview,
            segmentation=segmentation,
            model_status=model_status,
            prediction_summary=prediction_summary,
            system_health=system_health,
        )


dashboard_service = DashboardService()