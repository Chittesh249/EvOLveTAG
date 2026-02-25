from app import create_app
from app.extensions import db

app = create_app()

with app.app_context():
    try:
        db.create_all()
    except Exception as e:
        print(f"Database initialization failed: {e}")


