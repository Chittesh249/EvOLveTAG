import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import './styles/Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);

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
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
        alert("Session expired or unauthorized. Please login again.");
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {user ? (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
