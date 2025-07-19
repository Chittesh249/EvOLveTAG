import React, { useState } from 'react';
import API from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import './styles/Login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

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
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Welcome back!</h2>

        <label htmlFor='email'>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label htmlFor='password'>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <div className="forgot-password">
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit">Login</button>

        <div className="signup-text">
          Don’t have an account? <a href="#">Sign up</a>
        </div>
      </form>
    </div>
  );
}
