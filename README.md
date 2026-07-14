# 🚀 AI Customer Intelligence Platform

An AI-powered customer analytics platform built with **FastAPI**, **Machine Learning**, and **Google Gemini AI** that helps businesses understand their customers through churn prediction, customer segmentation, intelligent recommendations, and AI-generated business insights.

---

# 📌 Features

### 📊 Customer Churn Prediction
- Predicts whether a customer is likely to churn
- Uses trained Machine Learning models
- Returns prediction probability and confidence score

### 👥 Customer Segmentation
- Groups customers into meaningful business segments using K-Means Clustering
- Automatically classifies customers into segments such as:
  - VIP Customers
  - Loyal Customers
  - Regular Customers
  - Occasional Customers

### 💡 Smart Recommendation Engine
Generates personalized business recommendations based on customer behavior including:
- Spending habits
- Purchase frequency
- Customer engagement
- Loyalty level
- Activity score

### 🤖 AI Business Insights (Gemini)
Uses Google Gemini API to generate natural-language explanations for:
- Churn predictions
- Customer behavior
- Business recommendations
- Marketing actions

### 📂 CSV Upload Support
Upload customer datasets for batch analysis.

### 📈 Dashboard Analytics
Provides business statistics such as:
- Total customers
- Churn rate
- Segment distribution
- Customer overview
- Model information

### 🔐 JWT Authentication
Secure login system using JWT authentication.

---

# 🛠 Tech Stack

## Backend

- FastAPI
- Python 3.12
- Uvicorn

## Machine Learning

- Scikit-Learn
- Pandas
- NumPy
- Joblib

Models:
- Logistic Regression (Churn Prediction)
- Decision Tree (Alternative Churn Model)
- K-Means Clustering (Customer Segmentation)

## AI

- Google Gemini API

## Authentication

- JWT
- Pwdlib Password Hashing

---

# 📂 Project Structure

```
Customer-Churn-Analysis/
│
├── app/
│   ├── routes/
│   ├── services/
│   ├── schemas/
│   ├── models/
│   ├── utils/
│   └── main.py
│
├── datasets/
│
├── saved_models/
│
├── notebooks/
│
├── requirements.txt
├── .env
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Manan2314/Customer-Churn-Analysis-.git

cd Customer-Churn-Analysis-
```

---

## Create Virtual Environment

### Linux / macOS

```bash
python3 -m venv .venv

source .venv/bin/activate
```

### Windows

```bash
python -m venv .venv

.venv\Scripts\activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root.

```env
SECRET_KEY=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

---

# ▶️ Running the Project

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Server:

```
http://127.0.0.1:8000
```

Swagger Docs:

```
http://127.0.0.1:8000/docs
```

ReDoc:

```
http://127.0.0.1:8000/redoc
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/auth/login` |

---

## Prediction

| Method | Endpoint |
|---------|----------|
| POST | `/predict/churn` |
| POST | `/predict/segment` |

---

## Upload

| Method | Endpoint |
|---------|----------|
| POST | `/upload/csv` |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | `/dashboard/stats` |

---

# 🤖 Machine Learning Pipeline

1. Data Collection
2. Data Cleaning
3. Feature Engineering
4. Label Encoding
5. One-Hot Encoding
6. Model Training
7. Model Evaluation
8. Model Saving
9. FastAPI Integration
10. AI Insight Generation

---

# 📊 Models Used

| Model | Purpose |
|--------|----------|
| Logistic Regression | Customer Churn Prediction |
| Decision Tree | Alternative Churn Prediction |
| K-Means Clustering | Customer Segmentation |

---

# 📈 Sample Workflow

```
Customer Data
       │
       ▼
Data Preprocessing
       │
       ▼
Churn Prediction
       │
       ├────────► Recommendation Engine
       │
       ▼
Customer Segmentation
       │
       ▼
Gemini AI Insights
       │
       ▼
Business Dashboard
```

---

# 🔒 Authentication

The project uses JWT-based authentication.

Workflow:

```
Login
    │
    ▼
Verify Credentials
    │
    ▼
Generate JWT Token
    │
    ▼
Access Protected APIs
```

---

# 📌 Future Improvements

- Docker Support
- PostgreSQL/MySQL Integration
- Role-Based Access Control
- Model Retraining Pipeline
- CI/CD Deployment
- Cloud Deployment (AWS/GCP/Azure)
- Real-time Streaming Predictions

---

