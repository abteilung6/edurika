from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from edurika.api.api import api_router


def get_application() -> FastAPI:
    app = FastAPI(
        title="Edurika API",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router)
    return app
