try:
    from backend.api.deps import get_file_blob_client, get_image_blob_client
    from backend.core.db.image_blob_container import ImageBlobClient
    from backend.core.db.file_blob_container import FileBlobClient
except (ModuleNotFoundError, ImportError):
    from api.deps import get_file_blob_client, get_image_blob_client
    from core.db.image_blob_container import ImageBlobClient
    from core.db.file_blob_container import FileBlobClient

from email.mime import image
import uuid
from fastapi import APIRouter, Form, File, UploadFile, Depends, HTTPException, status
from magic import Magic

router = APIRouter(prefix="/blobs", tags=["blobs", "file uploads"])

# TODO: move this to utils?

ALLOWED_IMAGE_TYPES = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
}

# DONT ALLOW THEM TO UPLOAD COODE OR SCRIPTS
ALLOWED_FILE_TYPES = {
    "application/pdf": "pdf",
    "video/mp4": "mp4"
}

async def _validate_mime_type(file: UploadFile, allowed_types: dict) -> str:
    """
    Validates size and mime type. Returns bytes if valid.
    """
    header_chunk: bytes = await file.read(2048)
    mime: Magic = Magic(mime=True)
    true_content_type:str = mime.from_buffer(header_chunk)

    if true_content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type {true_content_type}. Allowed: {list(allowed_types.keys())}",
        )
    await file.seek(0)

    return allowed_types.get(true_content_type)


@router.post("/images")
async def create_image_url(
    user_uuid: str = Form(...),
    file: UploadFile = File(...),
    blob_client: ImageBlobClient = Depends(get_image_blob_client),
):
    """
    Use this for creating image urls (products, profile pics, etc) that you can then store in CosmosDB. This is so that payload size
    is reduced.
    """
    FILE_SIZE_MB_LIMIT = 11 * 1024 * 1024

    if not file:
        raise HTTPException(status_code=400, detail="File missing, expected an image.")

    if file.size > FILE_SIZE_MB_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"max file size allowed: {FILE_SIZE_MB_LIMIT}",
        )

    try:
        file_extension = await _validate_mime_type(file, ALLOWED_IMAGE_TYPES)
        sanitized_filename = f"{user_uuid}-{uuid.uuid4()}.{file_extension}"
        
        image_url = await blob_client.upload_image(
            file_name=sanitized_filename,
            file_bytes=file.file,
            content_type=file_extension,
        )

        return {"url": image_url}

    except HTTPException as he:
        raise he
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occured. {e}",
        )


@router.post("/files")
async def create_file_url(
    user_uuid: str = Form(...),
    file: UploadFile = File(...),
    blob_client: FileBlobClient = Depends(get_file_blob_client),
):
    """
    Use this for creating files urls (invoices, receipts, etc.) that you can then store in CosmosDB. This is so that payload size
    is reduced. Update `ALLOWED_FILE_TYPES` as needed.
    """

    FILE_SIZE_MB_LIMIT = 10 * 1024 * 1024

    if not file:
        raise HTTPException(status_code=400, detail="File missing, expected an image.")

    if file.size > FILE_SIZE_MB_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"max file size allowed: {FILE_SIZE_MB_LIMIT}",
        )

    try:
        file_extension = await _validate_mime_type(file, ALLOWED_FILE_TYPES)
        sanitized_filename = f"{user_uuid}-{uuid.uuid4()}.{file_extension}"
        
        file_url = await blob_client.upload_file(
            file_name=sanitized_filename,
            file_bytes=file.file,
            content_type=file_extension,
        )

        return {"url": file_url}

    except HTTPException as he:
        raise he
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occured. {e}",
        )
