import os


def get_jwt_secret_key() -> str:
    return _load_env_variable("EDURIKA_JWT_SECRET_KEY")


def _load_env_variable(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise ValueError(f"{name} is not set in the environment variables")
    return value
