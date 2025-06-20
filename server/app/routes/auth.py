from flask import Blueprint, request, jsonify, current_app
from app.models import User
from app.utils.jwt_utils import generate_token
from mongoengine.errors import NotUniqueError

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    try:
        user = User(
            name=data.get('name'),
            email=data.get('email'),
            role=data.get('role', 'member')
        )
        user.set_password(data.get('password'))
        user.save()

        token = generate_token(user.id)
        return jsonify({'token': token, 'user': user.to_dict()}), 201

    except NotUniqueError:
        return jsonify({'error': 'Email already registered'}), 400

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.objects(email=data.get('email')).first()
    if user and user.check_password(data.get('password')):
        token = generate_token(user.id)
        return jsonify({'token': token, 'user': user.to_dict()}), 200
    return jsonify({'error': 'Invalid credentials'}), 401
