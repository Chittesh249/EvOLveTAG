"""
Research paper model. Stores metadata and filename; file is on disk.
"""
from app.extensions import db


class Paper(db.Model):
    __tablename__ = "papers"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(120), nullable=False)
    filename = db.Column(db.String(255), nullable=False)

    def to_dict(self, base_url=""):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "file_url": f"{base_url}/api/papers/{self.id}",
        }
