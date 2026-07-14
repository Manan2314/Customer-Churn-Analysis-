import numpy as np 
import pandas as pd 
from pathlib import Path
import joblib

# Resolve paths dynamically relative to the script location
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DATA_PATH = PROJECT_ROOT / "customer_retention_dataset.csv"

# Fallback path just in case the dataset is placed inside the training directory
if not DATA_PATH.exists():
    DATA_PATH = SCRIPT_DIR / "customer_retention_dataset.csv"

# Load dataset
if not DATA_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found at '{DATA_PATH}'. "
        f"Please place 'customer_retention_dataset.csv' in the project root folder."
    )

df = pd.read_csv(DATA_PATH)
print("Dataset loaded successfully. Shape:", df.shape)

df.drop(["Customer_ID"], axis = 1, inplace = True)

from sklearn.preprocessing import OrdinalEncoder
# Ordinal encoder
encoder = OrdinalEncoder()
df['Membership'] = encoder.fit_transform(df[['Membership']])

# One hot encoder
df_encoded = pd.get_dummies(df, columns=['Gender', 
                                         'Payment_Method', 
                                         'Preferred_Shopping_Time',
                                          'Product_Categories_Purchased'],
                                            dtype=int)

print(df_encoded.head())
print(df["Churn"].value_counts())

X = df_encoded.drop("Churn", axis=1)
y = df_encoded["Churn"]

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

from sklearn.linear_model import LogisticRegression

print("------ Logistic Regression ------")
lr_model = LogisticRegression()
lr_model.fit(X_train, y_train)

y_pred_lr = lr_model.predict(X_test)

from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
print("Logistic Regression Accuracy:", accuracy_score(y_test, y_pred_lr))
print(confusion_matrix(y_test, y_pred_lr))
print(classification_report(y_test, y_pred_lr))

print("------ Decision Tree ------")
from sklearn.tree import DecisionTreeClassifier
dt_model = DecisionTreeClassifier(random_state = 42)
dt_model.fit(X_train, y_train)
y_pred_dt = dt_model.predict(X_test)

print("Decision Tree Accuracy:", accuracy_score(y_test, y_pred_dt))
print(confusion_matrix(y_test, y_pred_dt))
print(classification_report(y_test, y_pred_dt))

print("Sample predictions (Logistic Regression):", y_pred_lr[:20])
print("Sample predictions (Decision Tree):", y_pred_dt[:20])

# Serialize to the saved_models directory with the correct names required by the API
MODEL_DIR = PROJECT_ROOT / "saved_models"
MODEL_DIR.mkdir(exist_ok=True)
print(f"\nSaving models and preprocessors to {MODEL_DIR}...")
joblib.dump(lr_model, MODEL_DIR / "churn_logistic_regression.pkl")
joblib.dump(dt_model, MODEL_DIR / "churn_decision_tree.pkl")
joblib.dump(scaler, MODEL_DIR / "churn_scaler.pkl")
joblib.dump(encoder, MODEL_DIR / "churn_ordinal_encoder.pkl")
print("Serialization complete.")