"""
SQLAlchemy models. Import all models here so they are registered with the app.
"""
from app.models.user import User, RoleEnum
from app.models.paper import Paper
from app.models.newsletter import Newsletter
from app.models.site_content import SiteContent

__all__ = ["User", "RoleEnum", "Paper", "Newsletter", "SiteContent"]
