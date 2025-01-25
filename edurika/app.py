from fastapi import FastAPI

from edurika.api.api import api_router


def get_application() -> FastAPI:
    app = FastAPI(
        title="Edurika API",
    )
    app.include_router(api_router)
    return app
