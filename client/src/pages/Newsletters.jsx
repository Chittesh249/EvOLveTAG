import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { newslettersApi } from "../api/services";
import "./styles/Page.css";

export default function Newsletters() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    newslettersApi
      .list()
      .then((res) => {
        if (res.success && res.data) setList(res.data);
      })
      .catch(() => setError("Failed to load newsletters."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="container"><p className="muted">Loading newsletters…</p></div></div>;
  if (error) return <div className="page"><div className="container"><p className="error">{error}</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Newsletters</h1>
        <p className="page-subtitle">Updates and insights from Evolve TAG</p>
        <ul className="card-list">
          {list.map((n) => (
            <li key={n.id} className="card">
              <div className="card-body">
                <h2 className="card-title">{n.title}</h2>
                {n.published_at && <p className="text-sm muted">{new Date(n.published_at).toLocaleDateString()}</p>}
                {n.excerpt && <p className="card-excerpt">{n.excerpt}</p>}
                <Link to={`/newsletters/${n.slug || n.id}`} className="btn btn-primary btn-sm">
                  Read
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="muted">No newsletters yet.</p>}
      </div>
    </div>
  );
}
