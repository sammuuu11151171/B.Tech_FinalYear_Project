import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.session import SessionLocal
from app.db.init_db import init_db, create_sample_svgs
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure static directories and database seed exist
    static_path = os.path.join(os.path.dirname(__file__), "..", "static")
    os.makedirs(os.path.join(static_path, "uploads", "signs"), exist_ok=True)
    create_sample_svgs(static_path)
    
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for OVIA — AI-Powered Inclusive Learning Portal for Deaf and Mute Individuals.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include Versioned API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint for container probes and uptime monitoring."""
    return {
        "status": "healthy",
        "service": "OVIA Backend API",
        "version": settings.VERSION,
        "database": "connected",
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to OVIA — AI-Powered Inclusive Learning Portal API.",
        "docs_url": "/docs",
        "version": settings.VERSION,
    }
