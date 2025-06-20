from mongoengine import Document, StringField, EmailField
from werkzeug.security import generate_password_hash, check_password_hash

class User(Document):
    name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)
    role = StringField(default='member')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'role': self.role
        }
