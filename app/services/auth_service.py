from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.schemas.auth import User
from app.utils.security import (
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)

fake_users_db = {
    "admin@example.com": {
        "email": "admin@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$MxZpcijBGjeS97UNvVbwfw$zJtDDreluDoyeO1QAid+0/M32cJFGTZ4e/s9tPvUyX8"
    }
}

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def authenticate_user(email: str, password: str):
    user = fake_users_db.get(email)


    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": user["email"]}
    )

    return {
        "access_token" : access_token,
        "token_type": "bearer"
    }


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:

    print("TOKEN RECEIVED:", token)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("PAYLOAD:", payload)

        email = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = fake_users_db.get(email)

    print("USER FOUND:", user)

    if user is None:
        raise credentials_exception

    return User(email=user["email"])