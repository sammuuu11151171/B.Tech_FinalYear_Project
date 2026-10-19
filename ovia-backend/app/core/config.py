import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "OVIA - AI-Powered Inclusive Learning Portal for Deaf and Mute Individuals"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # JWT & Auth
    SECRET_KEY: str = "ovia_super_secure_jwt_signing_key_for_isl_learning_portal_2026_btech"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for development convenience
    
    # Database (PostgreSQL with SQLite local fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ovia.db")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # AI/ML Sign Recognition paths
    ML_MODEL_PATH: str = os.getenv("ML_MODEL_PATH", "../ovia-ML/models/isl_baseline_model.pkl")
    ML_LABELS_PATH: str = os.getenv("ML_LABELS_PATH", "../ovia-ML/models/isl_classes.json")
    
    # RAG & LLM Configuration
    RAG_KNOWLEDGE_DIR: str = os.getenv("RAG_KNOWLEDGE_DIR", "../rag/knowledge_base")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "curated_fallback")  # 'gemini', 'openai', or 'curated_fallback'
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Storage & Uploads
    STATIC_DIR: str = "static"
    UPLOAD_DIR: str = "static/uploads"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="allow",
    )

settings = Settings()
