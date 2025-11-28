from fastapi import APIRouter

try:
    from backend.api.routes import (
        blobs,
        users,
    )
except (ModuleNotFoundError, ImportError):
    from api.routes import (
        blobs,
        users,
    )

api_router = APIRouter()

api_router.include_router(blobs.router)
api_router.include_router(users.router)