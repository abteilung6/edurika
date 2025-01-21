from fastapi import FastAPI

app = FastAPI(
    title="Edurika API",
)


@app.get("/")
def read_root() -> dict:
    return {"Hello": "World"}
