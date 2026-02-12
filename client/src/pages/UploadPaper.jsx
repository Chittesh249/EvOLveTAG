import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { papersApi } from "../api/services";
import "./styles/Page.css";
import "./styles/Upload.css";

export default function UploadPaper() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("author", author.trim());
      formData.append("file", file);
      const res = await papersApi.upload(formData);
      if (res.success) {
        navigate("/papers");
        return;
      }
      setError(res.message || "Upload failed.");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="container narrow">
        <h1 className="page-title">Upload paper</h1>
        <p className="page-subtitle">Add a research paper (PDF only)</p>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="upload-form">
              {error && <div className="message error" role="alert">{error}</div>}
              <label htmlFor="upload-title" className="label">Title</label>
              <input
                id="upload-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                required
              />
              <label htmlFor="upload-author" className="label">Author</label>
              <input
                id="upload-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="input"
                required
              />
              <label htmlFor="upload-file" className="label">PDF file</label>
              <input
                id="upload-file"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="input"
                required
              />
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Uploading…" : "Upload"}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => navigate("/papers")}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
