import re
from typing import Any

from pydantic import BaseModel, EmailStr, Field, field_validator

from edurika.schemas.fields import PasswordField, UsernameField


class UserCreate(BaseModel):
    email: str
    hashed_password: str
    public_name: str
    username: str
    subtitle: str | None
    description: str | None


class User(BaseModel):
    user_id: int
    email: EmailStr
    public_name: str
    username: str
    subtitle: str | None
    description: str | None

    class Config:
        from_attributes = True


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str = PasswordField
    username: str = UsernameField
    public_name: str = Field(..., min_length=8, max_length=32)
    subtitle: str | None = Field(None, min_length=8, max_length=128)
    description: str | None = Field(None, min_length=8, max_length=1024)

    @field_validator("password", mode="after")
    @classmethod
    def validate_password_strength(cls, value: Any) -> str:  # noqa: ANN401
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain at least one special character")
        return value


class SignUpResponse(BaseModel):
    user: User
    access_token: str
    token_type: str


class SignInResponse(BaseModel):
    access_token: str
    token_type: str
