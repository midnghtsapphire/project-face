"""
Project Face — Main FastAPI Application
AI-Powered Skin Analysis by GlowStarLabs
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.core.database import engine, Base
from app.api.router import api_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Project Face API",
    description=(
        "AI-Powered Skin Analysis by GlowStarLabs. "
        "Part of the Audrey Evans ecosystem. "
        "Analyze skin health, get personalized recommendations, "
        "find clinical trials, and track your skin journey."
    ),
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    contact={
        "name": "GlowStarLabs",
        "url": "https://rvvel.com",
        "email": "angelreporters@gmail.com",
    },
    license_info={
        "name": "Proprietary",
    },
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)

# Serve uploads
uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/", tags=["Root"])
def root():
    """Root endpoint — API health check."""
    return {
        "app": "Project Face",
        "version": settings.APP_VERSION,
        "status": "healthy",
        "brand": "GlowStarLabs",
        "hub": "https://rvvel.com",
        "docs": "/api/docs",
    }


@app.get("/health", tags=["Root"])
def health_check():
    """Health check endpoint for Docker/load balancer."""
    return {"status": "ok"}
