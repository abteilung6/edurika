from collections.abc import Generator
from typing import Any

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError
from sqlalchemy.orm import Session

from edurika import models
from edurika.crud.users import user_get
from edurika.models.base_class import SessionLocal
from edurika.utils.env import get_jwt_secret_key
from edurika.utils.jwt import JwtManager


def get_db() -> Generator[Session, Any, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


def get_jwt_manager() -> JwtManager:
    secret_key = get_jwt_secret_key()
    algorithm = "HS256"
    return JwtManager(secret_key=secret_key, algorithm=algorithm)


def get_current_username(
    token: str = Depends(oauth2_scheme), jwt_manager: JwtManager = Depends(get_jwt_manager)
) -> str:
    try:
        payload = jwt_manager.decode_access_token(token)
        if (username := payload.sub) is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        return username
    except jwt.ExpiredSignatureError as ex:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        ) from ex
    except (ValidationError, jwt.PyJWTError) as ex:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from ex


def get_current_user(username: str = Depends(get_current_username), db: Session = Depends(get_db)) -> models.User:
    if (user := user_get(db, username=username)) is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return user
