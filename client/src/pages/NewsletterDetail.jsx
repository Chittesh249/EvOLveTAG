import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { newslettersApi } from "../api/services";
import "./styles/Page.css";

export default function NewsletterDetail() {
  const { slugOrId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slugOrId) return;
    newslettersApi
      .get(slugOrId)
      .then((res) => {
        if (res.success && res.data) setItem(res.data);
        else setError("Newsletter not found.");
      })
      .catch(() => setError("Failed to load newsletter."))
      .finally(() => setLoading(false));
  }, [slugOrId]);

  if (loading) return <div className="page"><div className="container"><p className="muted">Loading…</p></div></div>;
  if (error || !item) return <div className="page"><div className="container"><p className="error">{error || "Not found."}</p><Link to="/newsletters">Back to newsletters</Link></div></div>;

  return (
    <div className="page">
      <div className="container narrow">
        <Link to="/newsletters" className="back-link">← Newsletters</Link>
        <article className="card article">
          <div className="card-body">
            <h1 className="page-title">{item.title}</h1>
            {item.published_at && <p className="text-sm muted">{new Date(item.published_at).toLocaleDateString()}</p>}
            <div className="prose newsletter-content">
              {item.content?.split("\n").map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
