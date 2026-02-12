"""
Public site content (e.g. home page copy). Read-only for public; admin updates via /api/admin/site.
"""
from flask import Blueprint, jsonify

from app.models import SiteContent

site_bp = Blueprint("site", __name__)


@site_bp.route("", methods=["GET"])
def get_site_content():
    content = SiteContent.get_all_as_dict()
    return jsonify({"success": True, "data": content}), 200
