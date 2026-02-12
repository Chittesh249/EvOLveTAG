"""
Admin-only: list users, update any user profile, manage site content.
"""
from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models import User, SiteContent
from app.utils import admin_required, get_current_user_id

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/users", methods=["GET"])
@admin_required
def list_users():
    users = User.query.order_by(User.email).all()
    return jsonify({
        "success": True,
        "data": [u.to_dict(include_private=True) for u in users],
    }), 200


@admin_bp.route("/users/<int:user_id>", methods=["GET", "PATCH"])
@admin_required
def user_by_id(user_id):
    user = User.query.get_or_404(user_id)
    if request.method == "GET":
        return jsonify({"success": True, "data": user.to_dict(include_private=True)}), 200

    data = request.get_json(silent=True) or {}
    if "name" in data:
        user.name = (data["name"] or "").strip() or None
    if "bio" in data:
        user.bio = (data["bio"] or "").strip() or None
    if "role" in data:
        try:
            from app.models import RoleEnum
            user.role = RoleEnum[data["role"].upper()]
        except (KeyError, AttributeError):
            pass
    db.session.commit()
    return jsonify({"success": True, "message": "User updated", "data": user.to_dict(include_private=True)}), 200


@admin_bp.route("/site", methods=["GET", "PUT"])
@admin_required
def site_content():
    if request.method == "GET":
        content = SiteContent.get_all_as_dict()
        return jsonify({"success": True, "data": content}), 200

    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify({"success": False, "message": "Expected JSON object"}), 400
    for key, value in data.items():
        key = str(key).strip()
        if not key:
            continue
        row = SiteContent.query.filter_by(key=key).first()
        if row:
            row.value = value if value is None else str(value)
        else:
            db.session.add(SiteContent(key=key, value=value if value is None else str(value)))
    db.session.commit()
    return jsonify({"success": True, "message": "Site content updated", "data": SiteContent.get_all_as_dict()}), 200
