from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_cors import CORS
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from enum import Enum
from datetime import timedelta
import os

# === Setup ===
app = Flask(__name__)
CORS(app)

# === Config ===
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://vasudevkishor@localhost/evolve_tag'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # 🔒 Change in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload

# === Init ===
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# === Role Enum ===
class RoleEnum(Enum):
    ADMIN = 'ADMIN'
    MEMBER = 'MEMBER'

# === Models ===
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False, default=RoleEnum.MEMBER)
    name = db.Column(db.String(120), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Paper(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(120), nullable=False)
    filename = db.Column(db.String(255), nullable=False)

# === Helper ===
ALLOWED_EXTENSIONS = {'pdf'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# === Auth Routes ===

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

# === Profile Routes ===

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

# === Admin Route ===

@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    claims = get_jwt()
    if claims.get('role') != 'ADMIN':
        return jsonify({'msg': 'Admins only'}), 403

    users = User.query.all()
    return jsonify([
        {
            'id': u.id,
            'email': u.email,
            'role': u.role.name,
            'name': u.name,
            'bio': u.bio
        } for u in users
    ]), 200

# === Paper Routes ===

@app.route('/api/papers', methods=['POST'])
@jwt_required()
def upload_paper():
    claims = get_jwt()
    if claims.get('role') != 'ADMIN':
        return jsonify({'msg': 'Admins only'}), 403

    if 'file' not in request.files:
        return jsonify({'msg': 'No file part'}), 400

    file = request.files['file']
    title = request.form.get('title')
    author = request.form.get('author')

    if not file or file.filename == '':
        return jsonify({'msg': 'No selected file'}), 400
    if not allowed_file(file.filename):
        return jsonify({'msg': 'Only PDF files allowed'}), 400
    if not title or not author:
        return jsonify({'msg': 'Title and author are required'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    paper = Paper(title=title, author=author, filename=filename)
    db.session.add(paper)
    db.session.commit()

    return jsonify({'msg': 'Paper uploaded successfully'}), 201

@app.route('/api/papers', methods=['GET'])
def list_papers():
    papers = Paper.query.all()
    return jsonify([
        {
            'id': p.id,
            'title': p.title,
            'author': p.author,
            'file_url': f'/api/papers/{p.id}'
        } for p in papers
    ]), 200

@app.route('/api/papers/<int:paper_id>', methods=['GET'])
def get_paper(paper_id):
    paper = Paper.query.get_or_404(paper_id)
    return send_from_directory(app.config['UPLOAD_FOLDER'], paper.filename, as_attachment=False)

# === Init ===
if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    with app.app_context():
        db.create_all()
    app.run(debug=True)
