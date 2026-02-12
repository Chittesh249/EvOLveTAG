"""
Shared utilities: file checks, decorators.
"""
import re
from functools import wraps

from flask import request
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from werkzeug.utils import secure_filename


def allowed_file(filename, allowed_extensions=None):
    if not filename or "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in (allowed_extensions or {"pdf"})


def secure_paper_filename(filename):
    base = secure_filename(filename)
    if not base.lower().endswith(".pdf"):
        base = base + ".pdf"
    return base


def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text.strip("-") or "untitled"


def admin_required(fn):
    """Decorator: require valid JWT and ADMIN role."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if claims.get("role") != "ADMIN":
            return {"success": False, "message": "Admin access required"}, 403
        return fn(*args, **kwargs)
    return wrapper


def get_current_user_id():
    """After verify_jwt_in_request(), returns current user id (int)."""
    from flask_jwt_extended import get_jwt_identity
    return int(get_jwt_identity())
