"""
Current user profile: GET and PATCH (own profile).
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import User

profile_bp = Blueprint("profile", __name__)


def _get_current_user():
    uid = get_jwt_identity()
    return User.query.get(int(uid))


@profile_bp.route("", methods=["GET"])
@jwt_required()
def get_profile():
    user = _get_current_user()
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    return jsonify({"success": True, "data": user.to_dict(include_private=True)}), 200


@profile_bp.route("", methods=["PATCH"])
@jwt_required()
def update_profile():
    user = _get_current_user()
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    data = request.get_json(silent=True) or {}
    if "name" in data:
        user.name = (data["name"] or "").strip() or None
    if "bio" in data:
        user.bio = (data["bio"] or "").strip() or None
    db.session.commit()
    return jsonify({"success": True, "message": "Profile updated", "data": user.to_dict(include_private=True)}), 200
