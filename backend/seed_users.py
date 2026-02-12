"""
Create sample users (one per role) and print credentials.
Run from backend directory: python seed_users.py
"""
import os
import sys

# Add backend directory to path so config and app are importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import bcrypt, db
from app.models import User, RoleEnum

# Credentials (change in production)
SAMPLE_USERS = [
    {
        "email": "admin@evolvetag.local",
        "password": "Admin123!",
        "role": RoleEnum.ADMIN,
        "name": "Site Admin",
        "bio": "Platform administrator.",
    },
    {
        "email": "member@evolvetag.local",
        "password": "Member123!",
        "role": RoleEnum.MEMBER,
        "name": "Jane Researcher",
        "bio": "Research team member.",
    },
]


def main():
    app = create_app(config_name=os.environ.get("FLASK_ENV", "development"))
    with app.app_context():
        db.create_all()
        created = []
        for u in SAMPLE_USERS:
            if User.query.filter_by(email=u["email"]).first():
                print(f"User already exists: {u['email']}")
                continue
            user = User(
                email=u["email"],
                password_hash=bcrypt.generate_password_hash(u["password"]).decode("utf-8"),
                role=u["role"],
                name=u.get("name"),
                bio=u.get("bio"),
            )
            db.session.add(user)
            created.append(u)
        db.session.commit()

        if not created:
            print("No new users created (all already exist).")
        else:
            print(f"Created {len(created)} user(s).")

        print("\n" + "=" * 50)
        print("SAMPLE CREDENTIALS")
        print("=" * 50)
        for u in SAMPLE_USERS:
            print(f"\n  Role:   {u['role'].name}")
            print(f"  Email:  {u['email']}")
            print(f"  Pass:   {u['password']}")
        print("\n" + "=" * 50)


if __name__ == "__main__":
    main()
