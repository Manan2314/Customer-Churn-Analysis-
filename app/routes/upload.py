import pandas as pd 
from fastapi import APIRouter, File, HTTPException, UploadFile
from pathlib import Path
from app.services.inference_service import inference_service

router = APIRouter(
    prefix = "/upload",
    tags = ["Dataset Upload"]
)

UPLOAD_DIR = Path("datasets/raw")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/")
def upload_dataset(file: UploadFile = File(...)):
      if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed"
        )
      
      try:
        df = pd.read_csv(file.file)

               
        save_path = UPLOAD_DIR / file.filename
        df.to_csv(save_path, index=False)
        result = inference_service.process_uploaded_dataset(
           save_path
         )    
        return result
        

      except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )

