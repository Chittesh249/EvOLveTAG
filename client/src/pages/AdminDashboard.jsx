import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, newslettersApi } from "../api/services";
import "./styles/Page.css";
import "./styles/Admin.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // User edit modal
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: "", bio: "", role: "MEMBER" });
  const [userSaving, setUserSaving] = useState(false);

  // Newsletter form (create / edit)
  const [newsletterForm, setNewsletterForm] = useState(null);
  const [newsletterFormData, setNewsletterFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
  });
  const [newsletterSaving, setNewsletterSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = () =>
    adminApi.users.list().then((res) => {
      if (res.success && res.data) setUsers(res.data);
    });

  const loadNewsletters = () =>
    newslettersApi.list().then((res) => {
      if (res.success && res.data) setNewsletters(res.data);
    });

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([loadUsers(), loadNewsletters()])
      .catch(() => setError("Failed to load data."))
      .finally(() => setLoading(false));
  }, []);

  const openEditUser = (u) => {
    setEditingUser(u);
    setUserForm({ name: u.name || "", bio: u.bio || "", role: u.role || "MEMBER" });
  };

  const saveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setUserSaving(true);
    setMessage(null);
    try {
      const res = await adminApi.users.update(editingUser.id, userForm);
      if (res.success) {
        setMessage({ type: "success", text: "User updated." });
        setEditingUser(null);
        loadUsers();
      } else {
        setMessage({ type: "error", text: res.message || "Update failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Update failed." });
    } finally {
      setUserSaving(false);
    }
  };

  const openAddNewsletter = () => {
    setNewsletterForm("create");
    setNewsletterFormData({ title: "", slug: "", excerpt: "", content: "", published: false });
  };

  const openEditNewsletter = async (n) => {
    setNewsletterForm(n.id);
    setNewsletterFormData({
      title: n.title || "",
      slug: n.slug || "",
      excerpt: n.excerpt || "",
      content: "",
      published: !!n.published_at,
    });
    const res = await newslettersApi.get(n.slug || n.id);
    if (res.success && res.data) {
      setNewsletterFormData((prev) => ({
        ...prev,
        title: res.data.title || prev.title,
        slug: res.data.slug || prev.slug,
        excerpt: res.data.excerpt || prev.excerpt,
        content: res.data.content || "",
        published: !!res.data.published_at,
      }));
    }
  };

  const slugFromTitle = (title) =>
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[-\s]+/g, "-")
      .trim() || "untitled";

  const saveNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterSaving(true);
    setMessage(null);
    try {
      if (newsletterForm === "create") {
        const res = await adminApi.newsletters.create({
          ...newsletterFormData,
          slug: newsletterFormData.slug || slugFromTitle(newsletterFormData.title),
        });
        if (res.success) {
          setMessage({ type: "success", text: "Newsletter created." });
          setNewsletterForm(null);
          loadNewsletters();
        } else {
          setMessage({ type: "error", text: res.message || "Create failed." });
        }
      } else {
        const res = await adminApi.newsletters.update(newsletterForm, {
          ...newsletterFormData,
          published: newsletterFormData.published,
        });
        if (res.success) {
          setMessage({ type: "success", text: "Newsletter updated." });
          setNewsletterForm(null);
          loadNewsletters();
        } else {
          setMessage({ type: "error", text: res.message || "Update failed." });
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Request failed." });
    } finally {
      setNewsletterSaving(false);
    }
  };

  const deleteNewsletter = async (id) => {
    if (!window.confirm("Delete this newsletter?")) return;
    setDeletingId(id);
    try {
      const res = await adminApi.newsletters.delete(id);
      if (res.success) {
        setMessage({ type: "success", text: "Newsletter deleted." });
        setNewsletterForm(null);
        loadNewsletters();
      } else {
        setMessage({ type: "error", text: res.message || "Delete failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Delete failed." });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="page"><div className="container"><p className="muted">Loading…</p></div></div>;
  if (error) return <div className="page"><div className="container"><p className="error">{error}</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Admin</h1>
        <p className="page-subtitle">Manage users and newsletters</p>

        {message && (
          <div className={`admin-message ${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <div className="admin-actions">
          <Link to="/upload" className="btn btn-primary">Upload paper</Link>
          <div className="admin-tabs">
            <button
              type="button"
              className={`tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              type="button"
              className={`tab ${activeTab === "newsletters" ? "active" : ""}`}
              onClick={() => setActiveTab("newsletters")}
            >
              Newsletters
            </button>
          </div>
        </div>

        {activeTab === "users" && (
          <section className="card">
            <div className="card-body">
              <h2 className="section-title">Users</h2>
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.email}</td>
                        <td>{u.name || "—"}</td>
                        <td><span className="badge">{u.role}</span></td>
                        <td>
                          <button type="button" className="btn-link" onClick={() => openEditUser(u)}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {activeTab === "newsletters" && (
          <section className="card">
            <div className="card-body">
              <div className="section-header">
                <h2 className="section-title">Newsletters</h2>
                <button type="button" className="btn btn-primary btn-sm" onClick={openAddNewsletter}>
                  Add newsletter
                </button>
              </div>
              {newsletters.length === 0 ? (
                <p className="muted">No newsletters yet. Add one to get started.</p>
              ) : (
                <ul className="admin-list">
                  {newsletters.map((n) => (
                    <li key={n.id} className="admin-list-item">
                      <div>
                        <strong>{n.title}</strong>
                        {n.published_at && <span className="muted text-sm"> · {new Date(n.published_at).toLocaleDateString()}</span>}
                      </div>
                      <div className="admin-list-actions">
                        <button type="button" className="btn-link" onClick={() => openEditNewsletter(n)}>Edit</button>
                        <button
                          type="button"
                          className="btn-link danger"
                          onClick={() => deleteNewsletter(n.id)}
                          disabled={deletingId === n.id}
                        >
                          {deletingId === n.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>

      {/* User edit modal */}
      {editingUser && (
        <div className="modal-backdrop" onClick={() => setEditingUser(null)} role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <h2 id="edit-user-title" className="section-title">Edit user</h2>
            <p className="muted text-sm">{editingUser.email}</p>
            <form onSubmit={saveUser} className="admin-form">
              <label htmlFor="user-name" className="label">Name</label>
              <input
                id="user-name"
                type="text"
                value={userForm.name}
                onChange={(e) => setUserForm((f) => ({ ...f, name: e.target.value }))}
                className="input"
              />
              <label htmlFor="user-bio" className="label">Bio</label>
              <textarea
                id="user-bio"
                value={userForm.bio}
                onChange={(e) => setUserForm((f) => ({ ...f, bio: e.target.value }))}
                className="input"
                rows={3}
              />
              <label htmlFor="user-role" className="label">Role</label>
              <select
                id="user-role"
                value={userForm.role}
                onChange={(e) => setUserForm((f) => ({ ...f, role: e.target.value }))}
                className="input"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={userSaving}>
                  {userSaving ? "Saving…" : "Save"}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Newsletter create/edit modal */}
      {newsletterForm && (
        <div className="modal-backdrop" onClick={() => setNewsletterForm(null)} role="dialog" aria-modal="true" aria-labelledby="newsletter-form-title">
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <h2 id="newsletter-form-title" className="section-title">
              {newsletterForm === "create" ? "Add newsletter" : "Edit newsletter"}
            </h2>
            <form onSubmit={saveNewsletter} className="admin-form">
              <label htmlFor="nl-title" className="label">Title</label>
              <input
                id="nl-title"
                type="text"
                value={newsletterFormData.title}
                onChange={(e) =>
                  setNewsletterFormData((f) => ({
                    ...f,
                    title: e.target.value,
                    slug: newsletterForm === "create" ? slugFromTitle(e.target.value) : f.slug,
                  }))
                }
                className="input"
                required
              />
              <label htmlFor="nl-slug" className="label">Slug (URL-friendly)</label>
              <input
                id="nl-slug"
                type="text"
                value={newsletterFormData.slug}
                onChange={(e) => setNewsletterFormData((f) => ({ ...f, slug: e.target.value }))}
                className="input"
                placeholder="auto from title"
              />
              <label htmlFor="nl-excerpt" className="label">Excerpt (optional)</label>
              <input
                id="nl-excerpt"
                type="text"
                value={newsletterFormData.excerpt}
                onChange={(e) => setNewsletterFormData((f) => ({ ...f, excerpt: e.target.value }))}
                className="input"
              />
              <label htmlFor="nl-content" className="label">Content</label>
              <textarea
                id="nl-content"
                value={newsletterFormData.content}
                onChange={(e) => setNewsletterFormData((f) => ({ ...f, content: e.target.value }))}
                className="input"
                rows={8}
                required
              />
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={newsletterFormData.published}
                  onChange={(e) => setNewsletterFormData((f) => ({ ...f, published: e.target.checked }))}
                />
                <span>Published (visible to everyone)</span>
              </label>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={newsletterSaving}>
                  {newsletterSaving ? "Saving…" : newsletterForm === "create" ? "Create" : "Update"}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setNewsletterForm(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
