try:
    from backend.core.config import settings
except (ImportError, ModuleNotFoundError):
    from core.config import settings

import datetime
import logging
from typing import Optional
import uuid

from azure.cosmos import CosmosDict, PartitionKey
from azure.cosmos.aio import CosmosClient
from azure.cosmos.exceptions import CosmosHttpResponseError, CosmosResourceNotFoundError
from pydantic import UUID4


logging.basicConfig(
    level=logging.WARNING, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class UsersContainer:
    def __init__(self):
        self.host_url = settings.DATABASE_URI
        self.key = settings.DATABASE_KEY
        self.database_id = settings.DATABASE_ID
        self.container_id = "users"
        self.client: Optional[CosmosClient] = None
        self.database_session = None

    def __str__(self):
        return f"UsersContainer({self.database_id},{self.container_id})"

    async def __aenter__(self):
        await self.initialize()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()

    async def initialize(self):
        if self.database_session is not None:
            return
        
        if not all([self.host_url, self.key, self.database_id]):
            raise ValueError(
                "UsersContainer failed to initialize: missing host_url, key, or database_id"
            )
        
        try:
            self.client = CosmosClient(url=self.host_url, credential=self.key)
            database_client = self.client.get_database_client(self.database_id)

            self.database_session = await database_client.create_container_if_not_exists(
                id=self.container_id,
                partition_key=PartitionKey(path="/userId")
            )
            logger.info(f"UsersContainer initialized: {self.database_id}/{self.container_id}")            

        except Exception as e:
            logger.error(f"Failed to create or get container: {e}")
            await self.close()
            raise

    async def close(self):
        if self.client:
            await self.client.close()
            self.client = None
            self.database_session = None
            logger.info("UsersContainer connection closed")
    
    def _connect(self):
        if self.host_url is None or self.key is None or self.database_id is None:
            raise ValueError(
                f"{UsersContainer} failed due to initialize, check if host url and key exist."
            )
        else:
            client = CosmosClient(url=self.host_url, credential=self.key)
            database_client = client.get_database_client(self.database_id)
            container_client = database_client.get_container_client(self.container_id)
        return container_client

    async def _patch_user(self, user_uuid:str, patch_operations: list) -> bool:
        try:
            await self.database_session.patch_item(
                item=user_uuid,
                partition_key=user_uuid, 
                patch_operations=patch_operations
            )
            logger.info(f"User {user_uuid} patched successfully.")
            return True
        except CosmosResourceNotFoundError:
            logger.error(f"User {user_uuid} not found.")
            return False
        except CosmosHttpResponseError as e:
            logger.error(f"Failed to patch user {user_uuid}: {e.http_error_message}")
            return False

    async def create_user(
        self,
        user_uuid: str,
        user_email: str,
        display_name:str,
        role:str,
        avatarUrl:str,
    ) -> CosmosDict | None:
        """
        Create a user based on client-generated uuid 
        """
        created_user = {
            "id": user_uuid,
            "userId": user_uuid,
            "email": user_email,
            "displayName": display_name,
            "role": role,
            "avatarUrl": avatarUrl,

            "verificationData": {
                "isVerified": "false",
                "verification_level": "1",
                "trust_score": "60",
            },

            "twistData": {},   
        }

        try:
            scan_entry = await self.database_session.create_item(created_user)
            return scan_entry

        except CosmosHttpResponseError as ce:
            logger.error("Cosmos HTTP Error", ce)
            return None

        except Exception as e:
            logger.error("Unexpected Error", e)
            return None
        
    async def search_users(self, search_term: str, limit: int = 20):
            """
            Searches for users by Name or Email.
            Uses case-insensitive STARTSWITH for better performance than CONTAINS.
            
            Args:
                search_term: The partial string to find (e.g. "Dav")
                limit: Max results to return to keep UI snappy
            """
            
            # don't search for empty strings
            if not search_term or len(search_term) < 2:
                return []

            query = """
                SELECT TOP @limit 
                    c.id, 
                    c.displayName, 
                    c.avatarUrl, 
                    c.role,
                    c.twistData
                FROM c 
                WHERE 
                    (STARTSWITH(c.displayName, @term, true) OR 
                    STARTSWITH(c.email, @term, true))
            """
            
            parameters = [
                {"name": "@term", "value": search_term},
                {"name": "@limit", "value": limit}
            ]

            try:
                items = self.database_session.query_items(
                    query=query,
                    parameters=parameters,
                )
                return [item async for item in items]
                
            except CosmosHttpResponseError as e:
                logger.error(f"Search failed: {e.message}")
                return []

    async def update_general_info(self, user_uuid: str, display_name: str = None, avatar_url: str = None):
        """
        Updates top-level general information.
        """
        ops = []
        if display_name:
            ops.append({"op": "replace", "path": "/displayName", "value": display_name})
        if avatar_url:
            ops.append({"op": "replace", "path": "/avatarUrl", "value": avatar_url})
        
        if ops:
            return await self._patch_user(user_uuid, ops)
        return False

    async def update_verification_status(self, user_uuid: str, is_verified: bool, trust_score: int | None = None):
        """
        Updates nested verification data.
        """
        ops = [
            # convert bool to string 'true'/'false' cuz Javascript
            {"op": "replace", "path": "/verificationData/isVerified", "value": str(is_verified).lower()}
        ]
        
        if trust_score is not None:
            # Ensure we send a string if your schema requires strings for numbers
            ops.append({"op": "replace", "path": "/verificationData/trust_score", "value": str(trust_score)})

        return await self._patch_user(user_uuid, ops)

    async def update_twist_data(self, user_uuid: str, twist_updates: dict):
        """
        Dynamically adds or updates hackathon twist data.
        """
        ops = []
        for key, value in twist_updates.items():
            ops.append({"op": "add", "path": f"/twistData/{key}", "value": value})
        
        if ops:
            return await self._patch_user(user_uuid, ops)
        return False
    
    async def delete_user(self, user_uuid:str):
        """
        Deletes user, cuz why not.
        """
        try:
            await self.database_session.delete_item(
                item=user_uuid,
                partition_key=user_uuid
            )

        except CosmosResourceNotFoundError:
            logger.error(f"User {user_uuid} not found.")
            return False
        except CosmosHttpResponseError as e:
            logger.error(f"Failed to delete user {user_uuid}: {e.http_error_message}")
            return False

