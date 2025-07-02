from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.middleware.roles_required import roles_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@roles_required('admin')  # Only admins can access
def admin_dashboard():
    current_user_id = get_jwt_identity()
    return jsonify({
        'message': 'Welcome Admin! This is your dashboard.',
        'user_id': current_user_id
    }), 200
