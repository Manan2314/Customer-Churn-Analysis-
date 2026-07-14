import numpy as np
import pandas as pd 

from sklearn.cluster import KMeans 
from sklearn.preprocessing import StandardScaler

import matplotlib.pyplot as plt 



from pathlib import Path

# Resolve paths dynamically relative to the script location
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DATA_PATH = PROJECT_ROOT / "customer_retention_dataset.csv"

if not DATA_PATH.exists():
    DATA_PATH = SCRIPT_DIR / "customer_retention_dataset.csv"

if not DATA_PATH.exists():
    raise FileNotFoundError(f"Dataset not found at '{DATA_PATH}'")

df = pd.read_csv(DATA_PATH)
print("Shape: ", df.shape)
print(df.head())
print(df.describe())
print(df.info())
print(df.isnull().sum())
print(df.columns)
print(df.head())


#Segmentation features 
Segmentation_features= [
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
    "Product_Categories_Purchased"
]

X = df[Segmentation_features].copy()
print(X.head())
print(X.shape)


scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
print(X_scaled[:5])

from sklearn.metrics import silhouette_score
import joblib

# Lists to hold our metrics
inertia = []
silhouette_scores = []
K_range = range(2, 11)

print("Evaluating different values of K...")
for k in K_range:
    # 1. Initialize the model
    kmeans = KMeans(
        n_clusters=k,
        random_state=42, 
        n_init=10        
    )
    
    # 2. Fit the model to our scaled data
    kmeans.fit(X_scaled)
    
    # 3. Store the inertia for the Elbow plot
    inertia.append(kmeans.inertia_)
    
    # 4. Calculate and store the Silhouette Score
    score = silhouette_score(X_scaled, kmeans.labels_)
    silhouette_scores.append(score)
    
    print(f"K = {k} | Inertia = {kmeans.inertia_:.0f} | Silhouette Score = {score:.3f}")

# --- VISUALIZATION ---
# Create a figure with 2 subplots side-by-side
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Plot 1: Elbow Method (Inertia)
ax1.plot(K_range, inertia, marker='o', color='blue')
ax1.set_title("Elbow Method (Inertia)")
ax1.set_xlabel("Number of Clusters (K)")
ax1.set_ylabel("Inertia")
ax1.grid(True)

# Plot 2: Silhouette Scores
ax2.plot(K_range, silhouette_scores, marker='s', color='green')
ax2.set_title("Silhouette Scores")
ax2.set_xlabel("Number of Clusters (K)")
ax2.set_ylabel("Silhouette Score")
ax2.grid(True)

plt.tight_layout()
plt.show()

# --- FINAL MODEL TRAINING ---
# Let's assume after looking at the charts, K=4 provides the best balance of 
# a high silhouette score, a good 'elbow', and business value (4 distinct personas).
OPTIMAL_K = 4 

print(f"\nTraining final KMeans model with K={OPTIMAL_K}...")
final_kmeans = KMeans(
    n_clusters=OPTIMAL_K,
    random_state=42,
    n_init=10
)
final_kmeans.fit(X_scaled)

# --- ASSIGN CLUSTERS TO ORIGINAL DATA ---
# Add the predicted clusters back to our original dataframe
df['Cluster'] = final_kmeans.labels_
print("\n========== Cluster Summary ==========\n")

cluster_summary = (
    df.groupby("Cluster")[Segmentation_features]
      .mean()
      .round(2)
)

print(cluster_summary.to_string())
print("\n========== Customers Per Cluster ==========\n")
print(df["Cluster"].value_counts().sort_index())

print("\nFirst 5 rows of our dataset with the new 'Cluster' assignment:")
print(df[['Total_Spend', 'Days_Since_Last_Purchase', 'Cluster']].head())

# --- SAVING THE MODELS ---
# We save both the scaler and the kmeans model so we can use them in production
MODEL_DIR = PROJECT_ROOT / "saved_models"
MODEL_DIR.mkdir(exist_ok=True)
joblib.dump(scaler, MODEL_DIR / 'segmentation_scaler.pkl')
joblib.dump(final_kmeans, MODEL_DIR / 'kmeans_model.pkl')
print(f"\nModels saved successfully to {MODEL_DIR}")