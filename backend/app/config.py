# app/config.py

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://vasudevkishor@localhost/evolve_tag"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "your_jwt_secret_key"
