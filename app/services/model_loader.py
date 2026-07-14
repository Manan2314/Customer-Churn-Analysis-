from pathlib import Path
import joblib
import pandas as pd

from datetime import datetime

# Recommendations & Insights
from app.services.recommendation import generate_recommendation
from app.services.insights import insights_service


class ModelService:
    def __init__(self):
        self.BASE_DIR = Path(__file__).resolve().parents[2]
        self.MODEL_DIR = self.BASE_DIR /"saved_models"

        self._logistic_model = None
        self._decision_tree_model = None
        self._segmentation_model = None
        self._segmentation_scaler = None
        self._churn_scaler = None
        self._encoder = None

        self._model_version = "v1.0"
        self._last_loaded = None
        
        self._load_models()
        self.validate_models()

        self.DATASET_PATH = (
            self.BASE_DIR / "customer_retention_dataset.csv"
        )

        self.SEGMENTATION_FEATURES = [
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
        "Product_Categories_Purchased"]

    def set_dataset_path(self, dataset_path: str | Path):
        self.DATASET_PATH = Path(dataset_path)
        

    def _load_models(self):
     try:
       self._logistic_model = joblib.load(self.MODEL_DIR / "churn_logistic_regression.pkl")
       self._decision_tree_model = joblib.load(self.MODEL_DIR / "churn_decision_tree.pkl")
       self._segmentation_model = joblib.load(self.MODEL_DIR / "kmeans_model.pkl")
       self._churn_scaler = joblib.load(self.MODEL_DIR / "churn_scaler.pkl")
       self._segmentation_scaler = joblib.load(self.MODEL_DIR / "segmentation_scaler.pkl")
       self._encoder = joblib.load(self.MODEL_DIR / "churn_ordinal_encoder.pkl")
       

       self._last_loaded = datetime.now()
       print("All models loaded successfully.")

     except FileNotFoundError as e:
      raise RuntimeError(f"Model file not found: {e.filename}") from e

     except Exception as e:
      raise RuntimeError(f"Error loading models: {e}") from e




    def validate_models(self): #simply a dictionary with all the models
      required = {
          "Logistic Regression" : self._logistic_model,
          "Decision Tree" : self._decision_tree_model,
          "Segmentation Model": self._segmentation_model,
          "Churn_Scaler": self._churn_scaler,
          "Segmentation scaler" : self._segmentation_scaler,
           "Encoder": self._encoder
    }
      #creates a list of models that failed to load
      missing = [                 
        name
        for name, model in required.items()
        if model is None
    ]

      if missing:
        raise RuntimeError(
            "Missing models: " + ", ".join(missing)
        )
    

    def predict_churn(self, customer: dict):

     row_dict = {
        feature: 0
        for feature in self._churn_scaler.feature_names_in_
    }

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
        row_dict[feature] = customer.get(feature, 0)

     membership = customer.get("Membership", "")

     try:
        membership_encoded = self._encoder.transform([[membership]])[0][0]
     except Exception:
        membership_encoded = 0.0

     row_dict["Membership"] = membership_encoded

     categorical_features = [
        "Gender"
        "Payment_Method",
        "Preferred_Shopping_Time",
        "Product_Categories_Purchased",
     ]

     for feature in self._churn_scaler.feature_names_in_:

        # Skip features we've already handled
        if feature in numeric_features or feature == "Membership":
            continue

        for category in categorical_features:

            if feature.startswith(category + "_"):

                # Extract the category value
                feature_value = feature[len(category) + 1:]

                # Get the customer's selected value
                customer_value = customer.get(category, "")

                # One-hot encode
                row_dict[feature] = (
                    1 if str(customer_value) == feature_value else 0
                )

                break

     df = pd.DataFrame ([row_dict],

      columns=self._churn_scaler.feature_names_in_
     )

     scaled = self._churn_scaler.transform(df)

    
    #predict churn completed above
     prob = float(self._logistic_model.predict_proba(scaled)[0][1])
     pred_class = int(self._logistic_model.predict(scaled)[0])
     pred_str = "Yes" if pred_class == 1 else "No"


     # Customer Segmentation

     cluster = self.predict_segmentation(customer)

     # Recommendation

     recommendation = generate_recommendation(customer, prob, cluster)
     recommendation_text = recommendation.get(
       "recommendation",
       ""
     )


     # AI Insights

     insights = insights_service._get_insights(
        customer_data=customer,
        churn_prediction=pred_str,
        churn_probability=prob,
        customer_segment=cluster,
        recommendation=recommendation_text,
     )


    # Final Response

     return {
    "churn_prediction": pred_str,
    "churn_probability": round(prob, 4),
    "customer_segment": cluster,
    "recommendation": recommendation_text,
    "intelligence_insights": insights,
     }
     
    def predict_segmentation(self, customer: dict) -> int:
     features = [
        float(customer.get(feature, 0.0))
        for feature in self.SEGMENTATION_FEATURES
    ]

     df = pd.DataFrame(
        [features],
        columns=self.SEGMENTATION_FEATURES
    )

     scaled_features = self._segmentation_scaler.transform(df)

     cluster = int(
        self._segmentation_model.predict(scaled_features)[0]
    )

     return cluster

    

    def get_model_status(self):
     return {
        "logistic_regression": self._logistic_model is not None,
        "decision_tree": self._decision_tree_model is not None,
        "kmeans": self._segmentation_model is not None,

        "churn_scaler": self._churn_scaler is not None,
        "segmentation_scaler": self._segmentation_scaler is not None,
                    
        "encoder": self._encoder is not None,
        "model_version": self._model_version,
        "last_loaded": self._last_loaded,
    }

    def get_system_health(self):
     return {
        "api_status": "Running",
        "authentication_status": "Healthy",
        "model_service_status": "Healthy",
        "database_status": "Not Connected"
    }

    def load_dataset(self) -> pd.DataFrame:
        if not self.DATASET_PATH.exists():
         raise FileNotFoundError(
         f"Dataset not found: {self.DATASET_PATH}")
      
        return pd.read_csv(self.DATASET_PATH) 
    

    def get_segmentation_statistics(self, df: pd.DataFrame):

     X = df[self.SEGMENTATION_FEATURES]

     X_scaled = self._segmentation_scaler.transform(X)

     clusters = self._segmentation_model.predict(X_scaled)

     distribution = (
        pd.Series(clusters)
        .value_counts()
        .sort_index()
     )

     segment_distribution = {
        f"Segment {segment}": int(count)
        for segment, count in distribution.items()
     }

     largest_segment = (
        f"Segment {distribution.idxmax()}")
     

     return {
        "total_segments": len(distribution),
        "segment_distribution": segment_distribution,
        "largest_segment": largest_segment,
     }
      

model_service = ModelService()