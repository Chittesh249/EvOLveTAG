"""
Application configuration. Values are read from environment variables
with sensible defaults for local development.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent


class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-in-production")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or os.environ.get("SECRET_KEY", "change-me-in-production")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour in seconds
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER") or str(BASE_DIR / "uploads")
    ALLOWED_EXTENSIONS = {"pdf"}

    # Supabase settings
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
    SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "papers")


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        os.environ.get("DATABASE_URI", "postgresql://vasudevkishor@localhost/evolve_tag")
    )


class ProductionConfig(Config):
    """Production configuration. DATABASE_URI and SECRET_KEY are validated when this config is used."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or os.environ.get("DATABASE_URI")
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-in-production")


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    JWT_ACCESS_TOKEN_EXPIRES = 60
    UPLOAD_FOLDER = str(BASE_DIR / "test_uploads")


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}
