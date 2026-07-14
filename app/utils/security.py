import os
from dotenv import load_dotenv
load_dotenv()
from datetime import datetime, timedelta, timezone

from jose import jwt
# pyrefly: ignore [missing-import]
from pwdlib import PasswordHash

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY not found in environment variables.")


ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_hasher= PasswordHash.recommended()
def get_password_hash(password: str) -> str:
    return password_hasher.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hasher.verify(plain_password, hashed_password)

def create_access_token(data : dict, expires_delta: timedelta | None = None):
     to_encode = data.copy()
     if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
     else:
         expire = datetime.now(timezone.utc) + timedelta(
             minutes = ACCESS_TOKEN_EXPIRE_MINUTES
         )
     to_encode.update({"exp" : expire})
     encoded_jwt = jwt.encode(
             to_encode,
             SECRET_KEY,
             algorithm = ALGORITHM
         )
     return encoded_jwt