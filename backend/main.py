try:
    from backend.config import settings    
except (ImportError, ModuleNotFoundError):
    from config import settings

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException
import fastapi
from fastapi.middleware.cors import CORSMiddleware


# TODO: setup db connection pool
# @asynccontextmanager
# async def lifespan(app:fastapi)


app = FastAPI(
  title=settings.PROJECT_NAME,
  openapi_url=f"{settings.API_VERSION}/openapi.json",
  root_path=settings.ROOT_PATH,
#   lifespan=lifespan  
)

@app.get("/", tags=["entrypoint"])
async def index():
    """Basic welcome endpoint."""
    return {
        "message": "Test from Python Server",
    }

@app.get("/health", tags=["health, health check"])
async def health_check():
    """Simple health check endpoint that confirms backend services and dependencies are online"""
    return{
        "status": "healthy",
        "credentials_loaded": settings.IS_LOADED,
    }