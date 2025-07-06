from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_cors import CORS
from enum import Enum
from datetime import timedelta
from flask_migrate import Migrate


app = Flask(__name__)
CORS(app)

# === Configuration ===
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://vasudevkishor@localhost/evolve_tag'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # 🔒 Replace in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# === Role Enum ===
class RoleEnum(Enum):
    ADMIN = 'ADMIN'
    MEMBER = 'MEMBER'

# === User Model ===
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False, default=RoleEnum.MEMBER)
    name = db.Column(db.String(120), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

# === Routes ===

# Register
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'MEMBER').upper()

    if not email or not password:
        return jsonify({'msg': 'Email and password required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'User already exists'}), 400

    try:
        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(email=email, password_hash=hashed_pw, role=RoleEnum[role])
        db.session.add(user)
        db.session.commit()
        return jsonify({'msg': 'User registered successfully'}), 201
    except KeyError:
        return jsonify({'msg': 'Invalid role'}), 400

# Login
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'msg': 'Invalid credentials'}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={'role': user.role.name}
    )
    return jsonify({'access_token': access_token}), 200

# Get Profile
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'email': user.email,
        'role': user.role.name,
        'name': user.name,
        'bio': user.bio
    }), 200

# Update Profile
@app.route('/api/profile', methods=['PATCH'])
@jwt_required()
def update_profile():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    data = request.json
    user.name = data.get('name', user.name)
    user.bio = data.get('bio', user.bio)
    db.session.commit()

    return jsonify({'msg': 'Profile updated'}), 200

# === Run ===
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
