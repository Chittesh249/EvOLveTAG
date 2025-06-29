from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.middleware.roles_required import roles_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@roles_required('admin')
def admin_dashboard():
    return jsonify({'message': 'Welcome Admin! This is your dashboard.'})
