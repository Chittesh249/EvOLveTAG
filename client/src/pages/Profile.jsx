import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { profileApi } from "../api/services";
import "./styles/Page.css";
import "./styles/Profile.css";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setSaving(true);
    try {
      const res = await profileApi.update({ name: name.trim() || null, bio: bio.trim() || null });
      if (res.success) {
        setMessage({ type: "success", text: "Profile updated." });
        refreshUser();
      } else {
        setMessage({ type: "error", text: res.message || "Update failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Update failed." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="container narrow">
        <h1 className="page-title">Your profile</h1>
        <p className="page-subtitle">Manage your public profile</p>
        <div className="card">
          <div className="card-body">
            <dl className="profile-meta">
              <dt>Email</dt>
              <dd>{user?.email}</dd>
              <dt>Role</dt>
              <dd>{user?.role}</dd>
            </dl>
            <form onSubmit={handleSubmit} className="profile-form">
              {message.text && (
                <div className={message.type === "success" ? "message success" : "message error"} role="alert">
                  {message.text}
                </div>
              )}
              <label htmlFor="profile-name" className="label">Display name</label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
              <label htmlFor="profile-bio" className="label">Bio</label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input"
                rows={4}
              />
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
