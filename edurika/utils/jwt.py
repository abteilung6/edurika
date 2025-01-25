from datetime import timedelta

import jwt
from pydantic import BaseModel

from edurika.utils.time import now


class JwtPayload(BaseModel):
    sub: str  # username


class JwtManager:
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30  # 30 days

    def __init__(self, secret_key: str, algorithm: str) -> None:
        self.secret_key = secret_key
        self.algorithm = algorithm

    def create_access_token(self, payload: JwtPayload) -> str:
        to_encode = payload.model_dump()
        expire = now() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def decode_access_token(self, token: str) -> JwtPayload:
        payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        return JwtPayload(**payload)
