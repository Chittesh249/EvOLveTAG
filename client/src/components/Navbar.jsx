import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-section">
        <div className="logo">EvolveTAG</div>
      </div>
      
      <div className="navbar-section center-links">
        <NavLink to="/home" className="nav-link">Home</NavLink>
        <NavLink to="/papers" className="nav-link">Papers</NavLink>
        <NavLink to="/blog" className="nav-link">Blog</NavLink>
      </div>
      
      <div className="navbar-section">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;