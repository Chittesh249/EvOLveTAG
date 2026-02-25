import os
import sys

# Ensure the backend directory is in the path to allow importing 'app' and 'config'
current_dir = os.path.dirname(__file__)
if current_dir not in sys.path:
    sys.path.append(current_dir)

from app import create_app
from app.extensions import db

app = create_app()

with app.app_context():
    try:
        db.create_all()
    except Exception as e:
        print(f"Database initialization failed: {e}")


