import logging
from typing import Optional

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

    async def upload_image(self, file_name: str, file_bytes: bytes, content_type: str) -> str | None:
        """
        Use this for storing recipts or whatever twisted shit they pull on the event day.
        """
        if not self.container_client: 
            raise ValueError("FileBlobClient Client not initialized. Call initialize() first.")
        
        try:
            content_settings = ContentSettings(content_type=content_type)
            
            blob_client = await self.container_client.upload_blob(
                name=file_name,
                data=file_bytes,
                content_settings=content_settings,
                overwrite=True
            )

            return blob_client.url

        except Exception as e:
            logger.error(f"Failed to upload scanned image to Azure Blob Container: {e}")
            return None