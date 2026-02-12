import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { membersApi } from "../api/services";
import "./styles/Page.css";

export default function MemberProfile() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    membersApi
      .get(Number(id))
      .then((res) => {
        if (res.success && res.data) setMember(res.data);
        else setError("Member not found.");
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><div className="container"><p className="muted">Loading…</p></div></div>;
  if (error || !member) return <div className="page"><div className="container"><p className="error">{error || "Not found."}</p><Link to="/members">Back to members</Link></div></div>;

  return (
    <div className="page">
      <div className="container">
        <Link to="/members" className="back-link">← Members</Link>
        <article className="card profile-card">
          <div className="card-body">
            <h1 className="page-title">{member.name}</h1>
            <p className="muted text-sm">{member.role}</p>
            {member.bio && <div className="prose"><p>{member.bio}</p></div>}
          </div>
        </article>
      </div>
    </div>
  );
}
