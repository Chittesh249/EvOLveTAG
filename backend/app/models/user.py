"""
User model and role enum. Used for authentication and profile (member) data.
"""
from enum import Enum as PyEnum

from app.extensions import bcrypt, db


class RoleEnum(PyEnum):
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False, default=RoleEnum.MEMBER)
    name = db.Column(db.String(120), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self, include_private=False):
        d = {
            "id": self.id,
            "email": self.email,
            "role": self.role.name,
            "name": self.name,
            "bio": self.bio,
        }
        if include_private:
            d["email"] = self.email
        return d

    def to_public_dict(self):
        """For public member listing: no email, safe for visitors."""
        return {
            "id": self.id,
            "name": self.name or "Member",
            "bio": (self.bio or "")[:200],
            "role": self.role.name,
        }
