"""
Research papers: list (public), get file (public), upload (auth + member/admin).
"""
import os

from flask import Blueprint, request, jsonify, send_from_directory, current_app, redirect
from flask_jwt_extended import jwt_required, get_jwt

from app.extensions import db
from app.models import Paper
from app.utils import allowed_file, secure_paper_filename, admin_required

papers_bp = Blueprint("papers", __name__)


def get_supabase_client():
    url = current_app.config.get("SUPABASE_URL")
    key = current_app.config.get("SUPABASE_KEY")
    if url and key:
        from supabase import create_client
        return create_client(url, key)
    return None


@papers_bp.route("", methods=["GET"])
def list_papers():
    papers = Paper.query.order_by(Paper.id.desc()).all()
    return jsonify({
        "success": True,
        "data": [p.to_dict(base_url="") for p in papers],
    }), 200


@papers_bp.route("/<int:paper_id>", methods=["GET"])
def get_paper(paper_id):
    paper = Paper.query.get_or_404(paper_id)
    
    supabase_url = current_app.config.get("SUPABASE_URL")
    supabase_bucket = current_app.config.get("SUPABASE_BUCKET")
    
    if supabase_url and supabase_bucket:
        # Redirect to public storage URL
        file_url = f"{supabase_url}/storage/v1/object/public/{supabase_bucket}/{paper.filename}"
        return redirect(file_url)
    
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    path = os.path.abspath(upload_folder)
    return send_from_directory(path, paper.filename, as_attachment=False)


@papers_bp.route("", methods=["POST"])
@jwt_required()
def upload_paper():
    claims = get_jwt()
    if claims.get("role") not in ("ADMIN", "MEMBER"):
        return jsonify({"success": False, "message": "Only members or admins can upload papers"}), 403

    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file provided"}), 400

    file = request.files["file"]
    title = (request.form.get("title") or "").strip()
    author = (request.form.get("author") or "").strip()

    if not file or not file.filename:
        return jsonify({"success": False, "message": "No file selected"}), 400
    if not allowed_file(file.filename, current_app.config.get("ALLOWED_EXTENSIONS", {"pdf"})):
        return jsonify({"success": False, "message": "Only PDF files are allowed"}), 400
    if not title or not author:
        return jsonify({"success": False, "message": "Title and author are required"}), 400

    filename = secure_paper_filename(file.filename)
    
    supabase = get_supabase_client()
    supabase_bucket = current_app.config.get("SUPABASE_BUCKET")
    
    if supabase and supabase_bucket:
        try:
            # Upload to Supabase Storage
            file_content = file.read()
            supabase.storage.from_(supabase_bucket).upload(
                path=filename,
                file=file_content,
                file_options={"content-type": "application/pdf"}
            )
        except Exception as e:
            return jsonify({"success": False, "message": f"Supabase upload failed: {str(e)}"}), 500
    else:
        # Fallback to local storage
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

    paper = Paper(title=title, author=author, filename=filename)
    db.session.add(paper)
    db.session.commit()
    return jsonify({
        "success": True,
        "message": "Paper uploaded successfully",
        "data": paper.to_dict(base_url=""),
    }), 201
