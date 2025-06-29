from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from enum import Enum
from sqlalchemy import Enum as SQLAlchemyEnum

# Define user roles
class RoleEnum(Enum):
    ADMIN = 'admin'
    MEMBER = 'member'

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(SQLAlchemyEnum(RoleEnum), default=RoleEnum.MEMBER, nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role.value  # convert Enum to string
        }
