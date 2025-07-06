import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import './styles/Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login first.");
        window.location.href = '/login';
        return;
      }

      try {
        const res = await API.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setEditForm({ name: res.data.name || '', bio: res.data.bio || '' });
        setLoading(false);
      } catch (err) {
        alert("Session expired or unauthorized. Please login again.");
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await API.patch('/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully.");
      setUser(res.data);
    } catch (err) {
      alert("Update failed.");
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <form onSubmit={handleUpdate}>
        <label>Email</label>
        <input type="text" value={user.email} disabled />

        <label>Role</label>
        <input type="text" value={user.role} disabled />

        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={editForm.name}
          onChange={handleChange}
        />

        <label htmlFor="bio">Bio</label>
        <textarea
          name="bio"
          value={editForm.bio}
          rows="4"
          onChange={handleChange}
        />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}
