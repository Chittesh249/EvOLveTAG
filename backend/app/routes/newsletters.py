"""
Newsletters: list and get (public), create/update/delete (admin).
"""
from datetime import datetime

from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models import Newsletter
from app.utils import admin_required, slugify

newsletters_bp = Blueprint("newsletters", __name__)


@newsletters_bp.route("", methods=["GET"])
def list_newsletters():
    items = Newsletter.query.order_by(Newsletter.created_at.desc()).all()
    return jsonify({
        "success": True,
        "data": [n.to_list_dict() for n in items],
    }), 200


@newsletters_bp.route("/<slug_or_id>", methods=["GET"])
def get_newsletter(slug_or_id):
    if slug_or_id.isdigit():
        item = Newsletter.query.get(int(slug_or_id))
    else:
        item = Newsletter.query.filter_by(slug=slug_or_id).first()
    if not item:
        return jsonify({"success": False, "message": "Newsletter not found"}), 404
    return jsonify({"success": True, "data": item.to_dict()}), 200


@newsletters_bp.route("", methods=["POST"])
@admin_required
def create_newsletter():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    content = (data.get("content") or "").strip()
    excerpt = (data.get("excerpt") or "").strip() or None
    slug = (data.get("slug") or slugify(title)).strip() or "untitled"
    published = data.get("published", False)

    if not title or not content:
        return jsonify({"success": False, "message": "Title and content are required"}), 400

    if Newsletter.query.filter_by(slug=slug).first():
        return jsonify({"success": False, "message": "A newsletter with this slug already exists"}), 400

    item = Newsletter(
        title=title,
        slug=slug,
        content=content,
        excerpt=excerpt,
        published_at=datetime.utcnow() if published else None,
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"success": True, "message": "Newsletter created", "data": item.to_dict()}), 201


@newsletters_bp.route("/<int:newsletter_id>", methods=["PATCH", "DELETE"])
@admin_required
def update_or_delete_newsletter(newsletter_id):
    item = Newsletter.query.get_or_404(newsletter_id)
    if request.method == "DELETE":
        db.session.delete(item)
        db.session.commit()
        return jsonify({"success": True, "message": "Newsletter deleted"}), 200

    data = request.get_json(silent=True) or {}
    if "title" in data:
        item.title = (data["title"] or "").strip() or item.title
    if "content" in data:
        item.content = (data["content"] or "").strip() or item.content
    if "excerpt" in data:
        item.excerpt = (data["excerpt"] or "").strip() or None
    if "slug" in data and data["slug"]:
        item.slug = (data["slug"] or "").strip()
    if "published" in data:
        item.published_at = datetime.utcnow() if data["published"] else None
    db.session.commit()
    return jsonify({"success": True, "message": "Newsletter updated", "data": item.to_dict()}), 200
