import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './styles/AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first.");
      window.location.href = '/login';
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await API.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        alert("Access denied or session expired.");
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    fetchUsers();
  }, []);

  const handleUploadClick = () => {
    navigate('/upload');
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button className="upload-btn" onClick={handleUploadClick}>Upload Paper</button>

      <h3>All Users</h3>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
