from flask import Blueprint, request, jsonify
from app.middleware.auth_required import auth_required

profile = Blueprint('profile', __name__)

@profile.route('/me', methods=['GET'])
@auth_required
def get_profile(current_user):
    return jsonify({'user': current_user.to_dict()})
