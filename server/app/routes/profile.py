from flask import Blueprint, jsonify, request
from app.middleware.auth_required import auth_required

profile = Blueprint('profile', __name__)

@profile.route('/me', methods=['GET'])
@auth_required
def get_profile(current_user):
    return jsonify({'user': current_user.to_dict()})


@profile.route('/me', methods=['PUT'])
@auth_required
def update_profile(current_user):
    data = request.get_json()

    # Only update provided fields
    if 'name' in data:
        current_user.name = data['name']
    if 'bio' in data:
        current_user.bio = data['bio']
    if 'designation' in data:
        current_user.designation = data['designation']
    if 'social' in data:
        current_user.social = data['social']
    if 'profile_pic_url' in data:
        current_user.profile_pic_url = data['profile_pic_url']

    current_user.save()
    return jsonify({'message': 'Profile updated', 'user': current_user.to_dict()})
