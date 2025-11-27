import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

ENV_PATH = "backend/.env"
is_loaded=load_dotenv(dotenv_path=ENV_PATH)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "Clarissell"
    API_VERSION:str = "/api/v1"
    ROOT_PATH: str = "/api"

    CORS_ORIGINS: List[str] = [
        "http://localhost:5173", # idk if this is the one for nextjs or whatever you guys will use, just change it
        "http://127.0.0.1:5173",
        # ADD VERCEL URL HERE
    ]

    DATABASE_URI: str | None  = os.getenv("DATABASE_URI")    
    DATABASE_KEY: str | None = os.getenv("DATABASE_KEY")
    DATABASE_ID: str | None = os.getenv("DATABASE_ID")

    STORAGE_ACCOUNT_NAME : str | None = os.getenv("STORAGE_ACCOUNT_NAME")
    STORAGE_ACCOUNT_KEY : str | None = os.getenv("STORAGE_ACCOUNT_KEY")
    STORAGE_CONNECTION_STRING : str | None = os.getenv("STORAGE_CONNECTION_STRING")

    IS_LOADED: bool  = is_loaded

settings = Settings()
