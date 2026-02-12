import React, { useEffect, useState } from "react";
import { API_ORIGIN } from "../config";
import { papersApi } from "../api/services";
import "./styles/Page.css";
import "./styles/Papers.css";

export default function PaperList() {
  const [papers, setPapers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerUrl, setViewerUrl] = useState(null);

  useEffect(() => {
    papersApi
      .list()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setPapers(res.data);
      })
      .catch(() => setError("Failed to load papers."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = papers.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.toLowerCase().includes(search.toLowerCase())
  );

  const getPaperUrl = (paper) => {
    const path = paper.file_url || `/api/papers/${paper.id}`;
    return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
  };

  if (loading) return <div className="page"><div className="container"><p className="muted">Loading papers…</p></div></div>;
  if (error) return <div className="page"><div className="container"><p className="error">{error}</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Research papers</h1>
        <p className="page-subtitle">Browse and download publications</p>
        <div className="papers-toolbar">
          <input
            type="search"
            placeholder="Search by title or author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input papers-search"
            aria-label="Search papers"
          />
        </div>
        {filtered.length === 0 ? (
          <p className="muted">No papers found.</p>
        ) : (
          <ul className="papers-list">
            {filtered.map((paper) => (
              <li key={paper.id} className="card paper-item">
                <div className="paper-item-body">
                  <h2 className="card-title">{paper.title}</h2>
                  <p className="text-sm muted">By {paper.author}</p>
                  <div className="paper-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setViewerUrl(getPaperUrl(paper))}
                    >
                      View
                    </button>
                    <a
                      href={getPaperUrl(paper)}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {viewerUrl && (
        <div className="modal-backdrop" onClick={() => setViewerUrl(null)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setViewerUrl(null)} aria-label="Close">
              ×
            </button>
            <iframe src={viewerUrl} title="PDF viewer" className="pdf-iframe" />
          </div>
        </div>
      )}
    </div>
  );
}
