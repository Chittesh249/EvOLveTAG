"""
Site content (e.g. home page) key-value store. Admin can update.
"""
from app.extensions import db


class SiteContent(db.Model):
    __tablename__ = "site_content"

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(80), unique=True, nullable=False, index=True)
    value = db.Column(db.Text, nullable=True)

    @staticmethod
    def get_all_as_dict():
        rows = SiteContent.query.all()
        return {r.key: r.value for r in rows}
