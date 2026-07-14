
from fastapi import APIRouter 
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import authenticate_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login", response_model = TokenResponse)
def login( request: LoginRequest):
    return authenticate_user(
        email = request.email,
        password = request.password
    )

