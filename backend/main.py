try:
    from backend.core.config import settings
    from backend.core.db.image_blob_container import ImageBlobClient
    from backend.core.db.file_blob_container import FileBlobClient
    from backend.core.db.users_container import UsersContainer
    from backend.api.main import api_router
except (ImportError, ModuleNotFoundError):
    from core.config import settings
    from core.db.image_blob_container import ImageBlobClient
    from core.db.file_blob_container import FileBlobClient
    from core.db.users_container import UsersContainer
    from api.main import api_router

from contextlib import asynccontextmanager
import logging

from click import File
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# TODO: add better logging if kaya lolz


# I dont think a try-except is needed here, cuz the app will not boot if any of these connections fail to initalize.
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.image_blob_client = ImageBlobClient()
    await app.state.image_blob_client.initialize()

    app.state.file_blob_client = FileBlobClient()
    await app.state.file_blob_client.initialize()

    app.state.users_container = UsersContainer()
    await app.state.users_container.initialize()


    yield

    if app.state.image_blob_client:
        await app.state.image_blob_client.close()

    if app.state.file_blob_client:
        await app.state.file_blob_client.close()

    if app.state.users_container:
        await app.state.users_container.close()



app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_VERSION}/openapi.json",
    root_path=settings.ROOT_PATH,
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=getattr(settings, "CORS_ORIGINS", ["*"]),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=settings.API_VERSION)


@app.get("/", tags=["entrypoint"])
async def index():
    """Basic welcome endpoint."""
    return {
        "message": "Test from Python Server",
    }


@app.get("/health", tags=["health, health check"])
async def health_check():
    """Simple health check endpoint that confirms backend services and dependencies are online"""
    return {
        "status": "healthy",
        "credentials_loaded": getattr(settings, "IS_LOADED", False),
    }
