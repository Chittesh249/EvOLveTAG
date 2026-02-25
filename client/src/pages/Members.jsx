import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { membersApi } from "../api/services";
import "./styles/Page.css";

export default function Members() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    membersApi
      .list()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setList(res.data);
      })
      .catch(() => setError("Failed to load members."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="container"><p className="muted">Loading members…</p></div></div>;
  if (error) return <div className="page"><div className="container"><p className="error">{error}</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Our Members</h1>
        <p className="page-subtitle">Research team and collaborators</p>
        <ul className="card-list">
          {list.map((m) => (
            <li key={m.id} className="card">
              <div className="card-body">
                <h2 className="card-title">{m.name}</h2>
                <p className="muted text-sm">{m.role}</p>
                {m.bio && <p className="card-excerpt">{m.bio}</p>}
                <Link to={`/members/${m.id}`} className="btn btn-primary btn-sm">
                  View profile
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="muted">No members yet.</p>}
      </div>
    </div>
  );
}
