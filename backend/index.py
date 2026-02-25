import os
import sys
import traceback

# Ensure the backend directory is in the path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Log environment diagnostics
print(f"[VERCEL DEBUG] VERCEL env: {os.environ.get('VERCEL', 'NOT SET')}")
print(f"[VERCEL DEBUG] DATABASE_URL set: {bool(os.environ.get('DATABASE_URL'))}")
print(f"[VERCEL DEBUG] SUPABASE_URL set: {bool(os.environ.get('SUPABASE_URL'))}")
print(f"[VERCEL DEBUG] SUPABASE_KEY set: {bool(os.environ.get('SUPABASE_KEY'))}")
print(f"[VERCEL DEBUG] Python path: {sys.path[:3]}")

try:
    from app import create_app
    from app.extensions import db

    app = create_app()

    with app.app_context():
        try:
            db.create_all()
            print("[VERCEL DEBUG] Database tables created successfully")
        except Exception as e:
            print(f"[VERCEL DEBUG] Database init failed: {e}")

except Exception as e:
    print(f"[VERCEL DEBUG] FATAL: App failed to start: {e}")
    print(traceback.format_exc())

    # Create a minimal Flask app that returns the error so we can see it
    from flask import Flask, jsonify
    app = Flask(__name__)

    @app.route("/api/<path:path>", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
    def error_handler(path):
        return jsonify({
            "success": False,
            "message": f"Server startup error: {str(e)}",
        }), 500
