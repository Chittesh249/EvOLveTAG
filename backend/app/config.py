import os

class Config:
    # Use environment variable or fallback for safety
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "postgresql://vasudevkishor@localhost/evolve_tag"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT secret should be kept safe and unique
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key")
