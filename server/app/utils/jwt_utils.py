import jwt
import datetime
from flask import current_app

def generate_token(user_id):
    payload = {
        'id': str(user_id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
