try:
    from backend.core.db.image_blob_container import ImageBlobClient
    from backend.core.db.file_blob_container import FileBlobClient
    from backend.core.db.users_container import UsersContainer
except (ModuleNotFoundError, ImportError):
    from core.db.image_blob_container import ImageBlobClient
    from core.db.file_blob_container import FileBlobClient
    from core.db.users_container import UsersContainer


from fastapi import Request, HTTPException

import logging

logging.basicConfig(
    level=logging.WARNING, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def get_image_blob_client(request: Request) -> ImageBlobClient:
    if not request.app.state.image_blob_client:
        raise HTTPException(
            status_code=503,
            detail="Image Blob Client not initialized. Lifespan might have failed silently ()or strange ahhh Azure Role permissions.",
        )
    return request.app.state.image_blob_client


def get_file_blob_client(request: Request) -> FileBlobClient:
    if not request.app.state.file_blob_client:
        raise HTTPException(
            status_code=503,
            detail="Image Blob Client not initialized. Lifespan might have failed silently (???) or strange ahhh Azure Role permissions.",
        )
    return request.app.state.file_blob_client

def get_users_container(request: Request) -> UsersContainer:
    if not request.app.state.users_container:
        raise HTTPException(
            status_code=503,
            detail="Users Container not Initialized.",
        )
    return request.app.state.users_container

