import logging
from typing import Optional, Dict, Any, List

from fastapi import Depends, APIRouter, HTTPException, status, Query, Path, Body
from pydantic import BaseModel, Field

try:
    from backend.api.deps import get_users_container
    from backend.core.db.users_container import UsersContainer
except (ModuleNotFoundError, ImportError):
    from api.deps import get_users_container
    from core.db.users_container import UsersContainer

logging.basicConfig(
    level=logging.WARNING, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["users", "users crud"])


class CreateUserSchema(BaseModel):
    id: str = Field(..., description="Client generated UUID")
    email: str
    display_name: str = Field(..., alias="displayName")
    role: str = "user"
    avatar_url: str = Field(..., alias="avatarUrl")

    class Config:
        populate_by_name = True

class UpdateGeneralSchema(BaseModel):
    display_name: Optional[str] = Field(None, alias="displayName")
    avatar_url: Optional[str] = Field(None, alias="avatarUrl")

class UpdateVerificationSchema(BaseModel):
    is_verified: bool
    trust_score: Optional[int] = None


@router.post(
    "/", 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user"
)
async def create_user(
    user_data: CreateUserSchema,
    users_db: UsersContainer = Depends(get_users_container)
):
    """
    Creates a new user document in Cosmos DB.
    """
    result = await users_db.create_user(
        user_uuid=user_data.id,
        user_email=user_data.email,
        display_name=user_data.display_name,
        role=user_data.role,
        avatarUrl=user_data.avatar_url
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create user. ID may already exist or database is unreachable."
        )
    
    return result


@router.get(
    "/search", 
    summary="Search users by name or email"
)
async def search_users(
    term: str = Query(..., min_length=2, description="Search term (min 2 chars)"),
    limit: int = Query(20, le=50),
    users_db: UsersContainer = Depends(get_users_container)
):
    """
    Performs a case-insensitive 'STARTSWITH' search on displayName and email.
    """
    results = await users_db.search_users(search_term=term, limit=limit)
    return results


@router.patch(
    "/{user_id}/general", 
    summary="Update general profile info"
)
async def update_general_info(
    user_id: str = Path(..., description="The UUID of the user"),
    info: UpdateGeneralSchema = Body(...),
    users_db: UsersContainer = Depends(get_users_container)
):
    """
    Updates Display Name or Avatar URL.
    """
    success = await users_db.update_general_info(
        user_uuid=user_id,
        display_name=info.display_name,
        avatar_url=info.avatar_url
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found or update failed"
        )
    
    return {"status": "success", "message": "General info updated"}


@router.patch(
    "/{user_id}/verification", 
    summary="Update verification status"
)
async def update_verification(
    user_id: str = Path(...),
    verif_data: UpdateVerificationSchema = Body(...),
    users_db: UsersContainer = Depends(get_users_container)
):
    """
    Updates verification status (bool) and trust score (int).
    """
    success = await users_db.update_verification_status(
        user_uuid=user_id,
        is_verified=verif_data.is_verified,
        trust_score=verif_data.trust_score
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found or update failed"
        )
    
    return {"status": "success", "message": "Verification data updated"}


@router.patch(
    "/{user_id}/twist", 
    summary="Add or update twist data"
)
async def update_twist_data(
    user_id: str = Path(...),
    twist_data: Dict[str, Any] = Body(..., description="Arbitrary dictionary of twist data"),
    users_db: UsersContainer = Depends(get_users_container)
):
    """
    Dynamically adds fields to the 'twistData' object in the database.
    Accepts any JSON object.
    """
    success = await users_db.update_twist_data(
        user_uuid=user_id,
        twist_updates=twist_data
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found or update failed"
        )

    return {"status": "success", "message": "Twist data updated"}


@router.delete(
    "/{user_id}", 
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a user"
)
async def delete_user(
    user_id: str = Path(...),
    users_db: UsersContainer = Depends(get_users_container)
):
    """
    Hard deletes the user document.
    """
    await users_db.delete_user(user_uuid=user_id)
    
    return