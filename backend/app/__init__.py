"""
Evolve TAG backend application factory.
"""
import os

from flask import Flask

from config import config_by_name
from app.extensions import bcrypt, cors, db, jwt, migrate


def create_app(config_name=None):
    """Create and configure the Flask application."""
    config_name = config_name or os.environ.get("FLASK_ENV", "development")
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    if config_name == "production":
        if not app.config.get("SQLALCHEMY_DATABASE_URI"):
            raise ValueError("DATABASE_URI must be set in production")
        if not app.config.get("SECRET_KEY") or app.config["SECRET_KEY"] == "change-me-in-production":
            raise ValueError("SECRET_KEY must be set in production")

    # Ensure upload directory exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    from app.routes import auth_bp, profile_bp, admin_bp, papers_bp, newsletters_bp, site_bp, members_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(papers_bp, url_prefix="/api/papers")
    app.register_blueprint(newsletters_bp, url_prefix="/api/newsletters")
    app.register_blueprint(site_bp, url_prefix="/api/site")
    app.register_blueprint(members_bp, url_prefix="/api/members")

    # Error handlers
    @app.errorhandler(400)
    def bad_request(e):
        return {"success": False, "message": e.description or "Bad request"}, 400

    @app.errorhandler(401)
    def unauthorized(e):
        return {"success": False, "message": "Unauthorized"}, 401

    @app.errorhandler(403)
    def forbidden(e):
        return {"success": False, "message": e.description or "Forbidden"}, 403

    @app.errorhandler(404)
    def not_found(e):
        return {"success": False, "message": "Resource not found"}, 404

    @app.errorhandler(500)
    def internal_error(e):
        return {"success": False, "message": "Internal server error"}, 500

    return app
