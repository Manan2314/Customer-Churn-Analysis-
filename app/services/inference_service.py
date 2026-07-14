from pathlib import Path
import pandas as pd

from app.services.model_loader import model_service
from app.services.recommendation import generate_recommendation
from app.services.insights import insights_service


class InferenceService:

    def __init__(self):

        self.BASE_DIR = Path(__file__).resolve().parents[2]

        self.PROCESSED_DIR = (
            self.BASE_DIR / "datasets" / "processed"
        )

        self.PROCESSED_DIR.mkdir(
            parents=True,
            exist_ok=True
        )

        self.PROCESSED_PATH = (
            self.PROCESSED_DIR / "latest_processed.csv"
        )


    def process_uploaded_dataset(self, file_path: str):

        # Load uploaded dataset
        df = pd.read_csv(file_path)


        # Store uploaded dataset as active dataset
        model_service.set_dataset_path(file_path)


        # -----------------------------
        # Churn Prediction
        # -----------------------------

        churn_features = self.prepare_churn_features(df)

        scaled_features = (
            model_service._churn_scaler
            .transform(churn_features)
        )


        churn_predictions = (
            model_service._logistic_model
            .predict(scaled_features)
        )

        churn_probabilities = (
            model_service._logistic_model
            .predict_proba(scaled_features)[:,1]
        )


        df["Predicted_Churn"] = [
            "Yes" if value == 1 else "No"
            for value in churn_predictions
        ]

        df["Churn_Probability"] = (
            churn_probabilities.round(4)
        )


        # -----------------------------
        # Segmentation
        # -----------------------------

        segmentation_df = (
            df[
                model_service.SEGMENTATION_FEATURES
            ]
        )

        scaled_segments = (
            model_service._segmentation_scaler
            .transform(segmentation_df)
        )


        segments = (
            model_service._segmentation_model
            .predict(scaled_segments)
        )


        df["Customer_Segment"] = segments


        # -----------------------------
        # Recommendations
        # -----------------------------

        recommendations = []

        insights = []


        for index, row in df.iterrows():

            customer = row.to_dict()

            recommendation = generate_recommendation(
                customer,
                float(
                    row["Churn_Probability"]
                ),
                int(
                    row["Customer_Segment"]
                )
            )


            recommendations.append(
                recommendation["recommendation"]
            )


            insight = insights_service._get_insights(
                customer_data=customer,
                churn_prediction=row["Predicted_Churn"],
                churn_probability=float(
                    row["Churn_Probability"]
                ),
                customer_segment=int(
                    row["Customer_Segment"]
                ),
                recommendation=recommendation["recommendation"]
            )

            insights.append(insight)


        df["Recommendation"] = recommendations
        df["AI_Insights"] = insights


        # Save processed data

        df.to_csv(
            self.PROCESSED_PATH,
            index=False
        )


        return {

            "message":
            "Dataset processed successfully",

            "rows_processed":
            len(df),

            "churn_predictions_generated":
            len(df),

            "segments_generated":
            len(df),

            "processed_file":
            str(self.PROCESSED_PATH)

        }



    def prepare_churn_features(
        self,
        df: pd.DataFrame
    ):

        feature_columns = (
            model_service
            ._churn_scaler
            .feature_names_in_
        )


        processed = pd.DataFrame(
            0,
            index=df.index,
            columns=feature_columns
        )


        numeric_features = [
            "Age",
            "Total_Orders",
            "Average_Order_Value",
            "Total_Spend",
            "Days_Since_Last_Purchase",
            "Average_Orders_Per_Month",
            "Wishlist_Items",
            "Cart_Abandonment_Rate",
            "Coupons_Used",
            "Return_Rate",
            "App_Sessions_Per_Month",
            "Average_Session_Duration",
            "Customer_Support_Tickets",
        ]


        for feature in numeric_features:
            processed[feature] = (
                df[feature]
            )


        # Membership encoding

        membership_encoded = (
            model_service
            ._encoder
            .transform(
                df[["Membership"]]
            )
            .flatten()
        )


        processed["Membership"] = (
            membership_encoded
        )


        # One hot categorical columns

        categorical_columns = [
            "Gender",
            "Payment_Method",
            "Preferred_Shopping_Time",
            "Product_Categories_Purchased"
        ]


        for column in categorical_columns:

            for feature in feature_columns:

                if feature.startswith(
                    column + "_"
                ):

                    value = (
                        feature.replace(
                            column + "_",
                            ""
                        )
                    )


                    processed.loc[
                        df[column].astype(str) == value,
                        feature
                    ] = 1


        return processed



inference_service = InferenceService()