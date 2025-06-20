from mongoengine import Document, StringField, EmailField, URLField, DictField
from werkzeug.security import generate_password_hash, check_password_hash

class User(Document):
    name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)
    role = StringField(default='member')

    # 🔽 New profile fields
    bio = StringField()
    designation = StringField()
    social = DictField()  # e.g., {"twitter": "...", "linkedin": "..."}
    profile_pic_url = URLField()  # URL to profile picture

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'bio': self.bio,
            'designation': self.designation,
            'social': self.social,
            'profile_pic_url': self.profile_pic_url
        }
