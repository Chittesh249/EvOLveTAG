from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_cors import CORS
from enum import Enum
from datetime import timedelta

app = Flask(__name__)
CORS(app)

# === Configuration ===
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://vasudevkishor@localhost/evolve_tag'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # 🔒 Replace for production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

db = SQLAlchemy(app)
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

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

# === Routes ===

# Registration Route
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

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    try:
        user = User(email=email, password_hash=hashed_pw, role=RoleEnum[role])
        db.session.add(user)
        db.session.commit()
        return jsonify({'msg': 'User registered successfully'}), 201
    except KeyError:
        return jsonify({'msg': 'Invalid role'}), 400

# Login Route
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'msg': 'Invalid credentials'}), 401

    access_token = create_access_token(
        identity=str(user.id),  # 👈 MUST be a string
        additional_claims={'role': user.role.name}
    )
    return jsonify({'access_token': access_token}), 200

# Protected Profile Route
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))

    if not user:
        return jsonify({'msg': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'email': user.email,
        'role': user.role.name
    }), 200

# === Run Server ===
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
