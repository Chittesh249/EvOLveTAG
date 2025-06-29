from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from app.config import Config


db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp)
    from app.routes.admin import admin_bp
    app.register_blueprint(admin_bp)

    return app
