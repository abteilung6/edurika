from pydantic import SecretStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    EDURIKA_JWT_SECRET_KEY: SecretStr
    SHOPIFY_SHOP_ID: str
    SHOPIFY_ACCESS_TOKEN: SecretStr


def lazy_load_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
