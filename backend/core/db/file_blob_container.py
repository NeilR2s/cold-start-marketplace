import logging
from typing import Optional, BinaryIO

import asyncio
from azure.storage.blob.aio import BlobServiceClient, ContainerClient
from azure.storage.blob import ContentSettings

try:
    from backend.core.config import settings
except (ModuleNotFoundError, ImportError):
    from core.config import settings

logging.basicConfig(
    level=logging.WARNING, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class FileBlobClient:
    """
    You can use this context-manager style, but prefer to use the FastAPI way (dependency injection from lifespan db connection pool)
    """
    def __init__(self):
        self.storage_container_name = "cold-start-file-blobs"
        self.storage_account_key = getattr(settings, 'STORAGE_ACCOUNT_KEY', None)
        self.storage_connection_string = getattr(settings, 'STORAGE_CONNECTION_STRING', None)
        
        self.blob_service_client: Optional[BlobServiceClient] = None
        self.container_client: Optional[ContainerClient] = None

    def __str__(self):
        return f"FileBlobClient({self.storage_container_name})"

    async def __aenter__(self):
        await self.initialize()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()

    async def initialize(self):
        """
        Initializes the Azure Blob Service Client and ensures the container exists.
        """
        if self.container_client is not None:
            return

        if not self.storage_connection_string:
            raise ValueError(
                "FileBlobClient failed to initialize: STORAGE_CONNECTION_STRING is missing."
            )
        if not self.storage_container_name:
            raise ValueError(
                "FileBlobClient failed to initialize: STORAGE_CONTAINER_NAME is missing."
            )

        try:
            # Create the async client (blocking type shi)
            self.blob_service_client = BlobServiceClient.from_connection_string(
                self.storage_connection_string
            )
            
            # Initialize container client (equivalent to database_session in Cosmos client)
            self.container_client = self.blob_service_client.get_container_client(
                self.storage_container_name
            )

            # create_container_if_not_exists
            if not await self.container_client.exists():
                await self.container_client.create_container()
                
            logger.info(f"FileBlobClient initialized: {self.storage_container_name}")

        except Exception as e:
            logger.error(f"Failed to initialize Azure Blob Client: {e}")
            await self.close()
            raise

    async def close(self):
        """
        You need to use this for cleaning up the connections when the lifespan yields the resources.
        """
        if self.blob_service_client:
            await self.blob_service_client.close()
            self.blob_service_client = None
            self.container_client = None
            logger.info("FileBlobClient connection closed")

    async def upload_file(self, file_name: str, file_bytes: bytes | BinaryIO, content_type: str) -> str | None:
            if not self.container_client: 
                raise ValueError("FileBlobClient Client not initialized. Call initialize() first.")
            
            try:
                payload = file_bytes
                if hasattr(file_bytes, "read"):
                    # Check if it's an async read (FastAPI) or sync read
                    if asyncio.iscoroutinefunction(file_bytes.read):
                        payload = await file_bytes.read()
                    else:
                        payload = file_bytes.read()
                
                content_settings = ContentSettings(content_type=content_type)
                blob_client = self.container_client.get_blob_client(file_name)
                blob_url = blob_client.url
                
                async def _upload_worker():
                    try:
                        await blob_client.upload_blob(
                            data=payload,
                            content_settings=content_settings,
                            overwrite=True
                        )
                        logger.info(f"Background upload successful: {file_name}")
                    except Exception as e:
                        logger.error(f"Background upload failed for {file_name}: {e}")

                asyncio.create_task(_upload_worker())

                return blob_url

            except Exception as e:
                logger.error(f"Failed to initiate optimistic upload: {e}")
                return None