"""
API blueprints. Register in app factory.
"""
from app.routes.auth import auth_bp
from app.routes.profile import profile_bp
from app.routes.admin import admin_bp
from app.routes.papers import papers_bp
from app.routes.newsletters import newsletters_bp
from app.routes.site import site_bp
from app.routes.members import members_bp

__all__ = [
    "auth_bp",
    "profile_bp",
    "admin_bp",
    "papers_bp",
    "newsletters_bp",
    "site_bp",
    "members_bp",
]
