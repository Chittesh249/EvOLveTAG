import React, { useState } from 'react';
import API from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import './styles/Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      const token = res.data.access_token;

      localStorage.setItem('token', token);
      alert("Login successful!");

      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/profile';
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
