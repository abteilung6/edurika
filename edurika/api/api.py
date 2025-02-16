from fastapi import APIRouter

from edurika.api import products, users

api_router = APIRouter()

api_router.include_router(products.router)
api_router.include_router(users.router)
