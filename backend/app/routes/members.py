"""
Public member list and public member profile (read-only). Per SRS: member pages publicly viewable.
"""
from flask import Blueprint, jsonify

from app.models import User

members_bp = Blueprint("members", __name__)


@members_bp.route("", methods=["GET"])
def list_members():
    users = User.query.order_by(User.name, User.id).all()
    return jsonify({
        "success": True,
        "data": [u.to_public_dict() for u in users],
    }), 200


@members_bp.route("/<int:user_id>", methods=["GET"])
def get_member(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "Member not found"}), 404
    return jsonify({"success": True, "data": user.to_public_dict()}), 200
