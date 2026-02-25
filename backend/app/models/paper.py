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
        from flask import current_app
        # If Supabase is configured and we are in production (or if SUPABASE_URL is set), return the storage URL
        supabase_url = current_app.config.get("SUPABASE_URL")
        supabase_bucket = current_app.config.get("SUPABASE_BUCKET")

        if supabase_url and supabase_bucket:
             # Construct public URL: {SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{FILENAME}
             file_url = f"{supabase_url}/storage/v1/object/public/{supabase_bucket}/{self.filename}"
        else:
             file_url = f"{base_url}/api/papers/{self.id}"

        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "file_url": file_url,
        }
