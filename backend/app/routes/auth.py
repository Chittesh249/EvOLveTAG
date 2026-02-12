"""
Authentication: register, login.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from app.extensions import bcrypt, db
from app.models import User, RoleEnum

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = data.get("password")
    role_str = (data.get("role") or "MEMBER").upper()

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "An account with this email already exists"}), 400

    try:
        role = RoleEnum[role_str]
    except KeyError:
        return jsonify({"success": False, "message": "Invalid role"}), 400

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(email=email, password_hash=hashed, role=role)
    db.session.add(user)
    db.session.commit()
    return jsonify({"success": True, "message": "Registration successful. You can now log in."}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role.name},
    )
    return jsonify({
        "success": True,
        "access_token": token,
        "user": user.to_dict(include_private=True),
    }), 200
