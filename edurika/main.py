from typing import Any

from fastapi import FastAPI

app = FastAPI(
    title="Edurika API",
)


@app.get("/")
def read_root() -> dict[str, Any]:
    return {"Hello": "World"}
