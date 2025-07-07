import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import './styles/AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

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

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
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
