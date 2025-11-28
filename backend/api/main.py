from fastapi import APIRouter

try:
    from backend.api.routes import (
        blobs,
    )
except (ModuleNotFoundError, ImportError):
    from api.routes import (
        blobs,
    )

api_router = APIRouter()

api_router.include_router(
    blobs.router,
)