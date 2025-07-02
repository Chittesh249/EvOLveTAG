from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User, RoleEnum
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    role = data.get('role', 'member')  # default to 'member'

    # Validate inputs
    if not all([email, name, password]):
        return jsonify({'error': 'Missing fields'}), 400

    # Check valid role
    if role not in [r.value for r in RoleEnum]:
        return jsonify({'error': 'Invalid role'}), 400

    # Check if email already registered
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    # Create and save user
    user = User(email=email, name=name, role=RoleEnum(role))
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Fetch user
    user = User.query.filter_by(email=email).first()

    # Validate credentials
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Only allow admin/member roles
    if user.role not in [RoleEnum.ADMIN, RoleEnum.MEMBER]:
        return jsonify({'message': 'You are not authorized to log in'}), 403

    # Generate JWT token
    token = create_access_token(identity=user.id)

    return jsonify({'token': token, 'user': user.to_dict()}), 200
